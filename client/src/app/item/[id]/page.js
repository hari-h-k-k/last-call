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
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);

  // Get Auth Headers
  const getAuthHeaders = () => {
    const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
    return userInfo?.token ? { Authorization: `Bearer ${userInfo.token}` } : {};
  };

  // Fetch item details
  useEffect(() => {
    if (!id) return;

    const fetchItem = async () => {
      try {
        const response = await api.get(`/items/${id}`, {
          headers: { ...getAuthHeaders() },
        });
        setItem(response.data.info.item);
        setIsSubscribed(response.data.info.item.isSubscribed || false);
        startCountdown(response.data.info.item.auctionStartDate);
      } catch (err) {
        console.error("Error fetching item:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  // Countdown for auction start
  const startCountdown = (auctionStartDate) => {
    const updateCountdown = () => {
      const startTime = new Date(auctionStartDate).getTime();
      const now = new Date().getTime();
      const diff = startTime - now;

      if (diff <= 0) {
        setTimeLeft("Auction Started!");
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const mins = Math.floor((diff / (1000 * 60)) % 60);
      const secs = Math.floor((diff / 1000) % 60);

      setTimeLeft(`${days}d ${hours}h ${mins}m ${secs}s`);
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  };

  // Handle registration for bidding
  const handleRegister = async () => {
    try {
      setIsRegistering(true);
      const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));

      if (!userInfo || !userInfo.token) {
        alert("Please login to register for bidding!");
        router.push("/login");
        return;
      }

      console.log("User info:", userInfo)
      console.log("User id:", userInfo.id)

      const response = await api.put(
        `/item-subscribe?itemId=${id}&userId=${userInfo.id}`,
        null,
        {
          headers: {
            ...getAuthHeaders(),
          },
        }
      );

      console.log("Subscription response:", response.data);

      if (response.data.status === "success") {
        alert(response.data.message || "Successfully registered for bidding!");
        setIsSubscribed(true);
      } else {
        alert("Failed to register. Please try again!");
      }
    } catch (err) {
      console.error("Registration failed:", err);
      alert("Failed to register for bidding. Try again!");
    } finally {
      setIsRegistering(false);
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center">
        <p className="text-lg animate-pulse">Loading item details...</p>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center">
        <p className="text-lg">Item not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#1e293b] text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 pt-28 pb-16 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left - Image Gallery */}
        <div>
          <img
            src={item.images?.[selectedImage] || "https://via.placeholder.com/600x400"}
            alt={item.title}
            className="w-full h-[450px] object-cover rounded-2xl shadow-xl border border-gray-700 transition-transform duration-300 hover:scale-105"
          />

          {item.images && item.images.length > 1 && (
            <div className="flex gap-3 mt-4">
              {item.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Thumbnail ${idx}`}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-20 object-cover rounded-xl cursor-pointer transition ${
                    selectedImage === idx
                      ? "ring-4 ring-blue-500"
                      : "opacity-70 hover:opacity-100"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right - Product Details */}
        <div className="flex flex-col">
          <h1 className="text-4xl font-extrabold text-blue-400 mb-3 tracking-wide drop-shadow-lg">
            {item.title}
          </h1>
          <p className="text-gray-300 text-lg mb-5">{item.description}</p>

          {/* Auction Countdown */}
          <div className="bg-[#1e293b]/80 p-4 rounded-xl border border-gray-700 shadow-lg mb-6 text-center">
            <h2 className="text-lg text-gray-300">Auction Starts In:</h2>
            <p className="text-2xl font-bold text-yellow-400 mt-1">{timeLeft}</p>
          </div>

          {/* Price & Bidding Info */}
          <div className="bg-[#1f2937]/60 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-gray-700 mb-6">
            <p className="text-xl mb-2">
              Current Highest Bid:{" "}
              <span className="text-green-400 font-bold text-2xl">
                ₹{item.highestBid ?? "N/A"}
              </span>
            </p>
            <p className="text-gray-400">Starting Price: ₹{item.startingPrice}</p>
            <p className="text-yellow-400 mt-1">
              Registration Closes:{" "}
              {new Date(item.registrationClosingDate).toLocaleString()}
            </p>
            <p className="text-gray-400 mt-1">
              Bid Start: {new Date(item.auctionStartDate).toLocaleString()}
            </p>
            <p className="text-gray-400 mt-1">
              Category: <span className="text-white">{item.category}</span>
            </p>
            <p className="text-gray-400 mt-1">
              Location:{" "}
              <span className="text-white">
                {item.location?.lat}, {item.location?.lng}
              </span>
            </p>
          </div>

          {/* Register or Place Bid */}
          {!isSubscribed ? (
            <button
              onClick={handleRegister}
              disabled={isRegistering}
              className={`px-6 py-3 rounded-lg text-lg font-semibold shadow-lg transition duration-300 ${
                isRegistering
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {isRegistering ? "Registering..." : "Register for Bidding"}
            </button>
          ) : (
            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg transition duration-300"
            >
              Place Bid
            </button>
          )}
        </div>
      </div>

      {/* Related Items Section */}
      <div className="max-w-7xl mx-auto px-6 mt-10">
        <h2 className="text-2xl font-bold text-white mb-5">You Might Also Like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((_, idx) => (
            <div
              key={idx}
              className="bg-[#1f2937] p-4 rounded-xl shadow-lg hover:scale-105 transition cursor-pointer"
            >
              <img
                src="https://via.placeholder.com/400x250"
                alt="Related Item"
                className="w-full h-[180px] object-cover rounded-lg mb-3"
              />
              <h3 className="text-lg font-semibold">Similar Product {idx + 1}</h3>
              <p className="text-gray-400 text-sm">Explore related auctions.</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bidding Modal */}
      {showModal && (
        <BiddingModal item={item} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}
