"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth as useAuthContext } from "@/context/AuthContext";
import { useAuth } from "@/hooks/useAuth";
import AuthForm from "@/components/AuthForm";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";
  const { login: authLogin } = useAuthContext();
  const { login, loading, error } = useAuth();

  const handleLogin = async ({ username, password }) => {
    try {
      const response = await login(username, password);
      if (response.success) {
        alert(response.message);
        authLogin(response.data.userId, response.data.username, response.data.token);
        router.replace(redirectTo);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 shadow-xl rounded-2xl p-8 w-96">
        <h1 className="text-3xl font-bold text-white text-center mb-6">Login</h1>
        <p className="text-gray-400 text-center mb-6">
          Enter your credentials to access your account
        </p>

        <AuthForm type="login" onSubmit={handleLogin} loading={loading} />

        {error && <p className="text-red-400 text-center mt-2">{error}</p>}

        <div className="mt-4 text-center">
          <p className="text-gray-400">
            Don't have an account?{" "}
            <span
              className="text-yellow-400 font-semibold cursor-pointer hover:underline"
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

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-white text-center">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}