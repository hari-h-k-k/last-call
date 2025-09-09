"use client";
import { useState } from "react";
import AuctionCard from "./AuctionCard";

export default function LiveAuctions() {
  const initialLive = Array.from({ length: 4 }).map((_, idx) => ({
    id: idx,
    title: `Live Auction ${idx + 1}`,
    currentBid: 5000 + idx * 800,
    description: "Bidding is live! Watch or participate now.",
  }));

  const [live] = useState(initialLive);

  if (live.length === 0) return null;

  return (
    <section className="bg-[#1F2937] rounded-2xl p-6 shadow-xl border border-[#2D3748]">
      <h2 className="text-2xl font-bold mb-5">🎥 Live Auctions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {live.map((item) => (
          <AuctionCard key={item.id} item={item} type="spectate" />
        ))}
      </div>
    </section>
  );
}
