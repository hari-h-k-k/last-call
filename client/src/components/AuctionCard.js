"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { FaEye, FaEdit } from "react-icons/fa";
import { useEffect, useState, useMemo } from "react";

export default function AuctionCard({ item, type = "register" }) {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(0);

  // ⏳ Countdown timer
  useEffect(() => {
    if (!item?.registrationClosingDate) return;

    const closingTime = new Date(item.registrationClosingDate).getTime();

    const updateTimer = () => {
      setTimeLeft(Math.max(closingTime - Date.now(), 0));
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [item?.registrationClosingDate]);

  const displayTimer = useMemo(() => {
    if (timeLeft <= 0) return "00:00";
    const minutes = String(Math.floor(timeLeft / 60000)).padStart(2, "0");
    const seconds = String(Math.floor((timeLeft % 60000) / 1000)).padStart(2, "0");
    return `${minutes}:${seconds}`;
  }, [timeLeft]);

  const isClosed = timeLeft <= 0;

  // Handlers
  const handleNavigation = () => {
    router.push(type === "spectate" ? `/spectate/${item.id}` : `/item/${item.id}`);
  };

  const handleEdit = () => router.push(`/create-listing?id=${item.id}`);

  // Constants
  const imageUrl =
    item?.imageUrl?.trim() ||
    "https://images.unsplash.com/photo-1526948128573-703ee1aeb6fa?w=600&h=400&fit=crop";

  const actionButton = () => {
    if (type === "my-listings") {
      return (
        <button
          onClick={handleEdit}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-blue-600 text-blue-600 font-medium hover:bg-blue-600/10 hover:scale-105 transition-all"
        >
          <FaEdit /> Edit Listing
        </button>
      );
    }

    const btnClasses = [
      "mt-3 px-4 py-2 rounded-lg transition text-white font-medium shadow-md flex items-center gap-2",
    ];

    if (type === "spectate") btnClasses.push("bg-green-500 hover:bg-green-600");
    else if (isClosed) btnClasses.push("bg-gray-500 cursor-not-allowed");
    else btnClasses.push("bg-blue-600 hover:bg-blue-700");

    return (
      <button
        disabled={isClosed && type === "register"}
        onClick={handleNavigation}
        className={btnClasses.join(" ")}
      >
        {type === "spectate" ? (
          <>
            <FaEye /> Spectate
          </>
        ) : (
          "Register Now"
        )}
      </button>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      layout
      className="bg-gray-800 border border-gray-700 rounded-2xl shadow-lg p-5 flex flex-col items-center hover:shadow-xl hover:border-blue-600 transition-all duration-300"
    >
      {/* Image */}
      <div className="w-full h-44 rounded-xl mb-4 overflow-hidden bg-gray-900">
        <img
          src={imageUrl}
          alt={item?.title || "Auction Item"}
          className="w-full h-full object-cover rounded-xl"
          onError={(e) => (e.target.src = imageUrl)}
        />
      </div>

      {/* Title */}
      <h3 className="font-semibold text-lg text-center text-white leading-snug">{item.title}</h3>

      {/* Description */}
      <p className="text-gray-400 text-sm text-center mt-1 mb-3 line-clamp-2">{item.description}</p>

      {/* Registration Timer */}
      {type === "register" && (
        <div
          className={`px-4 py-1 rounded-full text-xs font-bold shadow-md mb-3 transition ${
            isClosed ? "bg-red-500" : "bg-blue-600"
          } text-white`}
        >
          {isClosed ? "Registration Closed" : `Closes in: ${displayTimer}`}
        </div>
      )}

      {/* Current Bid */}
      {type === "spectate" && (
        <div className="text-green-400 font-bold text-lg mb-3">
          Current Bid: ₹{item.currentBid || 0}
        </div>
      )}

      {/* Action Button */}
      {actionButton()}
    </motion.div>
  );
}
