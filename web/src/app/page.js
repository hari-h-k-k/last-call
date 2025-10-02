"use client";

import Navbar from '@/components/layout/Navbar';
import WelcomeSection from '@/components/home/WelcomeSection';
import HomeContent from '@/components/home/HomeContent';
import { useScrollNavbar } from '@/hooks/useScrollNavbar';

export default function HomePage() {
  const showNavbar = useScrollNavbar();

  const scrollToHome = () => {
    document.getElementById('home-section').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <WelcomeSection onGetStarted={scrollToHome} />
      <Navbar show={showNavbar} />
      <HomeContent />
    </>
  );
}