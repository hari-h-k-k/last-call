'use client';
import { useState, useEffect } from 'react';
import RoomCard from '../ui/RoomCard';
import { roomService } from '../../services/roomService';

export default function LiveAuctionsPreview() {
  const [liveAuctions, setLiveAuctions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLiveAuctions = async () => {
      try {
        const response = await roomService.getLiveAuctions();
        setLiveAuctions(response.subject || []);
      } catch (error) {
        console.error('Failed to fetch live auctions:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLiveAuctions();
  }, []);

  if (isLoading) {
    return (
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <div className="text-green-400">Loading live auctions...</div>
          </div>
        </div>
      </section>
    );
  }

  if (liveAuctions.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gradient-to-r from-green-500/10 to-emerald-500/10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-4xl font-bold text-green-400">🔴 Live Auctions</h2>
          <div className="flex items-center text-green-400">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse mr-2"></div>
            <span className="text-sm font-medium">LIVE NOW</span>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {liveAuctions.map((room) => (
            <div key={room.id} className="relative">
              <RoomCard room={room} />
              <div className="absolute bottom-4 left-4 right-4">
                <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium transition-colors">
                  Join Auction
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}