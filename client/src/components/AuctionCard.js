"use client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { FaEye, FaEdit } from "react-icons/fa";
import { useEffect, useState, useMemo } from "react";

export default function AuctionCard({ item, type = "register" }) {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(0);

  // ⏳ Calculate countdown based on registrationClosingDate
  useEffect(() => {
    if (!item?.registrationClosingDate) return;

    const closingTime = new Date(item.registrationClosingDate).getTime();
    const updateTimer = () => {
      const remaining = closingTime - Date.now();
      setTimeLeft(Math.max(remaining, 0));
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [item?.registrationClosingDate]);

  // Format countdown → MM:SS
  const displayTimer = useMemo(() => {
    if (timeLeft <= 0) return "00:00";
    const minutes = String(Math.floor(timeLeft / 60000)).padStart(2, "0");
    const seconds = String(Math.floor((timeLeft % 60000) / 1000)).padStart(2, "0");
    return `${minutes}:${seconds}`;
  }, [timeLeft]);

  const isClosed = timeLeft <= 0;

  // Navigate based on type
  const handleNavigation = () => {
    router.push(type === "spectate" ? `/spectate/${item.id}` : `/item/${item.id}`);
  };

  // Edit listing handler
  const handleEdit = () => {
    router.push(`/create-listing?id=${item.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      layout
      className="bg-[#1E293B] border border-[#334155] rounded-2xl shadow-lg p-5 flex flex-col items-center hover:shadow-xl hover:border-[#2563EB] transition-all duration-300"
    >
      {/* 🖼 Image Section */}
      <div className="w-full h-44 rounded-xl mb-4 overflow-hidden bg-[#0F172A]">
        <img
          src={
            item?.imageUrl?.trim()
              ? item.imageUrl
              : "https://images.unsplash.com/photo-1526948128573-703ee1aeb6fa?w=600&h=400&fit=crop"
          }
          alt={item?.title || "Auction Item"}
          className="w-full h-full object-cover rounded-xl"
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1526948128573-703ee1aeb6fa?w=600&h=400&fit=crop";
          }}
        />
      </div>

      {/* 🏷 Title */}
      <h3 className="font-semibold text-lg text-center text-white leading-snug">
        {item.title}
      </h3>

      {/* 📝 Description */}
      <p className="text-[#94A3B8] text-sm text-center mt-1 mb-3 line-clamp-2">
        {item.description}
      </p>

      {/* ⏳ Auction Timer */}
      {type === "register" && (
        <div
          className={`px-4 py-1 rounded-full text-xs font-bold shadow-md mb-3 transition ${
            isClosed ? "bg-[#EF4444]" : "bg-[#2563EB]"
          } text-white`}
        >
          {isClosed ? "Registration Closed" : `Closes in: ${displayTimer}`}
        </div>
      )}

      {/* 💰 Current Bid for Spectators */}
      {type === "spectate" && (
        <div className="text-[#34D399] font-bold text-lg mb-3">
          Current Bid: ₹{item.currentBid}
        </div>
      )}

      {/* 🔘 Action Button */}
      {type === "my-listings" ? (
        <button
          onClick={handleEdit}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#2563EB] text-[#2563EB] font-medium hover:bg-[#2563EB]/10 hover:scale-105 transition-all"
        >
          <FaEdit className="text-lg" /> Edit Listing
        </button>
      ) : (
        <button
          disabled={isClosed && type === "register"}
          onClick={handleNavigation}
          className={`mt-3 px-4 py-2 rounded-lg transition text-white font-medium shadow-md flex items-center gap-2 ${
            type === "spectate"
              ? "bg-[#10B981] hover:bg-[#059669]"
              : isClosed
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-[#2563EB] hover:bg-[#1D4ED8]"
          }`}
        >
          {type === "spectate" ? (
            <>
              <FaEye /> Spectate
            </>
          ) : (
            "Register Now"
          )}
        </button>
      )}
    </motion.div>
  );
}
