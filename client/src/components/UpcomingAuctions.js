"use client";
import { useState, useEffect } from "react";
import api from "../lib/axios";
import AuctionCard from "./AuctionCard";

export default function UpcomingAuctions() {
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Upcoming Auctions from API
  const fetchUpcomingAuctions = async () => {
    try {
      setLoading(true);

      const userInfo = JSON.parse(sessionStorage.getItem("userInfo")) || {};
      const userId = userInfo?.id || "";
      const token = userInfo?.token || "";

      // Build query params
      const params = {};
      if (userId) params.userId = userId;

      const response = await api.get("/get-upcoming-items", {
        params,
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      // Extract upcomingItems array
      const upcomingItems = response?.data?.info?.itemList || [];
      setUpcoming(upcomingItems);
    } catch (error) {
      console.error("Error fetching upcoming auctions:", error);
      setUpcoming([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpcomingAuctions();
  }, []);

  if (loading) {
    return <p className="text-gray-400 text-center">Loading upcoming auctions...</p>;
  }

  if (upcoming.length === 0) {
    return <p className="text-gray-400 text-center">No upcoming auctions available.</p>;
  }

  return (
    <section className="bg-[#1F2937] rounded-2xl p-6 shadow-xl border border-[#2D3748]">
      <h2 className="text-2xl font-bold mb-5">⏳ Upcoming Auctions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {upcoming.map(({ item,registered }) => (
          <AuctionCard key={item.id} item={item} registered={registered}  type="register" />
        ))}
      </div>
    </section>
  );
}
