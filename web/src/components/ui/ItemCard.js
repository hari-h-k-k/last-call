import { useState, useEffect } from 'react';
import { THUMBNAIL_ARRAY } from '../../constants/images';
import { useAuth } from '../../hooks/useAuth';
import LoginModal from '../modals/LoginModal';
import SignupModal from '../modals/SignupModal';

export default function ItemCard({ item, registered }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const { isAuthenticated } = useAuth();
  
  const formatPrice = (price) => `$${price.toFixed(2)}`;
  const formatTimeLeft = (registrationClosingDate) => {
    const closingDate = new Date(registrationClosingDate);
    const timeDiff = closingDate - currentTime;
    
    if (timeDiff <= 0) return 'Closed';
    
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };
  
  useEffect(() => {
    const timeUpdateInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60 * 1000);
    return () => clearInterval(timeUpdateInterval);
  }, []);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(prev => (prev + 1) % THUMBNAIL_ARRAY.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className={`relative backdrop-blur-sm rounded-xl p-6 transition-all duration-300 overflow-visible ${
        registered 
          ? 'bg-gradient-to-br from-green-900/20 via-slate-800/50 to-blue-900/20 border border-green-500/50 hover:shadow-lg hover:shadow-green-500/25'
          : 'bg-slate-800/50 border border-slate-700/50 hover:shadow-lg hover:shadow-amber-500/25'
      }`}>
        {/* Status Bar */}
        {registered && (
          <div className="absolute top-0 left-0 right-0 h-1 rounded-t-xl"></div>
        )}
        
        {/* Ribbon Badge */}
        {registered && (
          <div className="absolute -top-1 -right-1 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg transform rotate-12 z-10">
            ✓ REGISTERED
          </div>
        )}
        
        <div className="mb-4">
          <div className="relative group">
            <img 
              src={THUMBNAIL_ARRAY[currentImageIndex]} 
              alt={item.title}
              className="w-full h-48 object-cover rounded-lg mb-3 transition-opacity duration-300"
            />
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {THUMBNAIL_ARRAY.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="flex justify-between items-start">
            <h3 className={`text-xl font-semibold truncate ${
              registered ? 'text-green-100' : 'text-white'
            }`}>
              {item.title}
            </h3>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              registered 
                ? 'bg-green-500/20 text-green-400'
                : 'bg-amber-500/20 text-amber-400'
            }`}>
              {item.category}
            </span>
          </div>
        </div>
        
        <p className={`text-sm mb-4 line-clamp-2 h-10 ${
          registered ? 'text-green-200' : 'text-slate-300'
        }`}>
          {item.description.length > 80 ? `${item.description.substring(0, 80)}...` : item.description}
        </p>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className={registered ? 'text-green-300' : 'text-slate-400'}>
              Starting Price
            </span>
            <span className={`font-semibold ${
              registered ? 'text-green-400' : 'text-amber-400'
            }`}>
              {formatPrice(item.startingPrice)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className={registered ? 'text-green-300' : 'text-slate-400'}>
              Registration Closes
            </span>
            <span className={`font-medium ${
              registered ? 'text-green-200' : 'text-red-400'
            }`}>
              {formatTimeLeft(item.registrationClosingDate)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className={registered ? 'text-green-300' : 'text-slate-400'}>
              Interested Users
            </span>
            <span className={`font-medium ${
              registered ? 'text-green-400' : 'text-slate-300'
            }`}>
              {item.subscribers?.length || 0}
            </span>
          </div>
        </div>
        
        <button 
          onClick={() => {
            if (isAuthenticated) {
              window.location.href = `/item/${item.id}`;
            } else {
              setShowLoginModal(true);
            }
          }}
          className={`w-full mt-4 py-2 rounded-lg font-medium transition-all duration-300 group relative overflow-hidden ${
          registered 
            ? 'bg-green-500 hover:bg-green-600 text-white'
            : 'bg-amber-500 hover:bg-amber-600 text-slate-900'
        }`}>
          <span className={`transition-opacity duration-200 ${registered ? 'group-hover:opacity-0' : ''}`}>
            {registered ? 'Registered' : 'View Details'}
          </span>
          {registered && (
            <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              View Details
            </span>
          )}
        </button>
      </div>
      
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)}
        onSwitchToSignup={() => {
          setShowLoginModal(false);
          setShowSignupModal(true);
        }}
        onSuccess={() => {
          window.location.href = `/item/${item.id}`;
        }}
      />
      
      <SignupModal 
        isOpen={showSignupModal} 
        onClose={() => setShowSignupModal(false)}
        onSwitchToLogin={() => {
          setShowSignupModal(false);
          setShowLoginModal(true);
        }}
      />
    </>
  );
}