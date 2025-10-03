'use client';
import { useState, useEffect } from 'react';

export default function StatsSection() {
  const [counts, setCounts] = useState([0, 0, 0, 0]);
  const stats = [
    { label: 'Active Auctions', value: 1247, icon: '🔥' },
    { label: 'Total Users', value: 25000, icon: '👥' },
    { label: 'Items Sold', value: 89432, icon: '📦' },
    { label: 'Success Rate', value: 98.5, icon: '✅' }
  ];

  useEffect(() => {
    stats.forEach((stat, index) => {
      let start = 0;
      const end = stat.value;
      const duration = 2000;
      const increment = end / (duration / 16);
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCounts(prev => {
            const newCounts = [...prev];
            newCounts[index] = end;
            return newCounts;
          });
          clearInterval(timer);
        } else {
          setCounts(prev => {
            const newCounts = [...prev];
            newCounts[index] = Math.floor(start);
            return newCounts;
          });
        }
      }, 16);
    });
  }, []);

  return (
    <section className="py-16 bg-gradient-to-r from-amber-500/10 to-amber-600/10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center hover:scale-105 transition-transform cursor-pointer">
              <div className="text-4xl mb-3 hover:animate-bounce">{stat.icon}</div>
              <div className="text-3xl font-bold text-amber-400 mb-2">
                {index === 3 ? `${counts[index]}%` : 
                 index === 1 ? `${counts[index].toLocaleString()}+` : 
                 counts[index].toLocaleString()}
              </div>
              <div className="text-slate-300">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}