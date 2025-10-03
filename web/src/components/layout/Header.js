'use client';
import { useState } from 'react';
import Link from 'next/link';
import LoginModal from '../auth/LoginModal';
import SignupModal from '../auth/SignupModal';
import {useAuth} from "@/hooks/useAuth";

export default function Header() {
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

  return (
    <>
      <header className="bg-slate-900/95 backdrop-blur-sm shadow-xl border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-amber-500 hover:text-amber-400 transition-colors">
              Last Call
            </Link>
            
            <nav className="flex space-x-6">
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
            </nav>
          </div>
        </div>
      </header>

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