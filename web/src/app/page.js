"use client";

import { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import EnhancedHeroSection from '@/components/home/EnhancedHeroSection';
import HomeContent from '@/components/home/HomeContent';
import { useScrollNavbar } from '@/hooks/useScrollNavbar';

export default function HomePage() {
  const [showNavbar, setShowNavbar] = useState(false);

  useEffect(() => {
    const handleShowNavbar = () => setShowNavbar(true);
    window.addEventListener('showNavbar', handleShowNavbar);
    return () => window.removeEventListener('showNavbar', handleShowNavbar);
  }, []);

  return (
    <>
      <EnhancedHeroSection />
      <Navbar show={showNavbar} />
      <HomeContent />
    </>
  );
}