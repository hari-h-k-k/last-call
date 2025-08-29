"use client";
import { useState } from "react";

export default function AuthForm({ type, onSubmit }) {
  const [formData, setFormData] = useState({ username: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        name="username"
        placeholder="Username"
        onChange={handleChange}
        required
        className="w-full p-3 rounded-lg bg-[#111827] border border-[#2563EB] text-[#FFFFFF] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        onChange={handleChange}
        required
        className="w-full p-3 rounded-lg bg-[#111827] border border-[#2563EB] text-[#FFFFFF] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
      />
      <button
        type="submit"
        className="w-full py-3 rounded-lg bg-[#2563EB] hover:bg-[#1d4ed8] text-[#FFFFFF] font-semibold transition duration-300"
      >
        Login
      </button>
    </form>
  );
}
