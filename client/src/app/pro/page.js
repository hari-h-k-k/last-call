"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
export default function ProPage() {

  const router = useRouter();

  const { info } = useAuth();

  useEffect(() => {
    if (!JSON.parse(sessionStorage.getItem("userInfo")).token) {
      router.push("/login");
    }
  });

  return (
    <div className="min-h-screen bg-[#111827] text-white flex items-center justify-center">
      <h1 className="text-4xl font-bold">Pro Page - Coming Soon!</h1>
    </div>
  );
}