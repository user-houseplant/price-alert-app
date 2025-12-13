'use client';
import { useEffect, useState } from 'react';

type Product = {
  _id: string;
  title: string;
  site?: string;
  price?: number;
  url?: string;
};

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [q, setQ] = useState('');        // input value
  const [query, setQuery] = useState(''); // active search query (applies when hitting Search/Enter)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('http://localhost:5000/api/products');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setProducts(data);
      } catch (err: any) {
        setError(err.message || 'Error');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // use `query` for filtering so the Search button / Enter apply it
  const filtered = products.filter((p) =>
    p.title?.toLowerCase().includes(query.trim().toLowerCase())
  );

  function handleSearch() {
    // apply current input `q` as the active search
    setQuery(q);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }

  function handleClear() {
    setQ('');
    setQuery('');
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="max-w-2xl w-full px-6 py-10 border border-gray-700 rounded-2xl bg-zinc-900/70">
        <h1 className="text-3xl font-semibold mb-2">Price Comparison + Alert System</h1>
        <p className="text-sm text-gray-300 mb-6">
          Search a product and we&apos;ll show prices from multiple sites.
        </p>

        {/* Search bar */}
        <div className="flex gap-2 mb-6">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={handleKeyDown}
            type="text"
            placeholder="Search for a product (eg. iPhone 15)…"
            className="flex-1 px-3 py-2 rounded-lg bg-black border border-gray-700 outline-none text-sm"
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 rounded-lg bg-indigo-500 text-sm font-medium"
          >
            Search
          </button>
          <button
            onClick={handleClear}
            className="px-3 py-2 rounded-lg bg-gray-700 text-sm text-gray-200"
            title="Clear"
          >
            Clear
          </button>
        </div>

        {/* Results box */}
        <div className="border border-dashed border-gray-600 rounded-lg p-4 text-sm text-gray-300">
          {loading && <div>Loading products…</div>}
          {error && <div className="text-red-400">Error: {error}</div>}
          {!loading && !error && query && filtered.length === 0 && (
            <div>No products found for "{query}".</div>
          )}
          {!loading && !error && !query && <div>Type a search and press Search or Enter.</div>}

          {!loading && !error && filtered.length > 0 && (
            <ul className="space-y-3">
              {filtered.map((p) => (
                <li key={p._id} className="p-3 bg-black/40 rounded-md">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <div className="font-medium">{p.title}</div>
                      <div className="text-xs text-gray-400">{p.site}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">₹{p.price ?? '—'}</div>
                      {p.url && (
                        <a
                          href={p.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-indigo-300 underline"
                        >
                          View
                        </a>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}
