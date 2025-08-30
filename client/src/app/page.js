"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import BiddingCard from "../components/BiddingCard";
import Footer from "../components/Footer";

export default function HomePage() {
  const { info } = useAuth();
  const router = useRouter();

  // Dummy products for now
  const products = Array.from({ length: 8 }).map((_, idx) => ({
    id: idx,
    title: `Product ${idx + 1}`,
    price: 1000 + idx * 200,
    description: "High-quality item for auction. Bid now!",
    image: `https://source.unsplash.com/random/400x300?product&sig=${idx}`,
  }));

  return (
    <div className="min-h-screen bg-[#111827] text-white">
      {/* Navbar Component */}
      <Navbar />

      {/* MAIN CONTENT */}
      <div className="pt-28 flex flex-col items-center px-6">
        {/* Search Bar */}
        <div className="w-full max-w-2xl mb-10">
          <input
            type="text"
            placeholder="Search for auctions..."
            className="w-full px-5 py-3 rounded-xl bg-[#1F2937] border border-[#374151] focus:outline-none focus:ring-2 focus:ring-[#2563EB] text-[#FFFFFF] placeholder-[#9CA3AF] shadow-md"
          />
        </div>

        {/* Bidding Items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-7xl">
          {products.map((product) => (
            <BiddingCard
              key={product.id}
              title={product.title}
              price={product.price}
              image={product.image}
              description={product.description}
            />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
