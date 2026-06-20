import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../db";
import { products } from "../../../../db/schema";
import { eq, or, sql } from "drizzle-orm";
import crypto from "crypto";

function authorize(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  const searchParams = new URL(request.url).searchParams;
  const token = authHeader?.replace("Bearer ", "") || searchParams.get("token") || searchParams.get("apiKey");
  return token === process.env.AGENT_API_KEY;
}

export async function GET(request: NextRequest) {
  if (!authorize(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Create message queue table if not exists
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS mcp_messages (
      id SERIAL PRIMARY KEY,
      session_id TEXT NOT NULL,
      recipient TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);

  const sessionId = crypto.randomUUID();
  const origin = request.nextUrl.origin;

  const responseStream = new ReadableStream({
    async start(controller) {
      console.log(`MCP Client connected. Established SSE session: ${sessionId}`);
      
      // Enqueue the connection endpoint configuration
      const endpointEvent = `event: endpoint\ndata: ${origin}/api/agents/mcp?session=${sessionId}&token=${process.env.AGENT_API_KEY}\n\n`;
      controller.enqueue(new TextEncoder().encode(endpointEvent));

      const interval = setInterval(async () => {
        try {
          // Poll database for messages destined for the client
          const result = await db.execute(sql`
            SELECT id, message FROM mcp_messages 
            WHERE session_id = ${sessionId} AND recipient = 'client' 
            ORDER BY id ASC
          `) as any;

          if (result && result.rows && result.rows.length > 0) {
            for (const row of result.rows) {
              console.log(`Sending message from queue to client:`, row.message);
              controller.enqueue(new TextEncoder().encode(`event: message\ndata: ${row.message}\n\n`));
              
              // Clear message from database queue
              await db.execute(sql`DELETE FROM mcp_messages WHERE id = ${row.id}`);
            }
          } else {
            // Keep connection alive with SSE ping comment
            controller.enqueue(new TextEncoder().encode(`:\n\n`));
          }
        } catch (err) {
          console.error("Error in MCP SSE polling loop:", err);
        }
      }, 1000);

      request.signal.addEventListener("abort", () => {
        console.log(`MCP Client disconnected. Cleaning up session: ${sessionId}`);
        clearInterval(interval);
        db.execute(sql`DELETE FROM mcp_messages WHERE session_id = ${sessionId}`).catch(console.error);
      });
    }
  });

  return new NextResponse(responseStream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
    }
  });
}

