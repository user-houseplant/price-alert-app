import { scrapeAmazon } from "../scrapers/amazon.js";
import { scrapeFlipkart } from "../scrapers/flipkart.js";

const cache = new Map(); // simple in-memory cache

export const searchProducts = async (req, res) => {
  const query = req.query.query;
  if (!query) return res.status(400).json({ error: "Query is required" });

  // Check cache (DISABLED FOR DEBUGGING)
  // if (cache.has(query)) {
  //   console.log(`Serving from cache for query: ${query}`);
  //   return res.json(cache.get(query));
  // }

  try {
    console.log(`Scraping for query: ${query}`);
    // Scrape all sites in parallel
    const [amazon, flipkart] = await Promise.all([
      scrapeAmazon(query),
      scrapeFlipkart(query),
    ]);

    console.log(`Results found - Amazon: ${amazon.length}, Flipkart: ${flipkart.length}`);

    const allResults = [...amazon, ...flipkart];

    // Sort by lowest price
    allResults.sort((a, b) => a.price - b.price);

    // Add "Best Deal" badge to the cheapest
    if (allResults.length > 0) {
      allResults[0].badge = "BEST DEAL";
    }

    // Save to cache
    // cache.set(query, allResults);

    res.json(allResults);
  } catch (error) {
    console.error("Search failed:", error);
    res.status(500).json({ error: "Search failed" });
  }
};