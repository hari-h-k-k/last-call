'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { itemService } from '../../../services/itemService';
import { authService } from '../../../services/authService';
import { THUMBNAIL_ARRAY } from '../../../constants/images';
import Navbar from '../../../components/layout/Navbar';
import LoginModal from '../../../components/modals/LoginModal';
import SignupModal from '../../../components/modals/SignupModal';

export default function ItemDetailsPage() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [registered, setRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());

  const formatPrice = (price) => `$${(price || 0).toFixed(2)}`;
  const formatTimeLeft = (registrationClosingDate) => {
    const closingDate = new Date(registrationClosingDate);
    const timeDiff = closingDate - currentTime;
    
    if (timeDiff <= 0) return 'Closed';
    
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    
    if (hours > 48) {
      return closingDate.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' });
    }
    
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await itemService.getItemById(id);
        console.log(response)
        setItem(response.subject.item);
        setRegistered(response.subject.registered || false);
      } catch (error) {
        console.error('Failed to fetch item:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchItem();
    }
  }, [id]);

  useEffect(() => {
    const timeUpdateInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60 * 1000);
    return () => clearInterval(timeUpdateInterval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(prev => (prev + 1) % THUMBNAIL_ARRAY.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-amber-400 text-xl">Loading item details...</div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-red-400 text-xl">Item not found</div>
      </div>
    );
  }

  const registrationClosed = new Date(item.registrationClosingDate) <= new Date();

  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8 pt-24">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative">
              <img 
                src={THUMBNAIL_ARRAY[currentImageIndex]}
                alt={item.title}
                className="w-full h-96 object-cover rounded-xl"
              />
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                {THUMBNAIL_ARRAY.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentImageIndex ? 'bg-amber-400' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {THUMBNAIL_ARRAY.slice(0, 4).map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`${item.title} ${index + 1}`}
                  className={`h-20 object-cover rounded-lg cursor-pointer transition-opacity ${
                    index === currentImageIndex ? 'opacity-100 ring-2 ring-amber-400' : 'opacity-70'
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>
          </div>

          {/* Item Details */}
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <h1 className="text-4xl font-bold text-white">{item.title}</h1>
              <div className="flex flex-col items-end gap-2">
                {registered && (
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    ✓ REGISTERED
                  </span>
                )}
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  registered 
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-amber-500/20 text-amber-400'
                }`}>
                  {item.category}
                </span>
              </div>
            </div>

            <p className="text-slate-300 text-lg leading-relaxed">{item.description}</p>

            <div className="bg-slate-800/50 rounded-xl p-6 space-y-4">
              <div className="flex justify-between text-lg">
                <span className="text-slate-400">Starting Price</span>
                <span className="text-amber-400 font-bold text-xl">{formatPrice(item.startingPrice)}</span>
              </div>
              <div className="flex justify-between text-lg">
                <span className="text-slate-400">Registration Closes</span>
                <span className="font-medium text-red-400">
                  {registrationClosed ? 'Closed' : formatTimeLeft(item.registrationClosingDate)}
                </span>
              </div>
              <div className="flex justify-between text-lg">
                <span className="text-slate-400">Auction Starts</span>
                <span className="text-slate-300 font-medium">
                  {new Date(item.auctionStartDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between text-lg">
                <span className="text-slate-400">Interested Users</span>
                <span className="text-slate-300 font-medium">{item.subscribers?.length || 0}</span>
              </div>
            </div>

            <div className="space-y-3">
              {!registrationClosed && !registered && (
                <button className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 py-3 rounded-lg font-bold text-lg transition-colors">
                  Register for Auction
                </button>
              )}
              {registered && !registrationClosed && (
                <button className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-bold text-lg transition-colors">
                  Waiting for Auction
                </button>
              )}
              {registered && registrationClosed && (
                <button className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-bold text-lg transition-colors">
                  View Auction Room
                </button>
              )}
              {registrationClosed && !registered && (
                <button className="w-full bg-slate-600 hover:bg-slate-700 text-white py-3 rounded-lg font-bold text-lg transition-colors">
                  Spectate Auction
                </button>
              )}
              <button className="w-full border border-slate-600 hover:border-slate-500 text-slate-300 py-3 rounded-lg font-medium text-lg transition-colors">
                Add to Watchlist
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}