export async function POST(request: NextRequest) {
  console.log("MCP POST request.url:", request.url);
  console.log("MCP POST nextUrl:", request.nextUrl.toString());
  
  const searchParams = request.nextUrl.searchParams;
  const sessionId = searchParams.get("session") || 
                    searchParams.get("sessionId") || 
                    request.headers.get("mcp-session-id") || 
                    request.headers.get("Mcp-Session-Id");
                    
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "") || searchParams.get("token") || searchParams.get("apiKey");

  console.log(`MCP POST Auth: token=${token ? "present" : "missing"}, sessionId=${sessionId}`);

  if (!authorize(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!sessionId) {
    return NextResponse.json({ error: "Missing session ID" }, { status: 400 });
  }

  try {
    const json = await request.json() as any;
    console.log(`Received JSON-RPC request for session ${sessionId}:`, JSON.stringify(json));

    let responseJson: any = null;

    if (json.method === "initialize") {
      responseJson = {
        jsonrpc: "2.0",
        id: json.id,
        result: {
          protocolVersion: "2024-11-05",
          capabilities: {
            tools: {}
          },
          serverInfo: {
            name: "scriptly-agent-server",
            version: "1.0.0"
          }
        }
      };
    } else if (json.method === "notifications/initialized") {
      return new NextResponse(null, { status: 202 });
    } else if (json.method === "tools/list") {
      responseJson = {
        jsonrpc: "2.0",
        id: json.id,
        result: {
          tools: [
            {
              name: "list_products",
              description: "List products from the store catalog",
              inputSchema: {
                type: "object",
                properties: {
                  category: { type: "string", description: "Filter products by category slug (e.g. 'ui-kits')" },
                  limit: { type: "number", description: "Maximum number of products to return (default 50)" }
                }
              }
            },
            {
              name: "create_product",
              description: "Create and publish a new digital product listing",
              inputSchema: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  slug: { type: "string" },
                  shortDescription: { type: "string" },
                  description: { type: "string" },
                  category: { type: "string" },
                  price: { type: "number", description: "Price in paise (paise = INR cents, e.g. 2500 is ₹25.00)" },
                  tags: { type: "string", description: "Comma-separated list of tags (e.g., 'animation, react')" },
                  thumbnail: { type: "string", description: "jsDelivr image URL" },
                  previewGif: { type: "string", description: "jsDelivr GIF/WebP preview URL" },
                  fileUrl: { type: "string", description: "Product file URL or path" }
                },
                required: ["title", "slug", "shortDescription", "description", "category", "price"]
              }
            },
            {
              name: "update_product",
              description: "Update fields of an existing product listing",
              inputSchema: {
                type: "object",
                properties: {
                  id: { type: "string", description: "UUID or unique slug of the product to update" },
                  title: { type: "string" },
                  slug: { type: "string" },
                  price: { type: "number", description: "Price in paise" },
                  published: { type: "boolean" },
                  tags: { type: "string" }
                },
                required: ["id"]
              }
            },
            {
              name: "delete_product",
              description: "Delete a product from the database permanently",
              inputSchema: {
                type: "object",
                properties: {
                  id: { type: "string", description: "UUID or unique slug of the product to delete" }
                },
                required: ["id"]
              }
            }
          ]
        }
      };
    } else if (json.method === "tools/call") {
      const { name, arguments: args } = json.params;
      let toolResult: any = null;

      try {
        if (name === "list_products") {
          const limit = Math.min(Number(args.limit || 50), 200);
          const category = args.category;
          
          let results;
          if (category) {
            results = await db.select().from(products).where(eq(products.category, category)).limit(limit);
          } else {
            results = await db.select().from(products).limit(limit);
          }
          
          toolResult = {
            content: [
              {
                type: "text",
                text: JSON.stringify(results, null, 2)
              }
            ]
          };
        } else if (name === "create_product") {
          const cleanSlug = args.slug
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");

          const id = crypto.randomUUID();

          await db.insert(products).values({
            id,
            title: args.title,
            slug: cleanSlug,
            shortDescription: args.shortDescription,
            description: args.description,
            category: args.category,
            price: Number(args.price),
            tags: args.tags || null,
            thumbnail: args.thumbnail || null,
            previewGif: args.previewGif || null,
            fileUrl: args.fileUrl || null,
            published: true,
            status: "approved"
          });

          toolResult = {
            content: [
              {
                type: "text",
                text: `Successfully created product. ID: ${id}, Slug: ${cleanSlug}`
              }
            ]
          };
        } else if (name === "update_product") {
          const updateData: any = {};
          if (args.title) updateData.title = args.title;
          if (args.price) updateData.price = Number(args.price);
          if (args.published !== undefined) updateData.published = !!args.published;
          if (args.tags) updateData.tags = args.tags;
          
          if (args.slug) {
            updateData.slug = args.slug
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/(^-|-$)/g, "");
          }

          updateData.updatedAt = new Date();

          await db.update(products).set(updateData).where(or(eq(products.id, args.id), eq(products.slug, args.id)));

          toolResult = {
            content: [
              {
                type: "text",
                text: `Successfully updated product ${args.id}`
              }
            ]
          };
        } else if (name === "delete_product") {
          await db.delete(products).where(or(eq(products.id, args.id), eq(products.slug, args.id)));
          
          toolResult = {
            content: [
              {
                type: "text",
                text: `Successfully deleted product ${args.id}`
              }
            ]
          };
        } else {
          throw new Error(`Unknown tool: ${name}`);
        }
      } catch (err: any) {
        toolResult = {
          isError: true,
          content: [
            {
              type: "text",
              text: `Error executing tool: ${err.message || err}`
            }
          ]
        };
      }

      responseJson = {
        jsonrpc: "2.0",
        id: json.id,
        result: toolResult
      };
    } else {
      responseJson = {
        jsonrpc: "2.0",
        id: json.id,
        error: {
          code: -32601,
          message: `Method not found: ${json.method}`
        }
      };
    }

    if (responseJson) {
      const responseText = JSON.stringify(responseJson);
      await db.execute(sql`
        INSERT INTO mcp_messages (session_id, recipient, message)
        VALUES (${sessionId}, 'client', ${responseText})
      `);
    }

    return new NextResponse(null, { status: 202 });
  } catch (error: any) {
    console.error("POST session handling failed:", error);
    return NextResponse.json({ error: error.message || "Server error" }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
