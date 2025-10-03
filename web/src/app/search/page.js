'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import SearchBar from '../../components/ui/SearchBar';
import ItemCard from '../../components/ui/ItemCard';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Navbar from '../../components/layout/Navbar';
import { itemService } from '../../services/itemService';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [searchResults, setSearchResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [filters, setFilters] = useState({
    registered: 'all',
    category: 'all',
    sortBy: 'date'
  });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await itemService.getCategories();
        setCategories(response.data || []);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      handleSearch(query);
    }
  }, [searchParams]);

  useEffect(() => {
    applyFilters();
  }, [searchResults, filters]);

  const handleSearch = async (query) => {
    setIsSearching(true);
    setHasSearched(true);
    try {
      const response = await itemService.searchItems(query);
      setSearchResults(response.data || []);
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...searchResults];

    if (filters.registered !== 'all') {
      filtered = filtered.filter(result => 
        filters.registered === 'registered' ? result.registered : !result.registered
      );
    }

    if (filters.category !== 'all') {
      filtered = filtered.filter(result => result.item.category === filters.category);
    }

    if (filters.sortBy === 'price-low') {
      filtered.sort((a, b) => a.item.startingPrice - b.item.startingPrice);
    } else if (filters.sortBy === 'price-high') {
      filtered.sort((a, b) => b.item.startingPrice - a.item.startingPrice);
    } else if (filters.sortBy === 'date') {
      filtered.sort((a, b) => new Date(a.item.auctionStartDate) - new Date(b.item.auctionStartDate));
    }

    setFilteredResults(filtered);
  };

  return (
    <>
      <Navbar variant="header" />
      <div className="min-h-screen bg-slate-800 pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <SearchBar 
            placeholder="Search auctions..." 
            onSearch={handleSearch}
            className="max-w-2xl mx-auto"
          />
        </div>

        <div className="flex gap-8">
          <div className="w-64 bg-slate-900/50 rounded-xl p-6">
            <h3 className="text-white font-semibold mb-4">Filters</h3>
            
            <div className="mb-6">
              <label className="text-slate-300 text-sm mb-2 block">Registration Status</label>
              <select 
                value={filters.registered}
                onChange={(e) => setFilters({...filters, registered: e.target.value})}
                className="w-full bg-slate-800 text-white rounded-lg p-2 border border-slate-700"
              >
                <option value="all">All Items</option>
                <option value="registered">Registered Only</option>
                <option value="not-registered">Not Registered</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="text-slate-300 text-sm mb-2 block">Category</label>
              <select 
                value={filters.category}
                onChange={(e) => setFilters({...filters, category: e.target.value})}
                className="w-full bg-slate-800 text-white rounded-lg p-2 border border-slate-700"
              >
                <option value="all">All Categories</option>
                {categories.map(categoryData => (
                  <option key={categoryData.category} value={categoryData.category}>{categoryData.category}</option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label className="text-slate-300 text-sm mb-2 block">Sort By</label>
              <select 
                value={filters.sortBy}
                onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
                className="w-full bg-slate-800 text-white rounded-lg p-2 border border-slate-700"
              >
                <option value="date">Auction Date</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          <div className="flex-1">
            {isSearching && (
              <LoadingSpinner text="Searching..." />
            )}

            {filteredResults.length > 0 ? (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">
                    Search Results ({filteredResults.length})
                  </h2>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredResults.map((result) => (
                    <ItemCard key={result.item.id} item={result.item} />
                  ))}
                </div>
              </>
            ) : hasSearched && searchResults.length === 0 && !isSearching ? (
              <div className="text-center text-slate-400 py-12">
                <p>No search results found. Try a different search term.</p>
              </div>
            ) : null}
          </div>
        </div>
        </div>
      </div>
    </>
  );
}