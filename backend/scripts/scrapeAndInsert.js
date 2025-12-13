// backend/scripts/scrapeAndInsert.js
import axios from "axios";
import { load } from "cheerio"; // correct import for cheerio
import fetch from "node-fetch"; // optional; Node18+ has fetch builtin

const BACKEND_BASE = "http://localhost:5000";

function extractPriceFromText(text) {
  if (!text) return null;
  const patterns = [
    /₹\s*([0-9.,]+)/g,
    /Rs\.?\s*([0-9.,]+)/gi,
    /\$\s*([0-9.,]+)/g,
    /([0-9][0-9,]{2,}\.?\d?)/g
  ];
  for (const re of patterns) {
    const m = re.exec(text);
    if (m && m[1]) {
      const digits = m[1].replace(/,/g, "");
      const num = Number(digits);
      if (!Number.isNaN(num) && num > 0) return num;
    }
  }
  return null;
}

async function scrapeUrl(url) {
  console.log("Fetching:", url);
  const res = await axios.get(url, {
    timeout: 20000,
    headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" }
  });
  const $ = load(res.data);

  // Title candidates
  const titleSelectors = [
    "meta[property='og:title']",
    "meta[name='twitter:title']",
    "title",
    "h1",
    "h1[itemprop='name']"
  ];
  let title = null;
  for (const sel of titleSelectors) {
    const el = $(sel);
    if (el && el.length) {
      title = el.attr("content") || el.text();
      if (title) { title = title.trim(); break; }
    }
  }

  // Try some common price selectors
  const priceSelectors = [
    ".price", ".product-price", ".selling-price", ".a-price-whole", ".a-offscreen",
    "#priceblock_ourprice", "#priceblock_dealprice", ".p_price", ".final-price", ".price_color"
  ];

  let price = null;
  for (const sel of priceSelectors) {
    const el = $(sel).first();
    if (el && el.length) {
      const txt = (el.text() || el.attr("content") || "").trim();
      const p = extractPriceFromText(txt);
      if (p) { price = p; break; }
    }
  }

  // fallback: search body text
  if (!price) {
    const bodyText = $("body").text();
    price = extractPriceFromText(bodyText);
  }

  return { title: title || null, price: price || null };
}

async function insertProduct(payload) {
  const url = `${BACKEND_BASE}/api/products`;
  const r = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  return r.json();
}

async function main() {
  const target = process.argv[2];
  if (!target) {
    console.error("Usage: node scrapeAndInsert.js <url>");
    process.exit(1);
  }

  try {
    const scraped = await scrapeUrl(target);
    console.log("Scraped:", scraped);

    const product = {
      title: scraped.title || "Scraped Product",
      site: new URL(target).hostname,
      price: scraped.price || 0,
      url: target
    };

    const resp = await insertProduct(product);
    console.log("Inserted product:", resp);
  } catch (err) {
    console.error("Error:", err.message || err);
    process.exit(1);
  }
}

main();
