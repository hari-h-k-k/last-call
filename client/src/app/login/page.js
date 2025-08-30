"use client";
import { useState, useEffect } from "react";
import AuthForm from "@/components/AuthForm";
import api from "../../lib/axios";
import { useSearchParams, useRouter } from "next/navigation";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/"; // Default to home if not provided

  const handleLogin = async ({ username, password }) => {
    setLoading(true);
    try {
      const response = await api.post("/auth/login", { username, password });
      alert(response.data.message);

      if (response.status === 200) {
        // Save session info
        const { username: user, token } = response.data.info;
        sessionStorage.setItem(
          "userInfo",
          JSON.stringify({ username: user, token })
        );

        // Redirect back to original page
        router.replace(redirectTo);
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

        <div className="mt-4 text-center">
          <p className="text-[#9CA3AF]">
            Don’t have an account?{" "}
            <span
              className="text-[#FACC15] font-semibold cursor-pointer hover:underline"
              onClick={() => router.push("/signup")}
            >
              Sign Up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
