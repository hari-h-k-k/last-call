"use client";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function BiddingRoom() {
  const [timeLeft, setTimeLeft] = useState(300); // 5 min countdown
  const [isSubscribed, setIsSubscribed] = useState(true); // Change based on user subscription
  const [currentBid, setCurrentBid] = useState(500);
  const [bidAmount, setBidAmount] = useState("");
  const [minIncrement, setMinIncrement] = useState(500); // Minimum increment amount
  const [leaderboard, setLeaderboard] = useState([
    { name: "Alice", amount: 1200 },
    { name: "John", amount: 1100 },
    { name: "Sophia", amount: 1000 },
    { name: "Mike", amount: 900 },
    { name: "Emma", amount: 850 },
    { name: "Chris", amount: 800 },
  ]);
  const [bidHistory, setBidHistory] = useState([
    { user: "Alice", amount: 1200 },
    { user: "John", amount: 1100 },
    { user: "Sophia", amount: 1000 },
    { user: "Mike", amount: 900 },
    { user: "Emma", amount: 850 },
    { user: "Chris", amount: 800 },
  ]);

  // Countdown Timer
  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  // Format Time in MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Handle New Bid
  const handleBid = () => {
    if (!bidAmount || parseInt(bidAmount) <= currentBid) {
      alert("Your bid must be higher than the current bid!");
      return;
    }

    const newBid = {
      user: "You",
      amount: parseInt(bidAmount),
    };

    setBidHistory([newBid, ...bidHistory]); // newest at top
    setLeaderboard((prev) =>
      [...prev, newBid].sort((a, b) => b.amount - a.amount).slice(0, 5) // Keep only top 5
    );
    setCurrentBid(parseInt(bidAmount));
    setBidAmount("");
  };

  // Quick Bid Increment Handler
  const handleQuickBid = (increment) => {
    setBidAmount(currentBid + increment); // Always based on highest bid
  };

  // Chart Data (Oldest on Left, Newest on Right)
  const reversedHistory = [...bidHistory].reverse();
  const chartData = {
    labels: reversedHistory.map((_, i) => `Bid ${i + 1}`),
    datasets: [
      {
        label: "Bid Amount",
        data: reversedHistory.map((b) => b.amount),
        borderColor: "#3B82F6",
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">🏆 Live Bidding Room</h1>
        <div className="bg-gray-800 px-4 py-2 rounded-lg shadow-md">
          ⏳ Time Left: <span className="font-bold text-yellow-400">{formatTime(timeLeft)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Section: Bidding Panel */}
        <div className="lg:col-span-2 bg-gray-800 rounded-xl shadow-lg p-5">
          <h2 className="text-2xl font-semibold mb-4">💰 Place Your Bids</h2>
          <p className="text-gray-300 mb-4">
            Current Highest Bid: <span className="font-bold text-green-400">₹{currentBid}</span>
          </p>

          {isSubscribed ? (
            <>
              <div className="flex gap-3 mb-3">
                <input
                  type="number"
                  placeholder="Enter your bid"
                  className="flex-1 px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                />
                <button
                  onClick={handleBid}
                  className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg font-semibold transition-all shadow-md"
                >
                  Place Bid
                </button>
              </div>

              {/* Quick Bid Suggestions */}
              <div className="flex gap-3 mb-5">
                {[1, 2, 3].map((multiplier) => (
                  <button
                    key={multiplier}
                    onClick={() => handleQuickBid(multiplier * minIncrement)}
                    className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg shadow-md border border-gray-600 transition-all"
                  >
                    +₹{multiplier * minIncrement}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <p className="text-red-400 mt-3">⚠️ You are in spectator mode. Subscribe to place bids.</p>
          )}

          {/* Bid History */}
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-3">📜 Live Bid History</h3>
            <div className="max-h-48 overflow-y-auto bg-gray-700 rounded-lg p-3">
              {bidHistory.map((bid, idx) => (
                <p key={idx} className="text-gray-300">
                  <span className="font-semibold">{bid.user}</span> bid ₹{bid.amount}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Right Section: Leaderboard */}
        <div className="bg-gray-800 rounded-xl shadow-lg p-5">
          <h2 className="text-2xl font-semibold mb-4">🏅 Leaderboard</h2>
          <div className="space-y-3">
            {leaderboard.slice(0, 5).map((entry, idx) => (
              <div
                key={idx}
                className="flex justify-between bg-gray-700 px-4 py-2 rounded-lg shadow-md"
              >
                <span className="font-medium">{idx + 1}. {entry.name}</span>
                <span className="font-bold text-green-400">₹{entry.amount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bidding Trends Chart */}
      <div className="mt-8 bg-gray-800 rounded-xl shadow-lg p-5">
        <h2 className="text-2xl font-semibold mb-4">📈 Bidding Trends</h2>
        <Line
          data={chartData}
          options={{
            responsive: true,
            plugins: { legend: { labels: { color: "white" } } },
            scales: { x: { ticks: { color: "white" } }, y: { ticks: { color: "white" } } },
          }}
        />
      </div>
    </div>
  );
}
