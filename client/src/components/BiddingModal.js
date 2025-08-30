"use client";
import { useState } from "react";

export default function BiddingModal({ item, onClose }) {
  const [bidAmount, setBidAmount] = useState("");

  const handleBid = () => {
    if (parseInt(bidAmount) <= item.highestBid) {
      alert("Your bid must be higher than the current highest bid!");
      return;
    }
    alert(`Bid placed successfully for ₹${bidAmount}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-[#1F2937] rounded-2xl p-8 w-full max-w-md shadow-xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#9CA3AF] hover:text-white"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-[#2563EB] mb-4">
          Place Your Bid
        </h2>
        <p className="text-[#9CA3AF] mb-3">
          Current Highest Bid:{" "}
          <span className="text-[#22C55E] font-semibold">
            ₹{item.highestBid}
          </span>
        </p>

        {/* Bid Input */}
        <input
          type="number"
          value={bidAmount}
          onChange={(e) => setBidAmount(e.target.value)}
          placeholder="Enter your bid amount"
          className="w-full px-4 py-3 rounded-lg bg-[#111827] border border-[#374151] focus:outline-none focus:ring-2 focus:ring-[#2563EB] text-white placeholder-[#9CA3AF] shadow-md mb-5"
        />

        {/* Place Bid Button */}
        <button
          onClick={handleBid}
          className="w-full py-3 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold shadow-lg transition duration-300"
        >
          Confirm Bid
        </button>
      </div>
    </div>
  );
}
