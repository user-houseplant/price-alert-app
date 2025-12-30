import { scrapeAmazon } from "../scrapers/amazon.js";
import { scrapeFlipkart } from "../scrapers/flipkart.js";

const test = async () => {
    const queries = ["iphone 15", "samsung s24", "sony wh-1000xm5"];

    console.log("Testing scrapers for:", queries.join(", "));

    (async () => {
        for (const query of queries) {
            console.log(`\n\n=== Testing: ${query} ===`);

            console.log("--- Amazon ---");
            const amazonResults = await scrapeAmazon(query);
            console.log(JSON.stringify(amazonResults, null, 2));

            console.log("\n--- Flipkart ---");
            const flipkartResults = await scrapeFlipkart(query);
            console.log(JSON.stringify(flipkartResults, null, 2));
        }
    })();
};

test();
