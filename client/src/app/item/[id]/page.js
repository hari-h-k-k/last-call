"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "../../../components/Navbar";
import BiddingModal from "../../../components/BiddingModal";

export default function ItemDetails() {
  const router = useRouter();
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [showModal, setShowModal] = useState(false);

  // Dummy data for now, later fetch from DB
  const item = {
    id,
    title: `Premium Product ${id}`,
    description:
      "This premium-quality product is currently up for auction. It's crafted with high-end materials and offers superior performance. Place your bid now before time runs out!",
    images: [
      "https://source.unsplash.com/random/600x400?tech",
      "https://source.unsplash.com/random/600x400?product",
      "https://source.unsplash.com/random/600x400?gadgets",
      "https://source.unsplash.com/random/600x400?device",
    ],
    price: 3500,
    highestBid: 4200,
    timeLeft: "2 days 5 hrs",
    seller: "John Doe",
    totalBids: 12,
  };

  return (
    <div className="min-h-screen bg-[#111827] text-white">
      <Navbar />

      {/* MAIN CONTENT */}
      <div className="max-w-6xl mx-auto px-6 pt-28 pb-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left - Image Gallery */}
        <div>
          <img
            src={item.images[selectedImage]}
            alt={item.title}
            className="w-full h-[400px] object-cover rounded-xl shadow-lg"
          />

          {/* Thumbnail Images */}
          <div className="flex gap-3 mt-4">
            {item.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Thumbnail ${idx}`}
                onClick={() => setSelectedImage(idx)}
                className={`w-20 h-20 object-cover rounded-lg cursor-pointer transition ${
                  selectedImage === idx
                    ? "border-2 border-[#2563EB]"
                    : "opacity-70 hover:opacity-100"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Right - Product Details */}
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold text-[#2563EB] mb-3">
            {item.title}
          </h1>
          <p className="text-[#9CA3AF] text-lg mb-5">{item.description}</p>

          {/* Price & Bidding Info */}
          <div className="bg-[#1F2937] p-5 rounded-xl shadow-md mb-6">
            <p className="text-lg">
              Current Highest Bid:{" "}
              <span className="text-[#22C55E] font-semibold">
                ₹{item.highestBid}
              </span>
            </p>
            <p className="text-[#9CA3AF] mt-1">Starting Price: ₹{item.price}</p>
            <p className="text-[#FACC15] mt-1">Time Left: {item.timeLeft}</p>
            <p className="text-[#9CA3AF] mt-1">
              Total Bids: <span className="text-white">{item.totalBids}</span>
            </p>
            <p className="text-[#9CA3AF] mt-1">
              Seller: <span className="text-white">{item.seller}</span>
            </p>
          </div>

          {/* Place Bid Button */}
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-3 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold shadow-lg transition duration-300"
          >
            Place Bid
          </button>
        </div>
      </div>

      {/* Bidding Modal */}
      {showModal && (
        <BiddingModal
          item={item}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
