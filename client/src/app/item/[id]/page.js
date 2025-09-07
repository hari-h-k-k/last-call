"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "../../../components/Navbar";
import BiddingModal from "../../../components/BiddingModal";
import api from "@/lib/axios";

export default function ItemDetails() {
  const router = useRouter();
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showModal, setShowModal] = useState(false);


  const getAuthHeaders = () => {
    const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
    return userInfo?.token ? { Authorization: `Bearer ${userInfo.token}` } : {};
  };

  // Fetch item from API
  useEffect(() => {
    if (!id) return;

    const fetchItem = async () => {
      try {
        // POST request using your custom axios instance
        // const res = await api.get(`/auctions/items/${id}`);

        const response = await api.get(`/auctions/items/${id}`, {
          headers: { ...getAuthHeaders() },
        });
        console.log("Fetched item:", response.data);
        setItem(response.data.info.item);
      } catch (err) {
        console.error("Error fetching item:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#111827] text-white flex items-center justify-center">
        <p className="text-lg">Loading item details...</p>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-[#111827] text-white flex items-center justify-center">
        <p className="text-lg">Item not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111827] text-white">
      <Navbar />

      {/* MAIN CONTENT */}
      <div className="max-w-6xl mx-auto px-6 pt-28 pb-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left - Image Gallery */}
        <div>
          <img
            src={item.images?.[selectedImage] || "https://via.placeholder.com/600x400"}
            alt={item.title}
            className="w-full h-[400px] object-cover rounded-xl shadow-lg"
          />

          {/* Thumbnail Images */}
          {item.images && item.images.length > 1 && (
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
          )}
        </div>


        {/* Right - Product Details */}
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold text-[#2563EB] mb-3">{item.title}</h1>
          <p className="text-[#9CA3AF] text-lg mb-5">{item.description}</p>

          {/* Price & Bidding Info */}
          <div className="bg-[#1F2937] p-5 rounded-xl shadow-md mb-6">
            <p className="text-lg">
              Current Highest Bid:{" "}
              <span className="text-[#22C55E] font-semibold">
                ₹{item.highestBid ?? "N/A"}
              </span>
            </p>
            <p className="text-[#9CA3AF] mt-1">Starting Price: ₹{item.startingPrice}</p>
            <p className="text-[#FACC15] mt-1">
              Registration Closes:{" "}
              {new Date(item.registrationClosingDate).toLocaleString()}
            </p>
            <p className="text-[#9CA3AF] mt-1">
              Bid Start: {new Date(item.bidStartDate).toLocaleString()}
            </p>
            <p className="text-[#9CA3AF] mt-1">
              Category: <span className="text-white">{item.category}</span>
            </p>
            <p className="text-[#9CA3AF] mt-1">
              Location:{" "}
              <span className="text-white">
                {item.location?.lat}, {item.location?.lng}
              </span>
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
        <BiddingModal item={item} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}
