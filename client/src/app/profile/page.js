"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { FaUserCircle } from "react-icons/fa";
import EditProfileModal from "../../components/EditProfileModal";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import AuctionCard from "../../components/AuctionCard";
import api from "../../lib/axios";

export default function ProfilePage() {
  const { info } = useAuth();
  const [activeTab, setActiveTab] = useState("registered");
  const [showEditModal, setShowEditModal] = useState(false);
  const [myListings, setMyListings] = useState([]);
  const [mySubscription, setMySubscription] = useState([]);
  const router = useRouter();

  const handleSaveProfile = (updatedInfo) => {
    console.log("Saved Profile Info:", updatedInfo);
  };

  const tabs = [
    { id: "registered", label: "Registered Items" },
    { id: "my-listings", label: "My Listings" },
  ];

  useEffect(() => {
    const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
    if (!userInfo?.token) {
      router.push("/login");
      return;
    }

    if (activeTab === "my-listings") {
      fetchMyListings(userInfo.id, userInfo.token);
    }

    if (activeTab === "registered") {
      fetchSubscribedItems(userInfo.id, userInfo.token);
    }
  }, [router, activeTab]);

  const fetchMyListings = async (userId, token) => {
    try {
      const response = await api.get(`/my-items`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("My Listings Response:", response);
      if (response.status === 200) {
        setMyListings(response.data.info.itemList || []);
      }
    } catch (error) {
      console.error("Failed to fetch My Listings:", error);
    }
  };

  const fetchSubscribedItems = async (userId, token) => {
    try {
      const response = await api.get(`/subscribed-items`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Subscribed Items Response:", response);
      if (response.status === 200) {
        setMySubscription(response.data.info.itemList || []);
      }
    } catch (error) {
      console.error("Failed to fetch Subscribed Items:", error);
    }
  };

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
          {/* Registered Items */}
          {activeTab === "registered" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {mySubscription.length > 0 ? (
                mySubscription.map((entry) => (
                  <AuctionCard
                    key={entry.item.id}
                    type="registered"
                    item={entry.item}
                    registered={entry.registered}
                  />
                ))
              ) : (
                <p className="text-[#9CA3AF] col-span-full text-center mt-4">
                  You haven’t registered for any items yet.
                </p>
              )}
            </div>
          )}

          {/* My Listings */}
          {activeTab === "my-listings" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {myListings.length > 0 ? (
                myListings.map((entry) => (
                                  <AuctionCard
                                    key={entry.item.id}
                                    type="my-listings"
                                    item={entry.item}
                                    registered={entry.registered}
                                  />
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
