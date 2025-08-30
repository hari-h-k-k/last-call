"use client";
import { useState } from "react";
import AuthForm from "../../components/AuthForm";
import api from "@/lib/axios";
import {router} from "next/client";

export default function SignupPage() {
  const [formData, setFormData] = useState({ username: "", password: "", confirmPassword: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const { username, password, confirmPassword } = formData;
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await api.post("/auth/register", { username, password });
      if (response.status === 201) {
        alert(`Account created for ${username}`);
        // router.push("/login");
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#111827]">
      <div className="bg-[#1F2937] shadow-xl rounded-2xl p-8 w-96">
        <h1 className="text-3xl font-bold text-[#FFFFFF] text-center mb-6">
          Sign Up
        </h1>
        <p className="text-[#9CA3AF] text-center mb-6">
          Create your account to start bidding
        </p>

        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg bg-[#111827] border border-[#2563EB] text-[#FFFFFF] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg bg-[#111827] border border-[#2563EB] text-[#FFFFFF] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg bg-[#111827] border border-[#2563EB] text-[#FFFFFF] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
          />
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-[#2563EB] hover:bg-[#1d4ed8] text-[#FFFFFF] font-semibold transition duration-300"
          >
            Sign Up
          </button>
        </form>

        {/* Extra Links */}
        <div className="mt-4 text-center">
          <p className="text-[#9CA3AF]">
            Already have an account?{" "}
            <span
              className="text-[#FACC15] font-semibold cursor-pointer hover:underline"
              onClick={() => window.location.href = "/login"}
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
