"use client";

import { Search, Loader2 } from "lucide-react";
import { useState } from "react";

type SearchBarProps = {
    onSearch: (query: string) => void;
    isLoading: boolean;
};

export default function SearchBar({ onSearch, isLoading }: SearchBarProps) {
    const [input, setInput] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim()) onSearch(input.trim());
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#BFC7DE] to-[#E07A78] rounded-xl opacity-40 group-hover:opacity-80 transition duration-500 blur-md"></div>
            <div className="relative flex items-center bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xl">
                <div className="pl-4 text-[#2D2A32]">
                    <Search className="w-5 h-5" />
                </div>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Search products..."
                    className="w-full bg-transparent px-4 py-4 text-[#2D2A32] placeholder-[#2D2A32]/50 focus:outline-none text-lg font-medium"
                />
                <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-4 bg-gradient-to-r from-[#E07A78] to-[#d65f5d] hover:from-[#d65f5d] hover:to-[#c44947] text-white font-bold tracking-wide transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Search"}
                </button>
            </div>
        </form>
    );
}
