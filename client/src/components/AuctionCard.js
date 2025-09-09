"use client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { FaEdit, FaEye } from "react-icons/fa";
import { useMemo } from "react";

export default function AuctionCard({
  item,
  type = "upcoming",
  timer,
  isClosed,
}) {
  const router = useRouter();

  // ✅ Utility: Get token safely from sessionStorage or localStorage
  const getToken = () => {
    const userInfo = JSON.parse(sessionStorage.getItem("userInfo")) || {};
    return userInfo?.token || localStorage.getItem("token") || "";
  };

  // Handle navigation with token check
  const handleNavigation = () => {
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }

    // ✅ If token exists → normal navigation
    if (type === "live") {
      router.push(`/spectate/${item.id}`);
    } else if (type === "upcoming") {
      router.push(`/item/${item.id}`);
    } else if (type === "top-picks" || type === "bidding-history") {
      router.push(`/auction/${item.id}`);
    }
  };

  // Edit listing button with token check
  const handleEdit = () => {
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }
    router.push(`/create-listing?id=${item.id}`);
  };

  // ✅ Memoize timer to avoid hydration mismatches
  const displayTimer = useMemo(() => {
    if (!timer) return null;
    const minutes = String(timer.minutes || 0).padStart(2, "0");
    const seconds = String(timer.seconds || 0).padStart(2, "0");
    return `${minutes}:${seconds}`;
  }, [timer]);

  return (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      layout
      className="bg-[#1E293B] border border-[#334155] rounded-2xl shadow-lg p-5 flex flex-col items-center hover:shadow-xl hover:border-[#2563EB] transition-all duration-300 relative"
    >
      {/* Image Section */}
      <div className="w-full h-44 rounded-xl mb-4 flex items-center justify-center overflow-hidden bg-[#0F172A]">
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

      {/* Title */}
      <h3 className="font-semibold text-lg text-center text-white leading-snug">
        {item.title}
      </h3>

      {/* Description */}
      <p className="text-[#94A3B8] text-sm text-center mt-1 mb-3 line-clamp-2">
        {item.description}
      </p>

      {/* Auction Timer */}
      {displayTimer && (
        <div
          className={`px-4 py-1 rounded-full text-xs font-bold shadow-md mb-3 transition ${
            isClosed ? "bg-[#EF4444] text-white" : "bg-[#2563EB] text-white"
          }`}
        >
          {isClosed ? "Registration Closed" : `Closes in: ${displayTimer}`}
        </div>
      )}

      {/* Live Auction Price */}
      {type === "live" && (
        <div className="text-[#34D399] font-bold text-lg mb-3">
          Current Bid: ₹{item.currentBid}
        </div>
      )}

      {/* Buttons */}
      {type === "my-listings" ? (
        <button
          onClick={handleEdit}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#2563EB] text-[#2563EB] font-medium hover:bg-[#2563EB]/10 hover:scale-105 transition-all duration-300"
        >
          <FaEdit className="text-lg" />
          Edit Listing
        </button>
      ) : (
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
          {type === "live" ? (
            <>
              <FaEye /> Spectate
            </>
          ) : type === "top-picks" ? (
            "View Details"
          ) : type === "bidding-history" ? (
            "View Auction"
          ) : (
            "Register Now"
          )}
        </button>
      )}
    </motion.div>
  );
}
