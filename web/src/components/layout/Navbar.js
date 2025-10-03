'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import LoginModal from '../auth/LoginModal';
import SignupModal from '../auth/SignupModal';

export default function Navbar({ show = true, variant = 'slide' }) {
  const { user, isAuthenticated } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  const handleSwitchToSignup = () => {
    setShowLogin(false);
    setShowSignup(true);
  };

  const handleSwitchToLogin = () => {
    setShowSignup(false);
    setShowLogin(true);
  };

  const getNavClasses = () => {
    const baseClasses = "fixed top-0 left-0 right-0 shadow-lg border-b border-amber-500/30 z-50";
    
    if (variant === 'header') {
      return `${baseClasses} bg-slate-900/95 backdrop-blur-sm shadow-xl border-slate-700/50`;
    }
    
    return `${baseClasses} bg-slate-900 transition-transform duration-300 ${
      show ? 'translate-y-0' : '-translate-y-full'
    }`;
  };

  return (
    <>
      <nav className={getNavClasses()}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className={`font-bold hover:text-amber-400 transition-colors ${
              variant === 'header' ? 'text-2xl text-amber-500' : 'text-xl text-amber-400'
            }`}>
              Last Call
            </Link>

            <div className="flex items-center space-x-6">
              <Link href="/auctions" className="text-slate-300 hover:text-amber-400 font-medium">
                Auctions
              </Link>

              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <Link href="/profile" className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-medium">
                    {user?.name ? user.name.split(' ')[0] : 'Profile'}
                  </Link>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => setShowLogin(true)}
                    className="text-slate-300 hover:text-amber-400 font-medium"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => setShowSignup(true)}
                    className="bg-amber-500 hover:bg-amber-600 text-slate-900 px-4 py-2 rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onSwitchToSignup={handleSwitchToSignup}
      />
      <SignupModal
        isOpen={showSignup}
        onClose={() => setShowSignup(false)}
        onSwitchToLogin={handleSwitchToLogin}
      />
    </>
  );
}