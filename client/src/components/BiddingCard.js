"use client";
import { useRouter } from "next/navigation";

export default function BiddingCard({ id, title, price, image, description }) {
  const router = useRouter();

  const handleNavigate = () => {
    router.push(`/item/${id}`);
  };

  return (
    <div className="bg-[#1F2937] rounded-xl p-5 shadow-lg hover:scale-105 transition duration-300">
      {/* Product Image */}
      <img
        src={image}
        alt={title}
        className="w-full h-40 object-cover rounded-lg mb-4"
      />

      {/* Product Title */}
      <h3 className="text-lg font-semibold text-[#FFFFFF]">{title}</h3>

      {/* Description */}
      <p className="text-[#9CA3AF] mt-1 text-sm">{description}</p>

      {/* Price & Button */}
      <div className="mt-4 flex justify-between items-center">
        <span className="text-[#22C55E] font-semibold">₹{price}</span>
        <button
          onClick={handleNavigate}
          className="px-4 py-2 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] transition text-white font-medium shadow"
        >
          Place Bid
        </button>
      </div>
    </div>
  );
}
