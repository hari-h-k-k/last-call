"use client";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { FaUserCircle } from "react-icons/fa";
import EditProfileModal from "../../components/EditProfileModal";

export default function ProfilePage() {
  const { info } = useAuth();
  const [activeTab, setActiveTab] = useState("active");

  const [showEditModal, setShowEditModal] = useState(false);


const handleSaveProfile = (updatedInfo) => {
  console.log("Saved Profile Info:", updatedInfo);
  // Update context or API call
};

  const tabs = [
    { id: "active", label: "Active Biddings" },
    { id: "past", label: "Past Biddings" },
    { id: "transactions", label: "Transactions" },
    { id: "bank", label: "Bank Accounts" },
    { id: "settings", label: "Settings" },
  ];

  return (
    <div className="min-h-screen bg-[#0F172A] text-white pt-28 px-6 md:px-16">
    {showEditModal && (
      <EditProfileModal
        info={info}
        onClose={() => setShowEditModal(false)}
        onSave={handleSaveProfile}
      />
    )}
      {/* Profile Header */}
      <div className="bg-[#1E293B] rounded-2xl shadow-xl p-8 flex flex-col md:flex-row items-center gap-8 border border-[#334155]">
        {/* Profile Image */}
        {info?.profilePic ? (
          <img
            src={info.profilePic}
            alt="Profile"
            className="w-28 h-28 rounded-full object-cover border-4 border-[#2563EB]"
          />
        ) : (
          <FaUserCircle className="text-[#2563EB] w-28 h-28" />
        )}

        {/* User Info */}
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
        {/* Tabs Header */}
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
            <div>
              <h2 className="text-xl font-bold mb-4">Your Active Biddings</h2>
              <p className="text-[#9CA3AF]">You currently have 3 active bids.</p>
              {/* Here, map over active bids */}
            </div>
          )}

          {activeTab === "past" && (
            <div>
              <h2 className="text-xl font-bold mb-4">Past Biddings</h2>
              <p className="text-[#9CA3AF]">Your bidding history will appear here.</p>
              {/* Map completed bids */}
            </div>
          )}

          {activeTab === "transactions" && (
            <div>
              <h2 className="text-xl font-bold mb-4">Transactions</h2>
              <p className="text-[#9CA3AF]">
                View your payment history and receipts here.
              </p>
              {/* Map transaction history */}
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
              <p className="text-[#9CA3AF]">
                Manage your account preferences and security.
              </p>
              <button className="mt-3 px-5 py-2 rounded-lg bg-[#F43F5E] hover:bg-[#e11d48] transition text-white font-semibold shadow-md">
                Delete Account
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
