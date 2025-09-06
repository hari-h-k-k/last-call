"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { FaUserCircle } from "react-icons/fa";
import EditProfileModal from "../../components/EditProfileModal";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import AuctionCard from "../../components/AuctionCard";
import api from "../../lib/axios"; // or import your axios instance

export default function ProfilePage() {
  const { info } = useAuth();
  const [activeTab, setActiveTab] = useState("active");
  const [showEditModal, setShowEditModal] = useState(false);
  const [myListings, setMyListings] = useState([]);
  const router = useRouter();

  const handleSaveProfile = (updatedInfo) => {
    console.log("Saved Profile Info:", updatedInfo);
  };

  const tabs = [
    { id: "active", label: "Active Biddings" },
    { id: "past", label: "Past Biddings" },
    { id: "transactions", label: "Transactions" },
    { id: "bank", label: "Bank Accounts" },
    { id: "settings", label: "Settings" },
    { id: "my-listings", label: "My Listings" },
  ];

  useEffect(() => {
    const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
    if (!userInfo?.token) {
      router.push("/login");
      return;
    }

    // Fetch My Listings when tab is active
    if (activeTab === "my-listings") {
      fetchMyListings(userInfo.id, userInfo.token);
    }
  }, [router, activeTab]);

  const fetchMyListings = async (userId, token) => {
    try {
      const response = await api.get(`auctions/items/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {

        setMyListings(response.data.info.items || []);
      }
    } catch (error) {
      console.error("Failed to fetch My Listings:", error);
    }
  };

  // Dummy data for other tabs (active, past, transactions)
  const dummyCards = [
    { id: 1, title: "Vintage Watch", description: "Classic collector's item", currentBid: 2500 },
    { id: 2, title: "Antique Vase", description: "Rare Ming dynasty vase", currentBid: 15000 },
    { id: 3, title: "Luxury Handbag", description: "Limited edition designer bag", currentBid: 8000 },
  ];

  return (
    <div className="min-h-screen bg-[#0F172A] text-white pt-28 px-6 md:px-16">
      <Navbar />
      {showEditModal && (
        <EditProfileModal
          info={info}
          onClose={() => setShowEditModal(false)}
          onSave={handleSaveProfile}
        />
      )}

      {/* Profile Header */}
      <div className="bg-[#1E293B] rounded-2xl shadow-xl p-8 flex flex-col md:flex-row items-center gap-8 border border-[#334155]">
        {info?.profilePic ? (
          <img
            src={info.profilePic}
            alt="Profile"
            className="w-28 h-28 rounded-full object-cover border-4 border-[#2563EB]"
          />
        ) : (
          <FaUserCircle className="text-[#2563EB] w-28 h-28" />
        )}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl font-bold">{info?.username || "John Doe"}</h1>
          <p className="text-[#9CA3AF]">{info?.email || "johndoe@example.com"}</p>
          <p className="text-sm mt-1 text-[#38BDF8] font-semibold">
            {info?.role || "Auction Buyer & Seller"}
          </p>
          <button
            onClick={() => setShowEditModal(true)}
            className="mt-4 px-5 py-2 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] transition text-white font-semibold shadow-md"
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="mt-8">
        <div className="flex flex-wrap gap-3 border-b border-[#334155] pb-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2 rounded-lg font-semibold transition-all ${
                activeTab === tab.id
                  ? "bg-[#2563EB] text-white shadow-md"
                  : "bg-[#1E293B] text-[#9CA3AF] hover:bg-[#2D3B55]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tabs Content */}
        <div className="mt-6 bg-[#1E293B] p-6 rounded-2xl shadow-lg border border-[#334155]">
          {activeTab === "active" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {dummyCards.map((item) => (
                <AuctionCard key={item.id} type="active" item={item} />
              ))}
            </div>
          )}

          {activeTab === "past" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {dummyCards.map((item) => (
                <AuctionCard key={item.id} type="past" item={item} />
              ))}
            </div>
          )}

          {activeTab === "transactions" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {dummyCards.map((item) => (
                <AuctionCard key={item.id} type="transaction" item={item} />
              ))}
            </div>
          )}

          {activeTab === "bank" && (
            <div>
              <h2 className="text-xl font-bold mb-4">Linked Bank Accounts</h2>
              <p className="text-[#9CA3AF]">
                Add or manage your payment accounts for faster bidding.
              </p>
              <button className="mt-3 px-5 py-2 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] transition text-white font-semibold shadow-md">
                Link New Account
              </button>
            </div>
          )}

          {activeTab === "settings" && (
            <div>
              <h2 className="text-xl font-bold mb-4">Account Settings</h2>
              <p className="text-[#9CA3AF]">Manage your account preferences and security.</p>
              <button className="mt-3 px-5 py-2 rounded-lg bg-[#F43F5E] hover:bg-[#e11d48] transition text-white font-semibold shadow-md">
                Delete Account
              </button>
            </div>
          )}

          {activeTab === "my-listings" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {myListings.length > 0 ? (
                myListings.map((item) => (
                  <AuctionCard key={item.id} type="my-listings" item={item} />
                ))
              ) : (
                <p className="text-[#9CA3AF] col-span-full text-center mt-4">
                  You have no listings yet.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
