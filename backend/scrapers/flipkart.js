import axios from "axios";
import * as cheerio from "cheerio";
import { normalizePrice, normalizeTitle, normalizeImage } from "../utils/normalize.js";

// Flipkart is aggressive with bot detection, but simple requests with headers
// often work for standard product listings if not heavily ratelimited.
export const scrapeFlipkart = async (query) => {
  const searchUrl = `https://www.flipkart.com/search?q=${encodeURIComponent(query)}`;

  try {
    const { data } = await axios.get(searchUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept":
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        "Connection": "keep-alive",
        "Upgrade-Insecure-Requests": "1",
      },
    });

    const $ = cheerio.load(data);
    const results = [];

    // Debug
    console.log("Flipkart Page Title:", $("title").text());
    console.log("Flipkart Content Length:", data.length);

    // Strategy: Iterate over all validation anchors
    $("a").each((_, el) => {
      const link = $(el).attr("href");
      // Flipkart product links usually contain /p/ or /itm
      if (link && (link.includes("/p/") || link.includes("/itm"))) {
        // We found a potential product link.
        // Now let's try to find context.
        // Usually the Title is the text of the anchor or a child div.
        // Price is usually in a sibling or parent's other child.

        // Go up to a common container (usually 2-4 levels up)
        const card = $(el).closest("div");

        let title = $(el).attr("title");
        // Prefer image alt as it is usually the clean product name on Flipkart
        const imgAlt = $(el).find("img").attr("alt");
        if (imgAlt) {
          title = imgAlt;
        } else if (!title) {
          title = $(el).text();
        }

        // Try to find price in the card container
        // We search for the currency symbol
        let price = card.find("div:contains('₹')").last().text();
        if (!price) {
          // Go up one more level
          price = $(el).closest("div").parent().find("div:contains('₹')").last().text();
        }

        let image = $(el).find("img").attr("src");
        if (!image) {
          // Sibling image?
          image = $(el).closest("div").parent().find("img").attr("src");
        }

        // Cleanup
        if (title) title = normalizeTitle(title);
        if (price) price = normalizePrice(price);
        if (image) image = normalizeImage(image);

        // Deduplicate: Check if we already have this link
        const exists = results.some(r => r.link.includes(link));

        if (title && price && !exists) {
          results.push({
            title,
            price,
            image,
            link: `https://flipkart.com${link}`,
            source: "Flipkart",
          });
        }
      }
    });

    return results.slice(0, 5);
  } catch (error) {
    if (error.response && error.response.status === 503) {
      console.warn("Flipkart blocked request (503). Retrying might not help without proxies.");
    } else {
      console.error("Flipkart scraper failed:", error.message);
    }
    return [];
  }
};
