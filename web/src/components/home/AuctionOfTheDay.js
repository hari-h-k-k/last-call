'use client';
import { useState, useEffect } from 'react';
import ItemCard from '../ui/ItemCard';
import { itemService } from '../../services/itemService';

export default function AuctionOfTheDay() {
  const [todaysAuctions, setTodaysAuctions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTodaysAuctions = async () => {
      try {
        const response = await itemService.getTodaysAuctions();
        const today = new Date().toDateString();
        const todaysItems = response.data?.filter(item => 
          new Date(item.item.auctionStartDate).toDateString() === today
        ) || [];
        setTodaysAuctions(todaysItems.slice(0, 6));
      } catch (error) {
        console.error('Failed to fetch today\'s auctions:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTodaysAuctions();
  }, []);

  if (isLoading) {
    return (
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <div className="text-amber-400">Loading today's auctions...</div>
          </div>
        </div>
      </section>
    );
  }

  if (todaysAuctions.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gradient-to-r from-amber-500/5 to-amber-600/5">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-amber-400 mb-4">
            🔥 Auction of the Day
          </h2>
          <p className="text-xl text-slate-300">
            Don't miss these exciting auctions happening today!
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {todaysAuctions.map((auction) => (
            <div key={auction.item.id} className="relative">
              <ItemCard item={auction.item} />
              <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse">
                TODAY
              </div>
            </div>
          ))}
        </div>
        
        {todaysAuctions.length === 6 && (
          <div className="text-center mt-8">
            <button className="bg-amber-500 hover:bg-amber-600 text-slate-900 px-6 py-3 rounded-lg font-semibold transition-colors">
              View All Today's Auctions
            </button>
          </div>
        )}
      </div>
    </section>
  );
}