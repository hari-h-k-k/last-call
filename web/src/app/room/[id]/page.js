'use client';
import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { roomService } from '../../../services/roomService';
import { itemService } from '../../../services/itemService';
import { useAuth } from '../../../hooks/useAuth';
import Navbar from '../../../components/layout/Navbar';
import { Line } from 'react-chartjs-2';
import { Client } from '@stomp/stompjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function RoomPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const isSpectating = searchParams.get('spectate') === 'true';
  const { isAuthenticated } = useAuth();

  const [item, setItem] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [bidHistory, setBidHistory] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [currentBid, setCurrentBid] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isBidding, setIsBidding] = useState(false);
  const [stompClient, setStompClient] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [myBid, setMyBid] = useState(null);
  const [winnerId, setWinnerId] = useState(null);
  const [roomStatus, setRoomStatus] = useState('ACTIVE');

  const formatPrice = (price) => `$${(price || 0).toFixed(2)}`;

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const [itemResponse, bidHistoryResponse, leaderboardResponse] = await Promise.all([
          itemService.getItemById(id),
          roomService.getBidHistory(id),
          roomService.getLeaderboard(id)
        ]);

        setItem(itemResponse.subject.item);
        setBidHistory(bidHistoryResponse.subject || []);
        setLeaderboard(leaderboardResponse.subject || []);
        setCurrentBid(bidHistoryResponse.subject?.[0]?.bidAmount || itemResponse.subject.item.startingPrice);
      } catch (error) {
        console.error('Failed to fetch room data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchRoomData();
      const interval = setInterval(fetchRoomData, 5000);
      return () => clearInterval(interval);
    }
  }, [id]);

  // Setup WebSocket Connection
  useEffect(() => {
    const token = localStorage.getItem('token');

    const client = new Client({
      brokerURL: `ws://localhost:8080/ws-auction/websocket${token ? `?token=${token}` : ''}`,
      debug: (str) => console.log(str),
      reconnectDelay: 5000,
    });

    client.onConnect = () => {
      console.log("Connected to WebSocket");

      client.subscribe(`/topic/currentBid/${id}`, (message) => {
        const data = JSON.parse(message.body);
        console.log("New bid:", data);

        // Update state with new payload
        if (data.currentPrice) setCurrentBid(data.currentPrice);
        if (data.bid) setBidHistory((prev) => [data.bid, ...prev]);
        if (data.leaderboard) setLeaderboard(data.leaderboard);
        if (data.newEndDate) {
          const end = new Date(data.newEndDate).getTime();
          const now = Date.now();
          const diff = Math.max(Math.floor((end - now) / 1000), 0);
          setTimeLeft(diff);
        }
        if (data.myBid) setMyBid(data.myBid);
        if (data.winnerId) setWinnerId(data.winnerId);
        if (data.roomStatus) setRoomStatus(data.roomStatus);
      });
    };

    client.activate();
    setStompClient(client);

    return () => {
      client.deactivate();
    };
  }, [id]);

  const handleBid = async () => {
    if (!bidAmount || parseFloat(bidAmount) <= currentBid) return;

    setIsBidding(true);
    try {
      await roomService.placeBid(id, parseFloat(bidAmount));
      setBidAmount('');
      // WebSocket will handle the updates automatically
    } catch (error) {
      console.error('Failed to place bid:', error);
    } finally {
      setIsBidding(false);
    }
  };

  const reversedHistory = [...bidHistory].reverse();
  const chartData = {
    labels: reversedHistory.map((_, i) => `Bid ${i + 1}`),
    datasets: [
      {
        label: "Bid Amount",
        data: reversedHistory.map((b) => b.bidAmount || b.amount),
        borderColor: "#3B82F6",
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };



  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-amber-400 text-xl">Loading auction room...</div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-red-400 text-xl">Auction room not found</div>
      </div>
    );
  }

  const formatTime = (seconds) => {
    if (seconds <= 0) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleQuickBid = (increment) => {
    setBidAmount((currentBid + increment).toString());
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-900 text-white p-6 pt-24">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">
            🏆 {item?.title || "Live Bidding Room"}
          </h1>
          <div className="bg-gray-800 px-4 py-2 rounded-lg shadow-md">
            ⏳ Time Left:{" "}
            <span className="font-bold text-yellow-400">{formatTime(timeLeft)}</span>
          </div>
        </div>

        {/* Auction Closed Banner */}
        {roomStatus === "CLOSED" && (
          <div className="bg-red-600 text-white p-6 rounded-lg shadow-lg text-center mb-6">
            <h2 className="text-2xl font-bold">🚨 Auction Closed</h2>
            <p className="mt-2">
              Item sold to <span className="font-bold">{winnerId}</span> for{" "}
              <span className="font-bold text-yellow-300">₹{currentBid}</span>
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
              {winnerId && myBid?.username === winnerId && (
                <span className="ml-2 text-sm text-yellow-400">(You are winning 🎉)</span>
              )}
            </p>

            {/* Show bidding components only if not closed */}
            {roomStatus !== "CLOSED" ? (
              !isSpectating && isAuthenticated ? (
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
                      disabled={isBidding || !bidAmount || parseFloat(bidAmount) <= currentBid}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-5 py-2 rounded-lg font-semibold transition-all shadow-md"
                    >
                      {isBidding ? 'Bidding...' : 'Place Bid'}
                    </button>
                  </div>

                  <div className="flex gap-3 mb-5">
                    {[500, 1000, 1500].map((increment) => (
                      <button
                        key={increment}
                        onClick={() => handleQuickBid(increment)}
                        className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg shadow-md border border-gray-600 transition-all"
                      >
                        +₹{increment}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-red-400 mt-3">
                  ⚠️ {isSpectating ? 'You are in spectator mode. Subscribe to place bids.' : 'Please log in to place bids.'}
                </p>
              )
            ) : (
              <p className="text-yellow-400 font-semibold">Bidding has ended.</p>
            )}

            {/* Bid History */}
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-3">📜 Live Bid History</h3>
              <div className="max-h-48 overflow-y-auto bg-gray-700 rounded-lg p-3">
                {bidHistory.length > 0 ? (
                  bidHistory.map((bid, idx) => (
                    <p
                      key={idx}
                      className={`text-gray-300 ${
                        myBid && myBid.id === bid.id ? "text-yellow-400 font-semibold" : ""
                      }`}
                    >
                      <span className="font-semibold">{bid.username || bid.bidderName}</span> bid ₹{bid.bidAmount || bid.amount}
                    </p>
                  ))
                ) : (
                  <p className="text-gray-400">No bids yet</p>
                )}
              </div>
            </div>
          </div>

          {/* Leaderboard */}
          <div className="bg-gray-800 rounded-xl shadow-lg p-5">
            <h2 className="text-2xl font-semibold mb-4">🏅 Leaderboard</h2>
            <div className="space-y-3">
              {leaderboard.length > 0 ? (
                leaderboard.slice(0, 5).map((entry, idx) => (
                  <div
                    key={idx}
                    className={`flex justify-between bg-gray-700 px-4 py-2 rounded-lg shadow-md ${
                      myBid && entry.userId === myBid.userId
                        ? "border border-yellow-400"
                        : ""
                    }`}
                  >
                    <span className="font-medium">
                      {idx + 1}. {entry.username || entry.bidderName}
                    </span>
                    <span className="font-bold text-green-400">₹{entry.amount || entry.bidAmount}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">No leaderboard data yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="mt-8 bg-gray-800 rounded-xl shadow-lg p-5">
          <h2 className="text-2xl font-semibold mb-4">📈 Bidding Trends</h2>
          {bidHistory.length > 0 ? (
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
          ) : (
            <p className="text-gray-400 text-center py-8">No bid data to display</p>
          )}
        </div>
      </div>
    </>
  );
}
