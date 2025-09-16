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
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useParams } from "next/navigation";
import api from "@/lib/axios";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function BiddingRoom() {
  const [timeLeft, setTimeLeft] = useState(300);
  const [isSubscribed, setIsSubscribed] = useState(true);
  const [currentBid, setCurrentBid] = useState(500);
  const [bidAmount, setBidAmount] = useState("");
  const [minIncrement, setMinIncrement] = useState(500);
  const [leaderboard, setLeaderboard] = useState([]);
  const [bidHistory, setBidHistory] = useState([]);
  const [roomInfo, setRoomInfo] = useState(null); // ✅ state for room info

  const [stompClient, setStompClient] = useState(null);
  const { id } = useParams();

  // Countdown Timer
  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // ✅ Fetch room info from API
  useEffect(() => {
    const fetchRoomInfo = async () => {
      try {
        const userInfo = JSON.parse(sessionStorage.getItem("userInfo")) || {};
        const userId = userInfo?.id || "";
        const token = userInfo?.token || "";

        const response = await api.get("/get-room", {
          params: { roomId: id },
          headers: { Authorization: `Bearer ${token}` },
        });

        setRoomInfo(response.data);
        console.log("Room Info:", response.data);

        // Optionally: set initial subscription state if backend returns it
        if (response.data?.isSubscribed !== undefined) {
          setIsSubscribed(response.data.isSubscribed);
        }
      } catch (error) {
        console.error("Error fetching room info:", error);
      }
    };

    if (id) fetchRoomInfo();
  }, [id]);

  // Setup WebSocket Connection
  useEffect(() => {
    const token = sessionStorage.getItem("userInfo")
      ? JSON.parse(sessionStorage.getItem("userInfo")).token
      : null;

    const client = new Client({
      brokerURL: "ws://localhost:8080/ws-auction",
      connectHeaders: { Authorization: `Bearer ${token}` },
      debug: (str) => console.log(str),
      reconnectDelay: 5000,
    });

    client.onConnect = (frame) => {
      console.log("Connected:", frame);

      client.subscribe("/user/queue/welcome", (message) => {
        const data = JSON.parse(message.body);
        console.log("Server says:", data.message);
      });

      client.subscribe(`/topic/currentBid/${id}`, (message) => {
        const data = JSON.parse(message.body);
        console.log("New bid:", data);
        setBidHistory((prev) => [data, ...prev]);
        setCurrentBid(data.amount);
      });
    };

    client.activate();
    setStompClient(client);

    return () => {
      client.deactivate();
    };
  }, [id]);

  // Handle New Bid
  const handleBid = async () => {
    if (!bidAmount || parseInt(bidAmount) <= currentBid) {
      alert("Your bid must be higher than the current bid!");
      return;
    }

    const token = localStorage.getItem("jwtToken");
    if (!token) {
      alert("Unauthorized! Please log in.");
      return;
    }

    try {
      const response = await api.post(
        "/place-bid",
        {},
        {
          params: { id, bidAmount },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        console.log("Bid placed:", response.data.message);
        setBidAmount("");
      }
    } catch (error) {
      console.error("Error placing bid:", error);
      const msg = error.response?.data?.message || "Failed to place bid";
      alert(msg);
    }
  };

  const handleQuickBid = (increment) => {
    setBidAmount(currentBid + increment);
  };

  // Chart Data
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
          ⏳ Time Left:{" "}
          <span className="font-bold text-yellow-400">{formatTime(timeLeft)}</span>
        </div>
      </div>

      {/* ✅ Show Room Info */}
      {roomInfo && (
        <div className="bg-gray-800 p-4 mb-6 rounded-lg shadow-md">
          <p className="text-lg">
            <span className="font-bold">Room Name:</span> {roomInfo.name}
          </p>
          <p className="text-gray-400">
            <span className="font-bold">Created By:</span> {roomInfo.owner}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Section */}
        <div className="lg:col-span-2 bg-gray-800 rounded-xl shadow-lg p-5">
          <h2 className="text-2xl font-semibold mb-4">💰 Place Your Bids</h2>
          <p className="text-gray-300 mb-4">
            Current Highest Bid:{" "}
            <span className="font-bold text-green-400">₹{currentBid}</span>
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
            <p className="text-red-400 mt-3">
              ⚠️ You are in spectator mode. Subscribe to place bids.
            </p>
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

        {/* Leaderboard */}
        <div className="bg-gray-800 rounded-xl shadow-lg p-5">
          <h2 className="text-2xl font-semibold mb-4">🏅 Leaderboard</h2>
          <div className="space-y-3">
            {leaderboard.slice(0, 5).map((entry, idx) => (
              <div
                key={idx}
                className="flex justify-between bg-gray-700 px-4 py-2 rounded-lg shadow-md"
              >
                <span className="font-medium">
                  {idx + 1}. {entry.name}
                </span>
                <span className="font-bold text-green-400">₹{entry.amount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="mt-8 bg-gray-800 rounded-xl shadow-lg p-5">
        <h2 className="text-2xl font-semibold mb-4">📈 Bidding Trends</h2>
        <Line
          data={chartData}
          options={{
            responsive: true,
            plugins: { legend: { labels: { color: "white" } } },
            scales: {
              x: { ticks: { color: "white" } },
              y: { ticks: { color: "white" } },
            },
          }}
        />
      </div>
    </div>
  );
}
