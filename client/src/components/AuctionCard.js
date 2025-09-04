"use client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";

export default function AuctionCard({
  item,
  type = "upcoming",
  timer,
  isClosed,
  onEdit,
  onDelete,
}) {
  const router = useRouter();

  const handleNavigation = () => {
    if (type === "live") {
      router.push(`/spectate/${item.id}`);
    } else if (type === "upcoming") {
      router.push(`/register/${item.id}`);
    } else if (type === "top-picks") {
      router.push(`/auction/${item.id}`);
    } else if (type === "bidding-history") {
      router.push(`/auction/${item.id}`);
    }
  };

  return (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      layout
      className="bg-[#111827] border border-[#374151] rounded-xl shadow-md p-4 flex flex-col items-center hover:scale-105 transition-transform relative"
    >
      {/* Image / Video Placeholder */}
      <div className="w-full h-40 bg-[#1F2937] rounded-lg mb-3 flex items-center justify-center text-[#6B7280]">
        {type === "live" ? "🎥 Live Stream" : "🖼️ Image Placeholder"}
      </div>

      {/* Auction Title & Description */}
      <h3 className="font-semibold text-lg text-center text-white">
        {item.title}
      </h3>
      <p className="text-[#9CA3AF] text-sm text-center mb-3">
        {item.description}
      </p>

      {/* Upcoming Auction Timer */}
      {type === "upcoming" && (
        <div
          className={`px-4 py-1 rounded-full text-sm font-bold shadow-lg mb-3 ${
            isClosed ? "bg-[#B91C1C] text-white" : "bg-[#2563EB]"
          }`}
        >
          {isClosed
            ? "Registration Closed"
            : `Closes in: ${timer.minutes}:${timer.seconds
                .toString()
                .padStart(2, "0")}`}
        </div>
      )}

      {/* Live Auction Price */}
      {type === "live" && (
        <div className="text-[#34D399] font-bold text-lg mb-3">
          Current Bid: ₹{item.currentBid}
        </div>
      )}

      {/* Top Picks Special Badge */}
      {type === "top-picks" && (
        <span className="absolute top-3 left-3 bg-[#F59E0B] text-black text-xs font-bold px-3 py-1 rounded-full shadow-md">
          ⭐ Top Pick
        </span>
      )}

      {/* Bidding History */}
      {type === "bidding-history" && (
        <div className="text-sm text-[#9CA3AF] mb-3 text-center">
          <p>
            <span className="text-[#34D399] font-bold">Your Bid:</span> ₹
            {item.myBid}
          </p>
          <p>
            <span className="text-[#FBBF24] font-bold">Final Price:</span> ₹
            {item.finalPrice}
          </p>
          <p>
            <span className="text-[#3B82F6] font-bold">Status:</span>{" "}
            {item.status}
          </p>
        </div>
      )}

      {/* My Listings (Edit & Delete Buttons) */}
      {type === "my-listings" && (
        <div className="flex gap-3 w-full justify-center mt-3">
          <button
            onClick={() => onEdit(item)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] transition text-white font-medium shadow-md"
          >
            <FaEdit /> Edit
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#DC2626] hover:bg-[#B91C1C] transition text-white font-medium shadow-md"
          >
            <FaTrash /> Delete
          </button>
        </div>
      )}

      {/* Button for Other Contexts */}
      {(type === "upcoming" ||
        type === "live" ||
        type === "top-picks" ||
        type === "bidding-history") && (
        <button
          disabled={isClosed && type === "upcoming"}
          onClick={handleNavigation}
          className={`mt-3 px-4 py-2 rounded-lg transition text-white font-medium shadow-md flex items-center gap-2 ${
            type === "live"
              ? "bg-[#10B981] hover:bg-[#059669]"
              : isClosed
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-[#2563EB] hover:bg-[#1D4ED8]"
          }`}
        >
          <FaEye />{" "}
          {type === "live"
            ? "Spectate"
            : type === "top-picks"
            ? "View Details"
            : type === "bidding-history"
            ? "View Auction"
            : isClosed
            ? "Closed"
            : "Register Now"}
        </button>
      )}
    </motion.div>
  );
}
