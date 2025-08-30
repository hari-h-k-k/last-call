"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { useEffect } from "react";
import { motion } from "framer-motion";

export default function LandingPage() {
  const router = useRouter();
  const { info } = useAuth();

  // If already logged in → redirect to /home
  useEffect(() => {
    if (info?.token) {
      router.push("/home");
    }
  }, [info, router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#111827] text-[#FFFFFF] relative overflow-hidden">
      {/* Background Gradient Blur Effects */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-[#2563EB] rounded-full mix-blend-normal filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#FACC15] rounded-full mix-blend-normal filter blur-3xl opacity-20 animate-pulse"></div>

      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-5xl md:text-6xl font-extrabold text-center text-[#FFFFFF] drop-shadow-lg"
      >
        Welcome to <span className="text-[#FACC15]">My Auction</span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-lg md:text-xl text-[#9CA3AF] mt-4 text-center max-w-xl leading-relaxed"
      >
        Experience a seamless, secure, and modern platform to{" "}
        <span className="text-[#22C55E] font-semibold">buy</span>,{" "}
        <span className="text-[#2563EB] font-semibold">bid</span>, and{" "}
        <span className="text-[#F43F5E] font-semibold">win</span> amazing auctions.
      </motion.p>

      {/* Buttons */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="flex gap-5 mt-10"
      >
        <button
          onClick={() => router.push("/login")}
          className="px-8 py-3 rounded-xl bg-[#2563EB] text-white font-semibold shadow-lg hover:bg-[#1d4ed8] transition duration-300 transform hover:scale-105"
        >
          Login
        </button>

        <button
          onClick={() => router.push("/signup")}
          className="px-8 py-3 rounded-xl bg-[#FACC15] text-black font-semibold shadow-lg hover:bg-[#eab308] transition duration-300 transform hover:scale-105"
        >
          Sign Up
        </button>
      </motion.div>

      {/* Footer */}
      <footer className="absolute bottom-4 text-[#9CA3AF] text-sm">
        © {new Date().getFullYear()} My Auction. All rights reserved.
      </footer>
    </div>
  );
}
