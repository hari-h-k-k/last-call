'use client';

import { useState } from 'react';
import FeatureCard from './FeatureCard';
import SearchBar from '../ui/SearchBar';
import ItemCard from '../ui/ItemCard';
import PopularCategories from './PopularCategories';
import LiveAuctionsPreview from './LiveAuctionsPreview';
import StatsSection from './StatsSection';
import AuctionOfTheDay from './AuctionOfTheDay';
import LastCallToRegister from './LastCallToRegister';
import { itemService } from '../../services/itemService';
import LastCallToRegisterHybrid from "@/components/home/LastCallToRegisterHybrid";

export default function HomeContent() {
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (query) => {
    if (!query.trim()) {
      return;
    }
    window.location.href = `/search?q=${encodeURIComponent(query)}`;
  };



  return (
    <main id="home-section" className="min-h-screen bg-slate-800 py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold text-amber-400 mb-6">
            Start Bidding Today
          </h2>
          <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-4xl mx-auto">
            Join thousands of users in exciting real-time auctions
          </p>
          
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">Popular:</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {['Art', 'House', 'Car', 'Plot', 'Apartment', 'Collectibles'].map((category) => (
                <button
                  key={category}
                  onClick={() => window.location.href = `/browse?category=${category.toUpperCase()}`}
                  className="px-4 py-2 bg-slate-800 hover:bg-amber-500 hover:text-slate-900 text-slate-300 rounded-lg font-medium transition-colors"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="space-y-20">
          {/*<LastCallToRegister />*/}
          <LastCallToRegisterHybrid />
          <PopularCategories />
          <StatsSection />
        </div>
      </div>
    </main>
  );
}