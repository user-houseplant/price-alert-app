import axios from "axios";
import * as cheerio from "cheerio";
import { normalizePrice, normalizeTitle, normalizeImage } from "../utils/normalize.js";

export const scrapeAmazon = async (query) => {
  const searchUrl = `https://www.amazon.in/s?k=${encodeURIComponent(query)}`;

  try {
    const { data } = await axios.get(searchUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
      },
    });

    const $ = cheerio.load(data);
    const results = [];

    $(".s-result-item[data-component-type='s-search-result']").each((_, el) => {
      const title = normalizeTitle($(el).find("h2 span").text());
      const price = normalizePrice($(el).find(".a-price .a-price-whole").text());
      const imageRaw = $(el).find("img.s-image").attr("src");
      const image = normalizeImage(imageRaw);

      // Try multiple selectors for the link
      let linkPart = $(el).find("a.a-link-normal.s-underline-text").attr("href");
      if (!linkPart) {
        linkPart = $(el).find("a.a-link-normal.s-no-outline").attr("href");
      }
      if (!linkPart) { // fallback
        // Find any link that contains /dp/
        linkPart = $(el).find("a[href*='/dp/']").attr("href");
      }

      // Filter out invalid links
      if (linkPart === "#" || linkPart === "javascript:void(0)") linkPart = null;

      if (title && price && linkPart && !linkPart.startsWith("http")) { // Ensure relative link
        results.push({
          title,
          price,
          image,
          link: `https://amazon.in${linkPart}`,
          source: "Amazon",
        });
      }
    });

    return results.slice(0, 5); // top 5 results
  } catch (error) {
    console.error("Amazon scraper failed:", error.message);
    return []; // return empty array on failure
  }
};
