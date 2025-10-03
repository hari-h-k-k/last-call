'use client';
import { useState, useEffect } from 'react';
import ItemCard from '../ui/ItemCard';
import { itemService } from '../../services/itemService';

export default function LastCallToRegister() {
  const [lastCallItems, setLastCallItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLastCallItems = async () => {
      try {
        const response = await itemService.getUpcomingItems();
        const now = new Date();
        const next48Hours = new Date(now.getTime() + 48 * 60 * 60 * 1000);
        
        const lastCallItems = response.data?.filter(item => {
          const regClosingDate = new Date(item.item.registrationClosingDate);
          return regClosingDate > now && regClosingDate <= next48Hours;
        }) || [];
        
        setLastCallItems(lastCallItems.slice(0, 6));
      } catch (error) {
        console.error('Failed to fetch last call items:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLastCallItems();
  }, []);

  if (isLoading) {
    return (
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <div className="text-amber-400">Loading registration deadlines...</div>
          </div>
        </div>
      </section>
    );
  }

  if (lastCallItems.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gradient-to-r from-red-500/10 to-orange-500/10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-red-400 mb-4">
            ⏰ Last Call to Register
          </h2>
          <p className="text-xl text-slate-300">
            Registration closing within 48 hours - Don't miss out!
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lastCallItems.map((item) => (
            <div key={item.item.id} className="relative">
              <ItemCard item={item.item} />
              <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse">
                URGENT
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}