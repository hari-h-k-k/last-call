'use client';
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { itemService } from '../../services/itemService';
import ItemCard from '../../components/ui/ItemCard';
import Navbar from '../../components/layout/Navbar';
import DualRangeSlider from '../../components/ui/DualRangeSlider';

export default function BrowsePage() {
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    registered: 'all',
    priceMin: '',
    priceMax: '',
    sortBy: 'date',
    auctionStatus: 'all'
  });

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam.toUpperCase());
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesResponse = await itemService.getCategories();
        setCategories(categoriesResponse.subject || []);
        
        const itemsResponse = await itemService.getLastCallToRegister();
        setItems(itemsResponse.subject || []);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      setIsLoading(true);
      const response = await itemService.searchItems(searchQuery);
      setItems(response.subject || []);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredItems = items.filter(item => {
    // Category filter
    if (selectedCategory !== 'ALL' && item.item.category !== selectedCategory) return false;
    
    // Registration filter
    if (filters.registered === 'registered' && !item.registered) return false;
    if (filters.registered === 'not-registered' && item.registered) return false;
    
    // Price filter
    if (filters.priceMin && item.item.startingPrice < parseFloat(filters.priceMin)) return false;
    if (filters.priceMax && item.item.startingPrice > parseFloat(filters.priceMax)) return false;
    
    // Auction status filter
    const now = new Date();
    const regClosing = new Date(item.item.registrationClosingDate);
    const auctionStart = new Date(item.item.auctionStartDate);
    
    if (filters.auctionStatus === 'registration-open' && regClosing <= now) return false;
    if (filters.auctionStatus === 'registration-closed' && regClosing > now) return false;
    if (filters.auctionStatus === 'auction-started' && auctionStart > now) return false;
    
    return true;
  }).sort((a, b) => {
    if (filters.sortBy === 'price-low') return a.item.startingPrice - b.item.startingPrice;
    if (filters.sortBy === 'price-high') return b.item.startingPrice - a.item.startingPrice;
    if (filters.sortBy === 'date') return new Date(a.item.auctionStartDate) - new Date(b.item.auctionStartDate);
    return 0;
  });

  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8 pt-24">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">Browse Items</h1>
          <p className="text-xl text-slate-300">Discover amazing auction items</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="flex max-w-2xl mx-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for items..."
              className="flex-1 px-6 py-3 bg-slate-800 text-white rounded-l-lg border border-slate-700 focus:outline-none focus:border-amber-500"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button
              onClick={handleSearch}
              className="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold rounded-r-lg transition-colors"
            >
              Search
            </button>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className="w-72 bg-slate-800/50 rounded-xl p-6 h-fit sticky top-24">
            <h2 className="text-2xl font-bold text-white mb-6">Filters</h2>
            
            {/* Categories */}
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-white mb-2">Category</h3>
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-slate-700 text-white rounded-md p-2 text-sm border border-slate-600 focus:border-amber-500 focus:outline-none"
              >
                <option value="ALL">All Categories</option>
                {categories.map((categoryObj, index) => (
                  <option key={`category-${index}`} value={categoryObj.category}>
                    {categoryObj.category}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Registration Status */}
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-white mb-2">Registration</h3>
              <select 
                value={filters.registered}
                onChange={(e) => setFilters({...filters, registered: e.target.value})}
                className="w-full bg-slate-700 text-white rounded-md p-2 text-sm border border-slate-600 focus:border-amber-500 focus:outline-none"
              >
                <option value="all">All Items</option>
                <option value="registered">Registered Only</option>
                <option value="not-registered">Not Registered</option>
              </select>
            </div>
            
            {/* Price Range */}
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-white mb-2">Price Range</h3>
              <div className="px-2 py-4">
                <div className="mb-6">
                  <DualRangeSlider
                    min={0}
                    max={10000000}
                    step={1000}
                    minValue={parseInt(filters.priceMin) || 0}
                    maxValue={parseInt(filters.priceMax) || 10000000}
                    onChange={useCallback(({ min, max }) => {
                      setFilters(prev => ({...prev, priceMin: min.toString(), priceMax: max.toString()}));
                    }, [])}
                  />
                </div>
                <div className="flex justify-between text-xs text-slate-400">
                  <span>${(parseInt(filters.priceMin) || 0).toLocaleString()}</span>
                  <span>${(parseInt(filters.priceMax) || 10000000).toLocaleString()}</span>
                </div>
              </div>
            </div>
            
            {/* Auction Status */}
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-white mb-2">Auction Status</h3>
              <select 
                value={filters.auctionStatus}
                onChange={(e) => setFilters({...filters, auctionStatus: e.target.value})}
                className="w-full bg-slate-700 text-white rounded-md p-2 text-sm border border-slate-600 focus:border-amber-500 focus:outline-none"
              >
                <option value="all">All Auctions</option>
                <option value="registration-open">Registration Open</option>
                <option value="registration-closed">Registration Closed</option>
                <option value="auction-started">Auction Started</option>
              </select>
            </div>
            
            {/* Sort By */}
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-white mb-2">Sort By</h3>
              <select 
                value={filters.sortBy}
                onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
                className="w-full bg-slate-700 text-white rounded-md p-2 text-sm border border-slate-600 focus:border-amber-500 focus:outline-none"
              >
                <option value="date">Auction Date</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Items Grid */}
          <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">
              {selectedCategory === 'ALL' ? 'All Items' : selectedCategory} 
              <span className="text-slate-400 ml-2">({filteredItems.length})</span>
            </h2>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="text-amber-400 text-xl">Loading items...</div>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-slate-400 text-xl">No items found</div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <ItemCard key={item.item.id} item={item.item} registered={item.registered} />
              ))}
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}