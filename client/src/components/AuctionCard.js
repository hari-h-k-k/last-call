"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { FaEye, FaEdit } from "react-icons/fa";
import { useEffect, useState, useMemo } from "react";

export default function AuctionCard({ item, type = "register" }) {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(0);
  const [phase, setPhase] = useState("registration"); // "registration", "auction", or "closed"

  useEffect(() => {
    if (!item?.registrationClosingDate || !item?.auctionStartDate) return;

    const registrationCloseTime = new Date(item.registrationClosingDate).getTime();
    const auctionStartTime = new Date(item.auctionStartDate).getTime();

    const updateTimer = () => {
      const now = Date.now();

      if (now < registrationCloseTime) {
        setPhase("registration");
        setTimeLeft(registrationCloseTime - now);
      } else if (now >= registrationCloseTime && now < auctionStartTime) {
        setPhase("auction");
        setTimeLeft(auctionStartTime - now);
      } else {
        setPhase("closed");
        setTimeLeft(0);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [item?.registrationClosingDate, item?.auctionStartDate]);

  const displayTimer = useMemo(() => {
    if (timeLeft <= 0) return "00:00";
    const minutes = String(Math.floor(timeLeft / 60000)).padStart(2, "0");
    const seconds = String(Math.floor((timeLeft % 60000) / 1000)).padStart(2, "0");
    return `${minutes}:${seconds}`;
  }, [timeLeft]);

  const handleNavigation = () => {
    router.push(type === "spectate" ? `/spectate/${item.id}` : `/item/${item.id}`);
  };

  const handleEdit = () => router.push(`/create-listing?id=${item.id}`);

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

    // Button classes
    const btnClasses = [
      "mt-3 px-4 py-2 rounded-lg transition text-white font-medium shadow-md flex items-center gap-2",
    ];

    // Spectate button
    if (type === "spectate") {
      btnClasses.push("bg-green-500 hover:bg-green-600");
      return (
        <button onClick={handleNavigation} className={btnClasses.join(" ")}>
          <FaEye /> Spectate
        </button>
      );
    }

    // Register button states
    if (item.registered) {
      btnClasses.push("bg-green-600");
      return (
        <button onClick={handleNavigation} className={btnClasses.join(" ")}>
          ✅ Registered
        </button>
      );
    }

    if (phase === "registration") {
      btnClasses.push("bg-blue-600 hover:bg-blue-700");
      return (
        <button onClick={handleNavigation} className={btnClasses.join(" ")}>
          Register Now
        </button>
      );
    }

    if (phase === "auction") {
      btnClasses.push("bg-gray-500");
      return (
        <button onClick={handleNavigation} className={btnClasses.join(" ")}>
          Registration Closed
        </button>
      );
    }

    if (phase === "closed") {
      btnClasses.push("bg-red-600");
      return (
        <button onClick={handleNavigation} className={btnClasses.join(" ")}>
          Auction Started
        </button>
      );
    }
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

      {/* Timer */}
      {phase === "registration" && (
        <div className="px-4 py-1 rounded-full text-xs font-bold shadow-md mb-3 bg-blue-600 text-white">
          Registration closes in: {displayTimer}
        </div>
      )}
      {phase === "auction" && (
        <div className="px-4 py-1 rounded-full text-xs font-bold shadow-md mb-3 bg-yellow-600 text-white">
          Auction starts in: {displayTimer}
        </div>
      )}
      {phase === "closed" && (
        <div className="px-4 py-1 rounded-full text-xs font-bold shadow-md mb-3 bg-red-500 text-white">
          Auction Started
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
