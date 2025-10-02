import { useState, useEffect } from 'react';

export function useScrollNavbar() {
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

  return showNavbar;
}