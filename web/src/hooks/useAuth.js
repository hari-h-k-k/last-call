"use client";

import { useState, useEffect } from 'react';
import { authService } from '@/services/authService';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const userData = authService.getUser();
    const authenticated = authService.isAuthenticated();
    
    setUser(userData);
    setIsAuthenticated(authenticated);
  }, []);

  return { user, isAuthenticated };
}