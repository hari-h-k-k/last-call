'use client';

import { useState } from 'react';
import StatsSection from './StatsSection';
import LastCallToRegisterHybrid from "@/components/home/LastCallToRegisterHybrid";
import CreateItemModal from '@/components/modals/CreateItemModal';
import {useAuth} from "@/hooks/useAuth";
import SignupModal from "@/components/modals/SignupModal";
import LoginModal from "@/components/modals/LoginModal";

export default function HomeContent() {
  const [showCreateModal, setShowCreateModal] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showSignupModal, setShowSignupModal] = useState(false);
    const { isAuthenticated } = useAuth();

  return (
    <main id="home-section" className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-amber-900/20 py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold text-amber-400 mb-6">
            Start Bidding Today
          </h2>
          <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-4xl mx-auto">
            Join thousands of users in exciting real-time auctions
          </p>
          
          <button 
            // onClick={() => setShowCreateModal(true)}
            onClick={() => {
                if (isAuthenticated) {
                    setShowCreateModal(true);
                } else {
                    setShowLoginModal(true);
                }
            }}
            className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-bold text-lg mb-8 transition-colors"
          >
            + Create Auction
          </button>
          
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
          <LastCallToRegisterHybrid />
          <StatsSection />
        </div>
      </div>
      
      <CreateItemModal 
        isOpen={showCreateModal} 
        onClose={() => setShowCreateModal(false)}
      />

        <LoginModal
            isOpen={showLoginModal}
            onClose={() => setShowLoginModal(false)}
            onSwitchToSignup={() => {
                setShowLoginModal(false);
                setShowSignupModal(true);
            }}
            onSuccess={() => {
                setShowCreateModal(true);
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

    </main>
  );
}