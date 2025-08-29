"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

export default function HomePage() {
  const { info, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!info.token) {
      router.push("/login");
    }
  }, [info, router]);

  if (!info.token) return null;

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <h1 className="text-3xl font-bold">Welcome, {info.username}! 🎉</h1>
      <p className="mt-4">You are authenticated ✅</p>
      <button
        onClick={logout}
        className="mt-6 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
      >
        Logout
      </button>
    </div>
  );
}
