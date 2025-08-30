"use client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function SearchResultCard({ item }) {
  const router = useRouter();

  return (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      layout
      className="bg-[#111827] border border-[#374151] rounded-xl shadow-md p-4 flex flex-col items-center hover:scale-105 transition-transform"
    >
      <div className="w-full h-40 bg-[#2D3748] rounded-lg mb-3 flex items-center justify-center text-[#6B7280]">
        Image Placeholder
      </div>
      <h3 className="font-semibold text-lg text-center">{item.title}</h3>
      <p className="text-[#9CA3AF] text-sm text-center mb-2">{item.description}</p>
      <div className="text-[#FACC15] font-bold text-lg mb-3">Price: ₹{item.price}</div>
      <button
        onClick={() => router.push(`/auction/${item.id}`)}
        className="mt-3 px-4 py-2 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] transition text-white font-medium shadow-md"
      >
        View Auction
      </button>
    </motion.div>
  );
}
