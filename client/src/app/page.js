"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AuctionCard from "../components/AuctionCard";
import { useAuth } from "../context/AuthContext";
import api from "../lib/axios";

export default function HomePage() {
  const router = useRouter();
  const { info } = useAuth();

  const initialUpcoming = Array.from({ length: 4 }).map((_, idx) => ({
    id: idx,
    title: `Upcoming Auction ${idx + 1}`,
    description: "Register now before it's too late!",
    registrationClose: Date.now() + (idx + 1) * 70000,
  }));

  const initialLive = Array.from({ length: 4 }).map((_, idx) => ({
    id: idx,
    title: `Live Auction ${idx + 1}`,
    currentBid: 5000 + idx * 800,
    description: "Bidding is live! Watch or participate now.",
  }));

  const [upcoming, setUpcoming] = useState(initialUpcoming);
  const [live, setLive] = useState(initialLive);
  const [timers, setTimers] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);

  // Helper: Get Authorization header
  const getAuthHeaders = () => {
    const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
    return userInfo?.token ? { Authorization: `Bearer ${userInfo.token}` } : {};
  };

  // Remove expired auctions on refresh
  useEffect(() => {
    const now = Date.now();
    setUpcoming(initialUpcoming.filter((item) => item.registrationClose > now));
  }, []);

  // Countdown for upcoming auctions
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const updatedTimers = {};
      upcoming.forEach((item) => {
        const timeLeft = item.registrationClose - now;
        updatedTimers[item.id] = timeLeft > 0 ? timeLeft : 0;
      });
      setTimers(updatedTimers);
    }, 1000);
    return () => clearInterval(interval);
  }, [upcoming]);

  // Fetch search results only when input length > 3
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchQuery.length <= 3) {
        setSearchResults([]);
        setUpcoming(initialUpcoming);
        setLive(initialLive);
        setNoResults(false);
        return;
      }

      setLoading(true);
      try {
        const response = await api.get(
          `auctions/search-items/${searchQuery}`,
          { headers: { ...getAuthHeaders() } }
        );

        const results = Array.isArray(response.data?.info)
          ? response.data.info
          : [];

        setSearchResults(results);
        setUpcoming([]);
        setLive([]);
        setNoResults(results.length === 0);
      } catch (error) {
        console.error("Search failed:", error);
        setSearchResults([]);
        setNoResults(true);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchSearchResults, 500);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-[#111827] text-white">
      <Navbar />
      <div className="pt-28 px-6 max-w-7xl mx-auto flex flex-col gap-12">

        {/* Search + Create Listing */}
        <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-5 mb-6">
          <input
            type="text"
            placeholder="Search for auctions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-[60%] px-5 py-3 rounded-xl bg-[#1F2937] border border-[#374151] focus:outline-none focus:ring-2 focus:ring-[#2563EB] text-[#FFFFFF] placeholder-[#9CA3AF] shadow-lg"
          />
          <button
            onClick={() =>
              !JSON.parse(sessionStorage.getItem("userInfo"))?.token
                ? router.push("/login")
                : router.push("/create-listing")
            }
            className="px-6 py-3 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] transition text-white font-semibold shadow-md"
          >
            + Create New Listing
          </button>
        </div>

        {/* Loader */}
        {loading && (
          <p className="text-center text-gray-300 text-lg">🔍 Searching...</p>
        )}

        {/* Upcoming Auctions */}
        {upcoming.length > 0 && !searchQuery && (
          <section className="bg-[#1F2937] rounded-2xl p-6 shadow-xl border border-[#2D3748]">
            <h2 className="text-2xl font-bold mb-5">⏳ Upcoming Auctions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {upcoming.map((item) => {
                const timeLeft = timers[item.id] || 0;
                return (
                  <AuctionCard
                    key={item.id}
                    item={item}
                    type="upcoming"
                    timer={{
                      minutes: Math.floor(timeLeft / 60000),
                      seconds: Math.floor((timeLeft % 60000) / 1000),
                    }}
                    isClosed={timeLeft <= 0}
                  />
                );
              })}
            </div>
          </section>
        )}

        {/* Live Auctions */}
        {live.length > 0 && !searchQuery && (
          <section className="bg-[#1F2937] rounded-2xl p-6 shadow-xl border border-[#2D3748]">
            <h2 className="text-2xl font-bold mb-5">🎥 Live Auctions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {live.map((item) => (
                <AuctionCard key={item.id} item={item} type="live" />
              ))}
            </div>
          </section>
        )}

        {/* Search Results */}
        {!loading && searchQuery.length > 3 && (
          <section className="bg-[#1F2937] rounded-2xl p-6 shadow-xl border border-[#2D3748]">
            <h2 className="text-2xl font-bold mb-5">🔍 Search Results</h2>
            {noResults ? (
              <p className="text-center text-gray-400 text-lg py-10">
                ❌ No results found for "<span className="font-semibold">{searchQuery}</span>"
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {searchResults.map((item) => (
                  <AuctionCard
                    key={item.id}
                    item={item}
                    type="search"
                    timer={{ minutes: 0, seconds: 0 }}
                    isClosed={false}
                  />
                ))}
              </div>
            )}
          </section>
        )}
      </div>
      <Footer />
    </div>
  );
}
