'use client';

import { useState } from 'react';
import FeatureCard from './FeatureCard';
import SearchBar from '../ui/SearchBar';
import ItemCard from '../ui/ItemCard';
import PopularCategories from './PopularCategories';
import LiveAuctionsPreview from './LiveAuctionsPreview';
import StatsSection from './StatsSection';
import InteractiveSearchSuggestions from './InteractiveSearchSuggestions';
import AuctionOfTheDay from './AuctionOfTheDay';
import LastCallToRegister from './LastCallToRegister';
import { itemService } from '../../services/itemService';

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
          
          <SearchBar 
            placeholder="Search for items, categories, or brands..." 
            onSearch={handleSearch}
            className="max-w-4xl mx-auto"
          />
          <InteractiveSearchSuggestions onSearch={handleSearch} />
        </div>
        
        <div className="space-y-20">
          <LastCallToRegister />
          <AuctionOfTheDay />
          <LiveAuctionsPreview />
          <PopularCategories />
          <StatsSection />
        </div>
      </div>
    </main>
  );
}