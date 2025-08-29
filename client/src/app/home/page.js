"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

export default function HomePage() {
  const { info, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!info.token) {
      router.push("/login");
    }
  }, [info, router]);

  if (!info.token) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#111827] text-[#FFFFFF]">
      <div className="bg-[#1F2937] p-10 rounded-2xl shadow-xl w-96 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-[#2563EB]">
          Welcome, {info.username}! 🎉
        </h1>
        <p className="text-[#9CA3AF] mb-6">
          You are successfully authenticated. Enjoy your dashboard!
        </p>
        <button
          onClick={logout}
          className="px-6 py-3 rounded-lg bg-[#F43F5E] hover:bg-[#e11d48] text-[#FFFFFF] font-semibold shadow-md transition duration-300"
        >
          Logout
        </button>
      </div>

      {/* Quick Stats / Example Section */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        <div className="bg-[#1F2937] rounded-xl p-6 text-center shadow-lg">
          <h2 className="text-xl font-semibold text-[#22C55E]">Active Auctions</h2>
          <p className="text-[#9CA3AF] mt-2">12 ongoing bids right now</p>
        </div>
        <div className="bg-[#1F2937] rounded-xl p-6 text-center shadow-lg">
          <h2 className="text-xl font-semibold text-[#FACC15]">Your Wins</h2>
          <p className="text-[#9CA3AF] mt-2">You have won 3 auctions</p>
        </div>
      </div>
    </div>
  );
}
