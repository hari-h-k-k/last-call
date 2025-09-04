"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import api from "../../lib/axios";

export default function CreateListingPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startingPrice: "",
    category: "",
    tags: "",
    registrationClosingDate: "",
    auctionDate: "",
  });

  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Convert datetime-local to Spring Boot compatible ISO string
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    // Ensure milliseconds and timezone included
    return date.toISOString();
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));

      if (!userInfo || !userInfo.id || !userInfo.token) {
        alert("User info not found. Please log in again.");
        setLoading(false);
        return;
      }

      // Build payload according to API contract
      const payload = {
        sellerId: userInfo.id,
        title: formData.title,
        description: formData.description,
        startingPrice: parseFloat(formData.startingPrice),
        category: formData.category,
        tags: formData.tags.split(",").map((tag) => tag.trim()),
        registrationClosingDate: formatDate(formData.registrationClosingDate),
        bidStartDate: formatDate(formData.auctionDate),
        id: "", // leave empty for backend to handle
      };

      console.log("Payload sent:", payload);

      // API request
      const response = await api.post("auctions/place-item", payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      });

      if (response.status === 200 || response.status === 201) {
        alert("Auction created successfully!");
        router.replace("/profile");
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error creating auction:", error);
      alert("Failed to create auction. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111827] text-white flex flex-col">
      <Navbar />

      <div className="pt-28 pb-12 px-6 max-w-3xl mx-auto flex-1 w-full">
        <h1 className="text-3xl font-bold text-center mb-8 text-[#FFFFFF]">
          📝 Create New Listing
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-[#1F2937] p-8 rounded-2xl shadow-lg border border-[#2D3748] flex flex-col gap-5"
        >
          {/* Title */}
          <div>
            <label className="block mb-2 text-sm font-medium text-[#D1D5DB]">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter auction title"
              className="w-full px-4 py-3 rounded-lg bg-[#111827] border border-[#374151] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block mb-2 text-sm font-medium text-[#D1D5DB]">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter auction description"
              rows="4"
              className="w-full px-4 py-3 rounded-lg bg-[#111827] border border-[#374151] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              required
            ></textarea>
          </div>

          {/* Starting Price */}
          <div>
            <label className="block mb-2 text-sm font-medium text-[#D1D5DB]">
              Starting Price (₹)
            </label>
            <input
              type="number"
              name="startingPrice"
              value={formData.startingPrice}
              onChange={handleChange}
              placeholder="Enter starting bid price"
              className="w-full px-4 py-3 rounded-lg bg-[#111827] border border-[#374151] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block mb-2 text-sm font-medium text-[#D1D5DB]">
              Category
            </label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Enter category"
              className="w-full px-4 py-3 rounded-lg bg-[#111827] border border-[#374151] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              required
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block mb-2 text-sm font-medium text-[#D1D5DB]">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="e.g. electronics, gadgets, phones"
              className="w-full px-4 py-3 rounded-lg bg-[#111827] border border-[#374151] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            />
          </div>

          {/* Registration Closing Date */}
          <div>
            <label className="block mb-2 text-sm font-medium text-[#D1D5DB]">
              Registration Closing Date
            </label>
            <input
              type="datetime-local"
              name="registrationClosingDate"
              value={formData.registrationClosingDate}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-[#111827] border border-[#374151] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              required
            />
          </div>

          {/* Auction Date */}
          <div>
            <label className="block mb-2 text-sm font-medium text-[#D1D5DB]">
              Auction Start Date
            </label>
            <input
              type="datetime-local"
              name="auctionDate"
              value={formData.auctionDate}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-[#111827] border border-[#374151] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-4 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] transition text-white font-semibold shadow-md"
          >
            {loading ? "Creating..." : "Create Auction"}
          </button>
        </form>
      </div>

      <Footer />
    </div>
  );
}
