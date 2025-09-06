"use client";

import { useState, useEffect } from "react";

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
    });

    // Populate initial values if editing
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
            });
        }
    }, [initialData]);

    const handleChange = (e) =>
      setFormData({ ...formData, [e.target.name]: e.target.value });

    const inputClass =
      "w-full px-4 py-3 rounded-lg bg-[#111827] border border-[#374151] focus:outline-none focus:ring-2 focus:ring-[#2563EB]";

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
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

          {/* Dates */}
          <input
            type="datetime-local"
            name="registrationClosingDate"
            value={formData.registrationClosingDate}
            onChange={handleChange}
            className={inputClass}
            required
          />
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
                  {loading ? "Saving..." : initialData ? "Update Auction" : "Create Auction"}
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
    );
}
