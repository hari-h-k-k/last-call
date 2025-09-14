"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SearchResults from "../components/SearchResults";
import UpcomingAuctions from "../components/UpcomingAuctions";
import LiveAuctions from "../components/LiveAuctions";

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

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

        {/* Show Search or Default Sections */}
        {searchQuery.trim().length > 3 ? (
          <SearchResults query={searchQuery} />
        ) : (
          <>
            <UpcomingAuctions />
            {/* <LiveAuctions /> */}

          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
