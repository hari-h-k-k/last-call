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

  const chartData = {
    labels: bidHistory.slice().reverse().map((bid, index) => `Bid ${index + 1}`),
    datasets: [
      {
        label: 'Bid Amount',
        data: bidHistory.slice().reverse().map(bid => bid.bidAmount),
        borderColor: 'rgb(245, 158, 11)',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'rgb(203, 213, 225)'
        }
      },
      title: {
        display: true,
        text: 'Bid History',
        color: 'rgb(203, 213, 225)'
      },
    },
    scales: {
      y: {
        ticks: {
          color: 'rgb(148, 163, 184)',
          callback: function(value) {
            return '$' + value.toFixed(2);
          }
        },
        grid: {
          color: 'rgba(148, 163, 184, 0.1)'
        }
      },
      x: {
        ticks: {
          color: 'rgb(148, 163, 184)'
        },
        grid: {
          color: 'rgba(148, 163, 184, 0.1)'
        }
      }
    }
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

  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8 pt-24">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Auction Area */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-800 rounded-xl p-6">
              <h1 className="text-3xl font-bold text-white mb-4">{item.title}</h1>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-slate-400">Current Bid</p>
                  <p className="text-4xl font-bold text-amber-400">{formatPrice(currentBid)}</p>
                </div>
                {isSpectating && (
                  <span className="bg-blue-500/20 text-blue-400 px-4 py-2 rounded-full font-medium">
                    SPECTATING
                  </span>
                )}
              </div>

              {/* Bidding Section */}
              {!isSpectating && isAuthenticated && (
                <div className="bg-slate-700/50 rounded-lg p-4 mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Place Your Bid</h3>
                  <div className="flex gap-3">
                    <input
                      type="number"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      placeholder={`Min: ${formatPrice(currentBid + 1)}`}
                      min={currentBid + 1}
                      step="0.01"
                      className="flex-1 bg-slate-600 text-white px-4 py-3 rounded-lg border border-slate-500 focus:border-amber-400 focus:outline-none"
                    />
                    <button
                      onClick={handleBid}
                      disabled={isBidding || !bidAmount || parseFloat(bidAmount) <= currentBid}
                      className="bg-amber-500 hover:bg-amber-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                    >
                      {isBidding ? 'Bidding...' : 'Bid'}
                    </button>
                  </div>
                </div>
              )}

              {/* Bid History Chart */}
              <div className="bg-slate-700/30 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-4">Bid History</h3>
                {bidHistory.length > 0 ? (
                  <div className="h-64">
                    <Line data={chartData} options={chartOptions} />
                  </div>
                ) : (
                  <p className="text-slate-400 text-center py-8">No bids yet</p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Leaderboard */}
            <div className="bg-slate-800 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Leaderboard</h3>
              {leaderboard.length > 0 ? (
                <div className="space-y-3">
                  {leaderboard.slice(0, 10).map((bidder, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                          index === 0 ? 'bg-amber-500 text-slate-900' :
                          index === 1 ? 'bg-slate-400 text-slate-900' :
                          index === 2 ? 'bg-amber-600 text-white' :
                          'bg-slate-600 text-slate-300'
                        }`}>
                          {index + 1}
                        </span>
                        <span className="text-white font-medium">{bidder.bidderName || 'Anonymous'}</span>
                      </div>
                      <span className="text-amber-400 font-bold">{formatPrice(bidder.bidAmount)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 text-center py-4">No bids yet</p>
              )}
            </div>

            {/* Recent Bids */}
            <div className="bg-slate-800 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Recent Bids</h3>
              {bidHistory.length > 0 ? (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {bidHistory.slice(0, 10).map((bid, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-slate-700/30 rounded">
                      <span className="text-slate-300 text-sm">{bid.bidderName || 'Anonymous'}</span>
                      <span className="text-amber-400 font-semibold">{formatPrice(bid.bidAmount)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 text-center py-4">No bids yet</p>
              )}
            </div>

            {/* Item Details */}
            <div className="bg-slate-800 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Item Details</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-slate-400 text-sm">Starting Price</p>
                  <p className="text-white font-semibold">{formatPrice(item.startingPrice)}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Category</p>
                  <p className="text-white font-semibold">{item.category}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Description</p>
                  <p className="text-slate-300 text-sm">{item.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}