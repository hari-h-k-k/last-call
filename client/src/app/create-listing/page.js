"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import api from "../../lib/axios";

export default function CreateListingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const auctionId = searchParams.get("id");

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
    return userInfo?.token ? { Authorization: `Bearer ${userInfo.token}` } : {};
  };

  // Fetch categories
  useEffect(() => {
    if (typeof window === "undefined") return;
    api
      .get("auctions/categories", { headers: getAuthHeaders() })
      .then((res) => {
        setCategories(Array.isArray(res.data?.info?.[0]) ? res.data.info[0] : []);
      })
      .catch(() => setCategories([]));
  }, []);

  // Fetch existing auction details if editing
  useEffect(() => {
    if (!auctionId) return;
    api
      .get(`/auctions/items/${auctionId}`, { headers: getAuthHeaders() })
      .then((res) => {
        const item = res.data?.info?.item || {};
        setFormData({
          title: item.title || "",
          description: item.description || "",
          startingPrice: item.startingPrice || "",
          category: item.category || "",
          tags: item.tags ? item.tags.join(", ") : "",
          registrationClosingDate: item.registrationClosingDate
            ? new Date(item.registrationClosingDate).toISOString().slice(0, 16)
            : "",
          auctionDate: item.bidStartDate
            ? new Date(item.bidStartDate).toISOString().slice(0, 16)
            : "",
        });
      })
      .catch(() => alert("Failed to fetch auction details."));
  }, [auctionId]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const formatDate = (date) => new Date(date).toISOString();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
      if (!userInfo?.id || !userInfo?.token)
        return alert("Please login first."), setLoading(false);

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

      const res = await api.post("/auctions/place-item", payload, {
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      });

      if (res.status === 200 || res.status === 201) {
        alert(auctionId ? "Auction updated!" : "Auction created!");
        router.replace("/profile");
      }
    } catch {
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
    } catch {
      alert("Failed to delete auction.");
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-lg bg-[#111827] border border-[#374151] focus:outline-none focus:ring-2 focus:ring-[#2563EB]";

  return (
    <div className="min-h-screen bg-[#111827] text-white flex flex-col">
      <Navbar />
      <div className="pt-28 pb-12 px-6 max-w-3xl mx-auto flex-1 w-full">
        <h1 className="text-3xl font-bold text-center mb-8">
          {auctionId ? "✏️ Edit Listing" : "📝 Create New Listing"}
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-[#1F2937] p-8 rounded-2xl shadow-lg border border-[#2D3748] flex flex-col gap-5"
        >
          {/* Title */}
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter auction title"
            className={inputClass}
            required
          />

          {/* Description */}
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter auction description"
            rows="4"
            className={inputClass}
            required
          />

          {/* Starting Price */}
          <input
            type="number"
            name="startingPrice"
            value={formData.startingPrice}
            onChange={handleChange}
            placeholder="Enter starting bid price"
            className={inputClass}
            required
          />

          {/* Category */}
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={inputClass}
            required
          >
            <option value="">Select a category</option>
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Tags */}
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="e.g. electronics, gadgets"
            className={inputClass}
          />

          {/* Registration Closing Date */}
          <input
            type="datetime-local"
            name="registrationClosingDate"
            value={formData.registrationClosingDate}
            onChange={handleChange}
            className={inputClass}
            required
          />

          {/* Auction Date */}
          <input
            type="datetime-local"
            name="auctionDate"
            value={formData.auctionDate}
            onChange={handleChange}
            className={inputClass}
            required
          />

          {/* Buttons */}
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
                Delete
              </button>
            )}
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}
