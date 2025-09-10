"use client";
import { useState, useEffect } from "react";
import api from "../lib/axios";
import AuctionCard from "./AuctionCard";

export default function SearchResults({ query }) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);

  const getAuthHeaders = () => {
    const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
    return userInfo?.token ? { Authorization: `Bearer ${userInfo.token}` } : {};
  };

  useEffect(() => {
    const fetchResults = async () => {
      if (!query || query.length < 3) return;

      setLoading(true);
      try {
        const response = await api.get(`/search-items/${query}`, {
          headers: { ...getAuthHeaders() },
        });
        console.log("Search Results:", response);
        const items = response?.data?.info?.itemList || [];

        setResults(items);
        setNoResults(items.length === 0);
      } catch (error) {
        console.error("Search failed:", error);
        setResults([]);
        setNoResults(true);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchResults, 400);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <section className="bg-[#1F2937] rounded-2xl p-6 shadow-xl border border-[#2D3748]">
      <h2 className="text-2xl font-bold mb-5">🔍 Search Results</h2>
      {loading ? (
        <p className="text-center text-gray-300 text-lg">🔍 Searching...</p>
      ) : noResults ? (
        <p className="text-center text-gray-400 text-lg py-10">
          ❌ No results found for "<span className="font-semibold">{query}</span>"
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {results.map(({ item }) => (
                    <AuctionCard key={item.id} item={item} type="register" />
                  ))}
        </div>
      )}
    </section>
  );
}
