"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useLogin } from "@/hooks/useLogin";
import AuthForm from "@/components/AuthForm";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";
  const { login: authLogin } = useAuth();
  const { login, loading, error } = useLogin();

  const handleLogin = async ({ username, password }) => {
    try {
      const data = await login(username, password); // call service through hook
      alert(data.message);

      authLogin(data.info.id, data.info.username, data.info.token); // save session
      router.replace(redirectTo); // redirect
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

        <AuthForm type="login" onSubmit={handleLogin} />

        {loading && <p className="text-green-500 text-center mt-4">Logging in...</p>}
        {error && <p className="text-red-400 text-center mt-2">{error}</p>}

        <div className="mt-4 text-center">
          <p className="text-gray-400">
            Don’t have an account?{" "}
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
