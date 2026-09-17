import { NextRequest, NextResponse } from "next/server";
import { createPaymentLinkAction } from "@/lib/actions/payment-links";
import { encodePaymentLinkPayload } from "@/lib/payments/link-encoder";

// Handle CORS Preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

/**
 * Open Public Payment Link Creator API.
 * Accessible to everyone, including logged out users and external integrations.
 */
export async function POST(req: NextRequest) {
  try {
    const body: any = await req.json();
    const title = body.title || body.name;
    const rawPrice = body.price ?? body.prize;
    const redirectUrl = body.redirectUrl || body.redirect || body.destination;
    const description = body.description || body.desc || "";
    const currency = body.currency || "INR";
    const customSlug = body.customSlug || body.slug;
    const encryptionKey = body.key || body.encryptionKey || body.secretKey;

    if (!title || !title.trim()) {
      return NextResponse.json(
        { error: "Missing required parameter: 'title'" },
        { status: 400, headers: { "Access-Control-Allow-Origin": "*" } }
      );
    }

    if (rawPrice === undefined || rawPrice === null || Number(rawPrice) <= 0) {
      return NextResponse.json(
        { error: "Missing or invalid required parameter: 'price' (must be > 0)" },
        { status: 400, headers: { "Access-Control-Allow-Origin": "*" } }
      );
    }

    if (!redirectUrl || !redirectUrl.trim()) {
      return NextResponse.json(
        { error: "Missing required parameter: 'redirectUrl' (or 'redirect')" },
        { status: 400, headers: { "Access-Control-Allow-Origin": "*" } }
      );
    }

    const price = Number(rawPrice);
    const host = req.headers.get("host") || "scriptly.store";
    const protocol = host.includes("localhost") ? "http" : "https";
    const origin = `${protocol}://${host}`;

    // Store in database
    const result = await createPaymentLinkAction({
      title: title.trim(),
      price,
      description: description.trim(),
      redirectUrl: redirectUrl.trim(),
      currency,
      customSlug,
    });

    const slug = result.link.slug;
    const hostedUrl = `${origin}/pay/${slug}`;
    const dynamicUrl = `${origin}/pay?title=${encodeURIComponent(title)}&price=${price}&redirect=${encodeURIComponent(redirectUrl)}${description ? `&desc=${encodeURIComponent(description)}` : ""}`;
    
    // Generate secure Base64 or Key-Encrypted token
    const encodedToken = encodePaymentLinkPayload(
      {
        title,
        price,
        redirectUrl,
        description,
        currency,
      },
      {
        sign: true,
        encryptionKey: encryptionKey ? String(encryptionKey).trim() : undefined,
      }
    );
    const encodedUrl = `${origin}/pay?data=${encodedToken}`;
    const unlockedUrl = encryptionKey
      ? `${origin}/pay?data=${encodedToken}&key=${encodeURIComponent(String(encryptionKey).trim())}`
      : encodedUrl;

    return NextResponse.json(
      {
        success: true,
        message: "Payment link created successfully",
        data: {
          id: result.link.id,
          slug,
          url: hostedUrl,
          encodedUrl,
          unlockedUrl,
          dynamicUrl,
          token: encodedToken,
          isEncryptedWithKey: Boolean(encryptionKey),
          title: result.link.title,
          price: result.link.price / 100,
          currency: result.link.currency,
          redirectUrl: result.link.redirectUrl,
          createdAt: result.link.createdAt,
        },
      },
      {
        status: 201,
        headers: { "Access-Control-Allow-Origin": "*" },
      }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500, headers: { "Access-Control-Allow-Origin": "*" } }
    );
  }
}

/**
 * Open GET Endpoint:
 * Passing query parameters creates/redirects to payment page.
 * Example: /api/pay/create?title=Pro+Plan&price=499&redirect=https://example.com/thanks
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title") || searchParams.get("name");
  const rawPrice = searchParams.get("price") || searchParams.get("prize");
  const redirectUrl = searchParams.get("redirectUrl") || searchParams.get("redirect") || searchParams.get("destination");
  const description = searchParams.get("description") || searchParams.get("desc") || "";
  const format = searchParams.get("format"); // "json" or redirect
  const autoSave = searchParams.get("save") === "true";

  if (!title || !rawPrice || !redirectUrl) {
    return NextResponse.json(
      {
        error: "Missing required query parameters: 'title', 'price' (or 'prize'), 'redirect' (or 'redirectUrl')",
        example: "/api/pay/create?title=Consulting+Session&price=999&redirect=https%3A%2F%2Fmeet.google.com%2Fxyz",
      },
      { status: 400, headers: { "Access-Control-Allow-Origin": "*" } }
    );
  }

  const price = Number(rawPrice);
  const host = req.headers.get("host") || "scriptly.store";
  const protocol = host.includes("localhost") ? "http" : "https";
  const origin = `${protocol}://${host}`;

  const encryptionKey = searchParams.get("key") || searchParams.get("encryptionKey") || searchParams.get("secretKey");

  const dynamicTargetUrl = `${origin}/pay?title=${encodeURIComponent(title)}&price=${price}&redirect=${encodeURIComponent(redirectUrl)}${description ? `&desc=${encodeURIComponent(description)}` : ""}`;

  const encodedToken = encodePaymentLinkPayload(
    { title, price, redirectUrl, description },
    { sign: true, encryptionKey: encryptionKey || undefined }
  );
  const encodedUrl = `${origin}/pay?data=${encodedToken}`;
  const unlockedUrl = encryptionKey
    ? `${origin}/pay?data=${encodedToken}&key=${encodeURIComponent(encryptionKey)}`
    : encodedUrl;

  if (autoSave) {
    try {
      const result = await createPaymentLinkAction({
        title,
        price,
        description,
        redirectUrl,
      });
      const hostedUrl = `${origin}/pay/${result.link.slug}`;

      if (format === "json") {
        return NextResponse.json(
          {
            success: true,
            url: hostedUrl,
            encodedUrl,
            unlockedUrl,
            dynamicUrl: dynamicTargetUrl,
            slug: result.link.slug,
            token: encodedToken,
            isEncryptedWithKey: Boolean(encryptionKey),
            data: result.link,
          },
          { headers: { "Access-Control-Allow-Origin": "*" } }
        );
      }
      return NextResponse.redirect(hostedUrl);
    } catch (err: any) {
      // Fallback to dynamic URL if saving fails
      return NextResponse.redirect(unlockedUrl);
    }
  }

  if (format === "json") {
    return NextResponse.json(
      {
        success: true,
        dynamicUrl: dynamicTargetUrl,
        encodedUrl,
        unlockedUrl,
        token: encodedToken,
        isEncryptedWithKey: Boolean(encryptionKey),
        title,
        price,
        redirectUrl,
        description,
      },
      { headers: { "Access-Control-Allow-Origin": "*" } }
    );
  }

  // Direct redirection to the checkout page
  return NextResponse.redirect(unlockedUrl);
}
