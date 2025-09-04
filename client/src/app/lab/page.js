"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function LabPage() {
  const router = useRouter();

  // Dummy auction item
  const item = {
    id: "1",
    title: "Luxury Sports Car Auction",
    description: "Bid for this stunning Ferrari SF90 with 0km mileage!",
    currentBid: 1250000,
  };

  const type = "upcoming";
  const [timer, setTimer] = useState({ minutes: 0, seconds: 10 });
  const [isClosed, setIsClosed] = useState(false);

  // Countdown timer
  useEffect(() => {
    if (type !== "upcoming") return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { minutes: prev.minutes - 1, seconds: 59 };
        setIsClosed(true);
        clearInterval(interval);
        return prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [type]);

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-6">
      <motion.div
        key={item.id}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        layout
        className="relative bg-[#111827] border border-[#374151] rounded-xl shadow-md p-4 flex flex-col items-center hover:scale-105 transition-transform w-80"
      >
        {/* DIAGONAL CLOSED STAMP */}
        {isClosed && (
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
            <div className="transform rotate-[-45deg] w-[150%] flex justify-center">
              <div className="border-4 border-red-700 text-red-700 font-extrabold text-4xl tracking-widest px-12 py-3 shadow-lg shadow-red-900/50 backdrop-blur-sm bg-white/10 text-center">
                CLOSED
              </div>
            </div>
          </div>
        )}

        {/* Image / Video Placeholder */}
        <div className="w-full h-40 bg-[#2D3748] rounded-lg mb-3 flex items-center justify-center text-[#6B7280]">
          {type === "live" ? "Video Placeholder" : "Image Placeholder"}
        </div>

        {/* Title & Description */}
        <h3 className="font-semibold text-lg text-center">{item.title}</h3>
        <p className="text-[#9CA3AF] text-sm text-center mb-2">{item.description}</p>

        {/* Countdown Timer */}
        {type === "upcoming" && !isClosed && (
          <div className="px-4 py-1 rounded-full text-sm font-bold shadow-lg bg-[#2563EB] text-white">
            Registration Closes: {timer.minutes}:
            {timer.seconds.toString().padStart(2, "0")}
          </div>
        )}

        {/* Button */}
        <button
          disabled={isClosed && type === "upcoming"}
          onClick={() =>
            type === "live"
              ? router.push(`/spectate/${item.id}`)
              : router.push(`/register/${item.id}`)
          }
          className={`mt-3 px-4 py-2 rounded-lg transition text-white font-medium shadow-md ${
            type === "live"
              ? "bg-[#10B981] hover:bg-[#059669]"
              : isClosed
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-[#2563EB] hover:bg-[#1D4ED8]"
          }`}
        >
          {type === "live" ? "Spectate" : isClosed ? "Closed" : "Register Now"}
        </button>
      </motion.div>
    </div>
  );
}
