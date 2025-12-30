"use client";

import { useState } from "react";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import ProductGrid from "../components/ProductGrid";
import { ShoppingBag } from "lucide-react";

type Product = {
  title: string;
  price: number;
  image: string;
  link: string;
  source: string;
  badge?: string;
};

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (query: string) => {
    setLoading(true);
    setError(null);
    setSearched(true);
    setProducts([]);

    try {
      const res = await fetch(`http://localhost:5000/api/search?query=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error("Failed to fetch results");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      setError("Failed to fetch products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center">
      {/* Light subtle grain or mesh gradient */}
      <div className="absolute inset-0 bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-50 pointer-events-none"></div>

      <Header />

      <main className="flex-1 w-full flex flex-col items-center pt-10 sm:pt-20 gap-12 z-10">
        <div className="text-center space-y-4 px-6 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#BFC7DE] bg-white text-[#2D2A32] text-xs font-bold mb-4 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E07A78] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E07A78]"></span>
            </span>
            Real-time Price Tracking
          </div>
          <h2 className="text-4xl sm:text-6xl font-bold tracking-tight text-[#2D2A32] drop-shadow-sm">
            Find the <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2D2A32] to-[#E07A78]">Lowest Price</span> instantly.
          </h2>
          <p className="text-[#2D2A32]/80 text-lg font-medium leading-relaxed">
            Compare prices across Amazon and Flipkart in one click. Stop overpaying for your favorite tech.
          </p>
        </div>

        <div className="w-full px-6">
          <SearchBar onSearch={handleSearch} isLoading={loading} />
        </div>

        {error && (
          <div className="text-red-400 bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/20">
            {error}
          </div>
        )}

        {!loading && searched && products.length === 0 && !error && (
          <div className="flex flex-col items-center justify-center text-gray-500 py-20">
            <ShoppingBag className="w-12 h-12 mb-4 opacity-20" />
            <p>No products found. Try a different search term.</p>
          </div>
        )}

        <ProductGrid products={products} />
      </main>

      <footer className="py-8 text-center text-gray-600 text-sm">
        <p>&copy; {new Date().getFullYear()} PriceWise. Built for savvy shoppers.</p>
      </footer>
    </div>
  );
}
