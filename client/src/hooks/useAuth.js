import { useState } from "react";
import authService from "@/services/authService";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      return await authService.login({ username, password });
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (username, email, password, confirmPassword) => {
    setLoading(true);
    setError(null);
    try {
      return await authService.signup({ username, email, password, confirmPassword });
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    login,
    signup,
    loading,
    error
  };
};