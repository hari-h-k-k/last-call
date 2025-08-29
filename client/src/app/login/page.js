"use client";
import { useState } from "react";
import AuthForm from "../../components/AuthForm";
import { useAuth } from "../../context/AuthContext";
import api from "../../lib/axios"; // Axios instance

export default function LoginPage() {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogin = async ({ username, password }) => {
    setLoading(true);
    try {
      // Call backend login API
      const response = await api.post("/login", { username, password });

      if (response.data === "Login successful!") {
        // For demo, we generate a fake token
        login(username, "fake-jwt-token");
      } else {
        alert(response.data);
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#111827]">
      <div className="bg-[#1F2937] shadow-xl rounded-2xl p-8 w-96">
        <h1 className="text-3xl font-bold text-[#FFFFFF] text-center mb-6">
          Login
        </h1>
        <p className="text-[#9CA3AF] text-center mb-6">
          Enter your credentials to access your account
        </p>

        <AuthForm type="login" onSubmit={handleLogin} />

        {loading && <p className="text-[#22C55E] text-center mt-4">Logging in...</p>}

        {/* Extra Links */}
        <div className="mt-4 text-center">
          <p className="text-[#9CA3AF]">
            Don’t have an account?{" "}
            <span
              className="text-[#FACC15] font-semibold cursor-pointer hover:underline"
              onClick={() => window.location.href = "/signup"}
            >
              Sign Up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
