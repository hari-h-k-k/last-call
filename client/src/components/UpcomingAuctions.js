"use client";
import { useState, useEffect } from "react";
import api from "../lib/axios";
import AuctionCard from "./AuctionCard";

export default function UpcomingAuctions() {
  const [upcoming, setUpcoming] = useState([]);
  const [timers, setTimers] = useState({});
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

      const response = await api.get("auctions/get-upcoming-items", {
        params,
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      console.log("Upcoming Auctions Response:", response);

      // Extract upcomingItems array
      const upcomingItems = response?.data?.info?.upcomingItems || [];
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

  // Timer Logic
  useEffect(() => {
    if (upcoming.length === 0) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const updatedTimers = {};
      upcoming.forEach(({ item, timeRemainingMillis }) => {
        const timeLeft = timeRemainingMillis - (now - new Date(item.registrationClosingDate).getTime() + timeRemainingMillis);
        updatedTimers[item.id] = timeLeft > 0 ? timeLeft : 0;
      });
      setTimers(updatedTimers);
    }, 1000);

    return () => clearInterval(interval);
  }, [upcoming]);

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
        {upcoming.map(({ item, timeRemainingMillis }) => {
          const timeLeft = timers[item.id] ?? timeRemainingMillis;
          return (
            <AuctionCard
              key={item.id}
              item={item}
              type="upcoming"
              timer={{
                minutes: Math.floor(timeLeft / 60000),
                seconds: Math.floor((timeLeft % 60000) / 1000),
              }}
              isClosed={timeLeft <= 0}
            />
          );
        })}
      </div>
    </section>
  );
}
