'use client';
import { useState, useEffect } from 'react';
import ItemCard from '../ui/ItemCard';
import { itemService } from '../../services/itemService';
import { THUMBNAIL_ARRAY } from '../../constants/images';

export default function LastCallToRegisterHybrid() {
  const [lastCallItems, setLastCallItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [featuredImageIndex, setFeaturedImageIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const formatTimeLeft = (registrationClosingDate) => {
    const closingDate = new Date(registrationClosingDate);
    const timeDiff = closingDate - currentTime;
    
    if (timeDiff <= 0) return 'Closed';
    
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  const fetchLastCallItems = async () => {
    try {
      const response = await itemService.getLastCallToRegister();
      const items = response.subject || [];
      
      // Filter out expired items
      const validItems = items.filter(item => {
        const closingDate = new Date(item.item.registrationClosingDate);
        return closingDate > new Date();
      });
      
      setLastCallItems(validItems);
      
      // Reset featured index if current item is no longer valid
      if (featuredIndex >= validItems.length) {
        setFeaturedIndex(0);
      }
    } catch (error) {
      console.error('Failed to fetch last call items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLastCallItems();
  }, []);

  // Auto-refresh data every 5 minutes
  useEffect(() => {
    const dataRefreshInterval = setInterval(fetchLastCallItems, 5 * 60 * 1000);
    return () => clearInterval(dataRefreshInterval);
  }, [featuredIndex]);

  // Update current time every minute for real-time countdown
  useEffect(() => {
    const timeUpdateInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60 * 1000);
    return () => clearInterval(timeUpdateInterval);
  }, []);

  // Remove expired items in real-time
  useEffect(() => {
    const checkExpiredItems = () => {
      const now = new Date();
      const validItems = lastCallItems.filter(item => {
        const closingDate = new Date(item.item.registrationClosingDate);
        return closingDate > now;
      });
      
      if (validItems.length !== lastCallItems.length) {
        setLastCallItems(validItems);
        if (featuredIndex >= validItems.length) {
          setFeaturedIndex(0);
        }
      }
    };
    
    const expiredCheckInterval = setInterval(checkExpiredItems, 60 * 1000);
    return () => clearInterval(expiredCheckInterval);
  }, [lastCallItems, featuredIndex]);

  useEffect(() => {
    if (lastCallItems.length > 0) {
      const featuredInterval = setInterval(() => {
        setFeaturedIndex(prev => (prev + 1) % lastCallItems.length);
      }, 15000);
      return () => clearInterval(featuredInterval);
    }
  }, [lastCallItems.length]);

  useEffect(() => {
    const imageInterval = setInterval(() => {
      setFeaturedImageIndex(prev => (prev + 1) % THUMBNAIL_ARRAY.length);
    }, 3000);
    return () => clearInterval(imageInterval);
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
    return (
      <section className="py-16 bg-gradient-to-r from-red-500/10 to-orange-500/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-red-400 mb-4">
              ⏰ Last Call to Register
            </h2>
            <p className="text-xl text-slate-300">
              No items currently closing within 48 hours. Check back soon!
            </p>
          </div>
        </div>
      </section>
    );
  }

  const featuredItem = lastCallItems[featuredIndex];
  const otherItems = lastCallItems.filter((_, index) => index !== featuredIndex);
  const maxOtherItems = 6;
  const displayedOtherItems = otherItems.slice(0, maxOtherItems);
  const hasMoreItems = otherItems.length > maxOtherItems;

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
        
        {/* Featured Item */}
        <div className="mb-12">
          <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700/50 shadow-2xl shadow-red-500/20 hover:shadow-red-500/30 transition-shadow duration-300">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div className="relative">
                <img 
                  src={THUMBNAIL_ARRAY[featuredImageIndex]}
                  alt={featuredItem.item.title}
                  className="w-full h-80 object-cover rounded-xl"
                />
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                  {THUMBNAIL_ARRAY.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setFeaturedImageIndex(index)}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index === featuredImageIndex ? 'bg-red-400' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-3xl font-bold text-white">{featuredItem.item.title}</h3>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      featuredItem.registered 
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {featuredItem.item.category}
                    </span>
                    {featuredItem.registered && (
                      <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                        ✓ REGISTERED
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-slate-300 text-lg mb-6">{featuredItem.item.description}</p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-lg">
                    <span className="text-slate-400">Starting Price</span>
                    <span className="text-red-400 font-bold">${featuredItem.item.startingPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg">
                    <span className="text-slate-400">Registration Closes</span>
                    <span className="text-red-400 font-bold">{formatTimeLeft(featuredItem.item.registrationClosingDate)}</span>
                  </div>
                  <div className="flex justify-between text-lg">
                    <span className="text-slate-400">Interested Users</span>
                    <span className="text-slate-300 font-medium">{featuredItem.item.subscribers?.length || 0}</span>
                  </div>
                </div>
                
                <button className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-bold text-lg transition-colors">
                  {featuredItem.registered ? 'View Details' : 'Register Now'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Other Items Grid */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-white">Other Items Closing Soon</h3>
            {hasMoreItems && (
              <button 
                onClick={() => window.location.href = '/search?category=last-call'}
                className="text-red-400 hover:text-red-300 font-medium transition-colors"
              >
                View All ({otherItems.length})
              </button>
            )}
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedOtherItems.map((item) => (
              <ItemCard key={item.item.id} item={item.item} registered={item.registered} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}