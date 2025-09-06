"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import api from "../../lib/axios";

export default function CreateListingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const auctionId = searchParams.get("id"); // Edit mode

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startingPrice: "",
    category: "",
    tags: "",
    registrationClosingDate: "",
    auctionDate: "",
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAuthHeaders = () => {
    const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
    return userInfo?.token
      ? { Authorization: `Bearer ${userInfo.token}` }
      : {};
  };

  // Fetch categories (hydration safe)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const fetchCategories = async () => {
      try {
        const response = await api.get("auctions/categories", {
          headers: getAuthHeaders(),
        });

        // Extract categories correctly from nested structure
        const cats =
          Array.isArray(response.data?.info?.[0]) ? response.data.info[0] : [];

        setCategories(cats);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  // Fetch auction details for edit mode
  useEffect(() => {
    if (!auctionId) return;

    const fetchAuctionDetails = async () => {
      try {
        const response = await api.get(`/auctions/items/${auctionId}`, {
          headers: getAuthHeaders(),
        });

        const data = response.data;
        setFormData({
          title: data.info.item.title || "",
          description: data.info.item.description || "",
          startingPrice: data.info.item.startingPrice || "",
          category: data.info.item.category || "",
          tags: data.info.item.tags ? data.info.item.tags.join(", ") : "",
          registrationClosingDate: data.info.item.registrationClosingDate
            ? new Date(data.info.item.registrationClosingDate)
                .toISOString()
                .slice(0, 16)
            : "",
          auctionDate: data.info.item.bidStartDate
            ? new Date(data.info.item.bidStartDate).toISOString().slice(0, 16)
            : "",
        });
      } catch (err) {
        console.error("Failed to fetch auction:", err);
        alert("Failed to fetch auction details.");
      }
    };

    fetchAuctionDetails();
  }, [auctionId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const formatDate = (dateString) => new Date(dateString).toISOString();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
      if (!userInfo?.id || !userInfo?.token) {
        alert("User info missing. Please login.");
        setLoading(false);
        return;
      }

      const payload = {
        sellerId: userInfo.id,
        title: formData.title,
        description: formData.description,
        startingPrice: parseFloat(formData.startingPrice),
        category: formData.category,
        tags: formData.tags.split(",").map((t) => t.trim()),
        registrationClosingDate: formatDate(formData.registrationClosingDate),
        bidStartDate: formatDate(formData.auctionDate),
        id: auctionId || null,
      };

      let response;
        response = await api.post("/auctions/place-item", payload, {
          headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        });


      if (response.status === 200 || response.status === 201) {
        alert(auctionId ? "Auction updated!" : "Auction created!");
        router.replace("/profile");
      }
    } catch (err) {
      console.error("Failed to save auction:", err);
      alert("Error saving auction. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this listing?")) return;

    try {
      await api.delete(`auctions/remove-item/${auctionId}`, {
        headers: getAuthHeaders(),
      });

      alert("Auction deleted!");
      router.replace("/profile");
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete auction.");
    }
  };

  return (
    <div className="min-h-screen bg-[#111827] text-white flex flex-col">
      <Navbar />

      <div className="pt-28 pb-12 px-6 max-w-3xl mx-auto flex-1 w-full">
        <h1 className="text-3xl font-bold text-center mb-8 text-white">
          {auctionId ? "✏️ Edit Listing" : "📝 Create New Listing"}
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
            />
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

          {/* Category Dropdown */}
          <div>
            <label className="block mb-2 text-sm font-medium text-[#D1D5DB]">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-[#111827] border border-[#374151] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              required
            >
              <option value="">Select a category</option>
              {categories.map((cat, idx) => (
                <option key={idx} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
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
              placeholder="e.g. electronics, gadgets"
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

          {/* Submit & Delete Buttons */}
          <div className="flex gap-4 items-center justify-between">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] transition text-white font-semibold shadow-md"
            >
              {loading
                ? "Saving..."
                : auctionId
                ? "Update Auction"
                : "Create Auction"}
            </button>

            {auctionId && (
              <button
                type="button"
                onClick={handleDelete}
                className="px-6 py-3 rounded-lg bg-[#DC2626] hover:bg-[#B91C1C] transition text-white font-semibold shadow-md"
              >
                Delete Item
              </button>
            )}
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
}
