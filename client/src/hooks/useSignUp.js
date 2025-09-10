import { useState } from "react";
import authService from "@/services/authService";

export const useSignup = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const signup = async (username, password) => {
    setLoading(true);
    setError(null);

    try {
      const data = await authService.signup({ username, password });
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { signup, loading, error };
};