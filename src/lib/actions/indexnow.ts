"use server";

import sitemap from "@/app/sitemap";

export async function getSitemapUrlsAction() {
  try {
    const sitemapEntries = await sitemap();
    return { success: true, urls: sitemapEntries.map((e) => e.url) };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to retrieve sitemap URLs" };
  }
}

export async function submitUrlsToIndexNowAction() {
  try {
    const sitemapEntries = await sitemap();
    const urls = sitemapEntries.map((entry) => entry.url);
    
    const payload = {
      host: "scriptly.store",
      key: "ba3534d2bbb246e2847d79cf7ec63a10",
      keyLocation: "https://scriptly.store/ba3534d2bbb246e2847d79cf7ec63a10.txt",
      urlList: urls,
    };
    
    const response = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      const text = await response.text();
      return { 
        success: false, 
        error: `IndexNow API error (status ${response.status}): ${text}` 
      };
    }
    
    return { success: true, count: urls.length, urls };
  } catch (error: any) {
    return { success: false, error: error.message || "Network error submitting to IndexNow" };
  }
}
