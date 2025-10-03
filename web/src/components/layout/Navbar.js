'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import LoginModal from '../auth/LoginModal';
import SignupModal from '../auth/SignupModal';

export default function Navbar({ show }) {
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
      <nav className={`fixed top-0 left-0 right-0 bg-slate-900 shadow-lg border-b border-amber-500/30 z-50 transition-transform duration-300 ${
        show ? 'translate-y-0' : '-translate-y-full'
      }`}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-xl font-bold text-amber-400">
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