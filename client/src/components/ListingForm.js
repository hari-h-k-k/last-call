"use client";

import { useState, useEffect } from "react";
import MapDialog from "./MapDialog";

export default function ListingForm({
  initialData = null,
  categories = [],
  onSubmit,
  onDelete,
  loading,
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startingPrice: "",
    category: "",
    tags: "",
    registrationClosingDate: "",
    auctionDate: "",
    location: null,
  });

  const [mapOpen, setMapOpen] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        startingPrice: initialData.startingPrice || "",
        category: initialData.category || "",
        tags: initialData.tags ? initialData.tags.join(", ") : "",
        registrationClosingDate: initialData.registrationClosingDate || "",
        auctionDate: initialData.auctionDate || "",
        location: initialData.location || null,
      });
    }
  }, [initialData]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const inputClass =
    "peer w-full px-4 pt-6 pb-2 rounded-lg bg-[#111827] border border-[#374151] focus:outline-none focus:ring-2 focus:ring-[#2563EB] placeholder-transparent";

  const labelClass =
    "absolute left-4 top-1 text-gray-400 text-sm transition-all " +
    "peer-placeholder-shown:top-6 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:text-base " +
    "peer-focus:top-1 peer-focus:text-sm peer-focus:text-[#2563EB]";

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="bg-[#1F2937] p-8 rounded-2xl shadow-lg border border-[#2D3748] flex flex-col gap-6"
      >
        {/* Title */}
        <div className="relative">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter auction title"
            className={inputClass}
            required
          />
          <label className={labelClass}>Auction Title</label>
        </div>

        {/* Description */}
        <div className="relative">
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter auction description"
            rows="4"
            className={`${inputClass} resize-none`}
            required
          />
          <label className={labelClass}>Description</label>
        </div>

        {/* Starting Price */}
        <div className="relative">
          <input
            type="number"
            name="startingPrice"
            value={formData.startingPrice}
            onChange={handleChange}
            placeholder="Enter starting bid price"
            className={inputClass}
            required
          />
          <label className={labelClass}>Starting Price</label>
        </div>

        {/* Category */}
        <div className="relative">
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={`${inputClass} text-white`}
            required
          >
            <option value="" disabled>
              Select a category
            </option>
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <label className={labelClass}>Category</label>
        </div>

        {/* Tags */}
        <div className="relative">
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="e.g. electronics, gadgets"
            className={inputClass}
          />
          <label className={labelClass}>Tags</label>
        </div>

        {/* Dates */}
        <div className="relative">
          <input
            type="datetime-local"
            name="registrationClosingDate"
            value={formData.registrationClosingDate}
            onChange={handleChange}
            className={inputClass}
            required
          />
          <label className={labelClass}>Registration Closing Date</label>
        </div>

        <div className="relative">
          <input
            type="datetime-local"
            name="auctionDate"
            value={formData.auctionDate}
            onChange={handleChange}
            className={inputClass}
            required
          />
          <label className={labelClass}>Auction Date</label>
        </div>

        {/* Location Selector */}
        <div>
          <button
            type="button"
            onClick={() => setMapOpen(true)}
            className="w-full py-3 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold"
          >
            {formData.location
              ? `📍 Location: (${formData.location.lat.toFixed(
                  4
                )}, ${formData.location.lng.toFixed(4)})`
              : "Choose Location"}
          </button>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 items-center justify-between">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-3 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] transition text-white font-semibold shadow-md"
          >
            {loading
              ? "Saving..."
              : initialData
              ? "Update Auction"
              : "Create Auction"}
          </button>

          {initialData && (
            <button
              type="button"
              onClick={onDelete}
              className="px-6 py-3 rounded-lg bg-[#DC2626] hover:bg-[#B91C1C] transition text-white font-semibold shadow-md"
            >
              Delete
            </button>
          )}
        </div>
      </form>

      {/* Map Dialog */}
      <MapDialog
        isOpen={mapOpen}
        onClose={() => setMapOpen(false)}
        onSelect={(coords) =>
          setFormData((prev) => ({ ...prev, location: coords }))
        }
      />
    </>
  );
}
