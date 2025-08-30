"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
export default function ProPage() {

  const { info } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!info.token) {
      router.push("/login");
    }
  }, [info, router]);

  if (!info.token) return null;


  return (
    <div className="min-h-screen bg-[#111827] text-white flex items-center justify-center">
      <h1 className="text-4xl font-bold">Pro Page - Coming Soon!</h1>
    </div>
  );
}