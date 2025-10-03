'use client';
import { useState, useEffect } from 'react';
import { itemService } from '../../services/itemService';

export default function PopularCategories() {
  const [categories, setCategories] = useState([]);
  
  const categoryIcons = {
    ELECTRONICS: '📱',
    COLLECTIBLES: '🏆',
    ART: '🎨',
    JEWELRY: '💎',
    ANTIQUES: '🏺',
    SPORTS: '⚽',
    AUTOMOBILES: '🚗'
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await itemService.getCategories();
        console.log(response.data);
        setCategories(response.data || []);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <section className="py-16 bg-slate-900/50">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-amber-400 text-center mb-12">
          Popular Categories
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((categoryData, index) => (
            <div key={index} className="bg-slate-800/70 rounded-xl p-6 text-center hover:bg-slate-700/70 hover:scale-105 hover:shadow-xl hover:shadow-amber-500/20 transition-all duration-300 cursor-pointer group">
              <div className="text-3xl mb-3 group-hover:animate-pulse">{categoryIcons[categoryData.category] || '📎'}</div>
              <h3 className="text-white font-semibold mb-1 group-hover:text-amber-400 transition-colors">{categoryData.category}</h3>
              <p className="text-slate-400 text-sm">{categoryData.count} items</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}