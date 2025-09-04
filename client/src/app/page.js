"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AuctionCard from "../components/AuctionCard";
import { useAuth } from "../context/AuthContext";

export default function HomePage() {
  const router = useRouter();
  const { info } = useAuth();
  const initialUpcoming = Array.from({ length: 4 }).map((_, idx) => ({
    id: idx,
    title: `Upcoming Auction ${idx + 1}`,
    description: "Register now before it's too late!",
    registrationClose: Date.now() + (idx + 1) * 70000, // 70s * idx
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

  // Remove expired auctions when the page is refreshed
  useEffect(() => {
    const now = Date.now();
    const filteredUpcoming = initialUpcoming.filter(
      (item) => item.registrationClose > now
    );
    setUpcoming(filteredUpcoming);
  }, []);

  // Countdown logic for upcoming auctions
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const newTimers = {};

      upcoming.forEach((item) => {
        const timeLeft = item.registrationClose - now;
        newTimers[item.id] = timeLeft > 0 ? timeLeft : 0;
      });

      setTimers(newTimers);
    }, 1000);

    return () => clearInterval(interval);
  }, [upcoming]);

  // Search logic
  useEffect(() => {
    if (searchQuery.length > 3) {
      const results = Array.from({ length: 4 }).map((_, idx) => ({
        id: idx + 100,
        title: `Search Result ${idx + 1} for "${searchQuery}"`,
        price: 2000 + idx * 400,
        description: "Search matched auction.",
      }));
      setSearchResults(results);
      setUpcoming([]);
      setLive([]);
    } else {
      setSearchResults([]);
      setUpcoming(initialUpcoming);
      setLive(initialLive);
    }
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
            onClick={() => !JSON.parse(sessionStorage.getItem("userInfo")).token? router.push("/login"): router.push("/create-listing")}
            className="px-6 py-3 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] transition text-white font-semibold shadow-md"
          >
            + Create New Listing
          </button>
        </div>

        {/* Upcoming Auctions */}
        {upcoming.length > 0 && (
          <section className="bg-[#1F2937] rounded-2xl p-6 shadow-xl border border-[#2D3748]">
            <h2 className="text-2xl font-bold mb-5 text-[#FFFFFF]">⏳ Upcoming Auctions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {upcoming.map((item) => {
                const timeLeft = timers[item.id] || 0;
                const minutes = Math.floor(timeLeft / 60000);
                const seconds = Math.floor((timeLeft % 60000) / 1000);
                return (
                  <AuctionCard
                    key={item.id}
                    item={item}
                    type="upcoming"
                    timer={{ minutes, seconds }}
                    isClosed={timeLeft <= 0}
                  />
                );
              })}
            </div>
          </section>
        )}

        {/* Live Auctions */}
        {live.length > 0 && (
          <section className="bg-[#1F2937] rounded-2xl p-6 shadow-xl border border-[#2D3748]">
            <h2 className="text-2xl font-bold mb-5 text-[#FFFFFF]">🎥 Live Auctions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {live.map((item) => (
                <AuctionCard key={item.id} item={item} type="live" />
              ))}
            </div>
          </section>
        )}

        {/* Search Results */}
        {searchResults.length > 0 && (
          <section className="bg-[#1F2937] rounded-2xl p-6 shadow-xl border border-[#2D3748]">
            <h2 className="text-2xl font-bold mb-5 text-[#FFFFFF]">🔍 Search Results</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {searchResults.map((item) => {
               const timeLeft = timers[item.id] || 0;
               const minutes = Math.floor(timeLeft / 60000);
               const seconds = Math.floor((timeLeft % 60000) / 1000);
               return (
                 <AuctionCard
                   key={item.id}
                   item={item}
                   type="upcoming"
                   timer={{ minutes, seconds }}
                   isClosed={timeLeft <= 0}
                 />
               );
             })}
            </div>
          </section>
        )}

      </div>
      <Footer />
    </div>
  );
}
