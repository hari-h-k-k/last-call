"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const [showNavbar, setShowNavbar] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const welcomeSection = document.querySelector('section');
      if (welcomeSection) {
        const rect = welcomeSection.getBoundingClientRect();
        setShowNavbar(rect.bottom <= window.innerHeight * 0.8);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToHome = () => {
    document.getElementById('home-section').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* Welcome Section */}
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            Welcome to Last Call
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Your premier bidding platform
          </p>
          <button 
            onClick={scrollToHome}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors"
          >
            Get Started
          </button>
        </div>
      </section>

      {/* Navigation Bar */}
      <nav className={`fixed top-0 left-0 right-0 bg-white shadow-md z-50 transition-transform duration-300 ${
        showNavbar ? 'translate-y-0' : '-translate-y-full'
      }`}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-xl font-bold text-gray-900">
              Last Call
            </Link>
            
            <div className="flex space-x-6">
              <Link href="/auctions" className="text-gray-600 hover:text-gray-900">
                Auctions
              </Link>
              <Link href="/login" className="text-gray-600 hover:text-gray-900">
                Login
              </Link>
              <Link href="/signup" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Home Page Content */}
      <main id="home-section" className="min-h-screen bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Start Bidding Today
            </h2>
            <p className="text-lg text-gray-600">
              Join thousands of users in exciting real-time auctions
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏆</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Win Amazing Items</h3>
              <p className="text-gray-600">Bid on exclusive items and win at great prices</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-time Bidding</h3>
              <p className="text-gray-600">Experience live auctions with instant updates</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Platform</h3>
              <p className="text-gray-600">Safe and secure transactions guaranteed</p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}