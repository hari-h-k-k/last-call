"use client";

import {useState, useEffect} from 'react';
import {authService} from '@/services/authService';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const updateAuthState = () => {
    const userData = authService.getUser();
    const authenticated = authService.isAuthenticated();
    setUser(userData);
    setIsAuthenticated(authenticated);
  };

  useEffect(() => {
    updateAuthState();

    const handleStorageChange = () => {
      updateAuthState();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('auth-change', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth-change', handleStorageChange);
    };
  }, []);

  return {user, isAuthenticated};
}