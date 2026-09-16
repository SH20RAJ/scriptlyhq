/**
 * On-demand lazy loader for Razorpay Checkout JavaScript SDK.
 * Prevents loading the 80KB+ payment bundle across marketing, blog, and browsing routes.
 */

declare global {
  interface Window {
    Razorpay?: any;
  }
}

let loadPromise: Promise<boolean> | null = null;

export function loadRazorpayScript(): Promise<boolean> {
  if (typeof window === "undefined") {
    return Promise.resolve(false);
  }

  if (window.Razorpay) {
    return Promise.resolve(true);
  }

  if (loadPromise) {
    return loadPromise;
  }

  loadPromise = new Promise((resolve, reject) => {
    // Check if script element already exists in DOM
    const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(true));
      existingScript.addEventListener("error", () => reject(new Error("Failed to load Razorpay SDK")));
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      loadPromise = null;
      reject(new Error("Failed to load Razorpay payment SDK. Please check your internet connection."));
    };
    document.head.appendChild(script);
  });

  return loadPromise;
}
