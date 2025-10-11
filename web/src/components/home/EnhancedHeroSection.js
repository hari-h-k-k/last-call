'use client';
import { useState, useEffect } from 'react';

export default function EnhancedHeroSection() {
  const [stats, setStats] = useState({
    activeAuctions: 0,
    usersOnline: 0,
    totalBids: 0
  });
  const [particles, setParticles] = useState([]);

  // Generate particles
  useEffect(() => {
    const newParticles = [...Array(50)].map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 2
    }));
    setParticles(newParticles);
  }, []);

  // Animate counters
  useEffect(() => {
    const animateCounter = (target, key) => {
      let current = 0;
      const increment = target / 50;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        setStats(prev => ({ ...prev, [key]: Math.floor(current) }));
      }, 30);
    };

    // Simulate real-time stats
    animateCounter(47, 'activeAuctions');
    animateCounter(1247, 'usersOnline');
    animateCounter(8934, 'totalBids');
  }, []);

  // Trigger navbar visibility when reaching Start Bidding section
  useEffect(() => {
    const handleScroll = () => {
      const startBiddingSection = document.getElementById('start-bidding-section');
      if (startBiddingSection) {
        const rect = startBiddingSection.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.8) {
          // Dispatch custom event to show navbar
          window.dispatchEvent(new CustomEvent('showNavbar'));
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-amber-900/20">
        <div className="absolute inset-0">
          {particles.map((particle) => (
            <div
              key={particle.id}
              className="absolute bg-amber-400 rounded-full opacity-60 animate-float"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                animationDuration: `${particle.duration}s`,
                animationDelay: `${particle.delay}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-6xl mx-auto px-4">
        <h1 className="text-6xl md:text-8xl font-bold text-white mb-8 animate-fade-in">
          <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
            Last Call
          </span>
        </h1>
        
        <p className="text-2xl md:text-3xl text-slate-300 mb-12 animate-slide-up">
          The Ultimate Auction Experience
        </p>
        
        <div id="start-bidding-section" className="mb-12">
          <h2 className="text-5xl md:text-6xl font-bold text-amber-400 mb-6">
            Start Bidding Today
          </h2>
        </div>

        {/* Dynamic Stats */}
        <div className="grid grid-cols-3 gap-8 mb-12 animate-slide-up">
          <div className="text-center">
            <div className="text-4xl font-bold text-amber-400 mb-2">{stats.activeAuctions}</div>
            <div className="text-slate-400">Live Auctions</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-400 mb-2">{stats.usersOnline.toLocaleString()}</div>
            <div className="text-slate-400">Users Online</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-400 mb-2">{stats.totalBids.toLocaleString()}</div>
            <div className="text-slate-400">Total Bids Today</div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center animate-slide-up">
          <button
            onClick={() => window.location.href = '/auctions'}
            className="group relative px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-xl rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/25"
          >
            <span className="relative z-10">Start Bidding</span>
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
          
          <button
            onClick={() => window.location.href = '/browse'}
            className="group relative px-8 py-4 border-2 border-amber-500 text-amber-500 font-bold text-xl rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:bg-amber-500 hover:text-slate-900"
          >
            <span className="relative z-10">Browse Items</span>
            <div className="absolute inset-0 bg-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-amber-400 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-amber-400 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.6; }
          50% { transform: translateY(-20px) rotate(180deg); opacity: 1; }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-float {
          animation: float infinite ease-in-out;
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        .animate-slide-up {
          animation: slide-up 1s ease-out 0.3s both;
        }
      `}</style>
    </div>
  );
}