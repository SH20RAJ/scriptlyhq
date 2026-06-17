import sitemap from "../app/sitemap";

async function main() {
  console.log("Fetching sitemap URLs...");
  try {
    const sitemapEntries = await sitemap();
    const urls = sitemapEntries.map((entry) => entry.url);
    console.log(`Found ${urls.length} URLs in sitemap.`);

    const payload = {
      host: "scriptly.store",
      key: "ba3534d2bbb246e2847d79cf7ec63a10",
      keyLocation: "https://scriptly.store/ba3534d2bbb246e2847d79cf7ec63a10.txt",
      urlList: urls,
    };

    console.log("Sending payload to IndexNow API...");
    const response = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      console.log(`Successfully submitted ${urls.length} URLs to IndexNow! Status: ${response.status}`);
    } else {
      const text = await response.text();
      console.error(`IndexNow submission failed: Status ${response.status}. Response: ${text}`);
    }
  } catch (error) {
    console.error("Error executing IndexNow script:", error);
  }
  process.exit(0);
}

main();
