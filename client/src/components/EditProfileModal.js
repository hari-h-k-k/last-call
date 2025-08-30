"use client";
import { useState } from "react";

export default function EditProfileModal({ info, onClose, onSave }) {
  const [username, setUsername] = useState(info?.username || "");
  const [email, setEmail] = useState(info?.email || "");
  const [profilePic, setProfilePic] = useState(info?.profilePic || "");

  const handleSave = () => {
    // Here you can call your API to save changes
    onSave({ username, email, profilePic });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-[#1F2937] rounded-2xl p-8 w-full max-w-md shadow-xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#9CA3AF] hover:text-white"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-[#2563EB] mb-4">Edit Profile</h2>

        {/* Profile Image Upload */}
        <div className="mb-4">
          <label className="block text-[#9CA3AF] mb-2">Profile Image URL</label>
          <input
            type="text"
            value={profilePic}
            onChange={(e) => setProfilePic(e.target.value)}
            placeholder="Enter image URL"
            className="w-full px-4 py-2 rounded-lg bg-[#111827] border border-[#374151] focus:outline-none focus:ring-2 focus:ring-[#2563EB] text-white placeholder-[#9CA3AF]"
          />
        </div>

        {/* Username */}
        <div className="mb-4">
          <label className="block text-[#9CA3AF] mb-2">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-[#111827] border border-[#374151] focus:outline-none focus:ring-2 focus:ring-[#2563EB] text-white placeholder-[#9CA3AF]"
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-[#9CA3AF] mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-[#111827] border border-[#374151] focus:outline-none focus:ring-2 focus:ring-[#2563EB] text-white placeholder-[#9CA3AF]"
          />
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full py-3 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] transition text-white font-semibold shadow-lg"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
