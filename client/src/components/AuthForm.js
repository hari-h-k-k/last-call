"use client";
import { useState } from "react";

export default function AuthForm({ type, onSubmit, loading }) {
  const [formData, setFormData] = useState({ 
    username: "", 
    email: "", 
    password: "", 
    confirmPassword: "" 
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (type === "signup" && formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    onSubmit(formData);
  };

  const inputClass = "w-full p-3 rounded-lg bg-gray-900 border border-blue-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        name="username"
        placeholder={type === "login" ? "Username or Email" : "Username"}
        value={formData.username}
        onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
        required
        className={inputClass}
      />
      {type === "signup" && (
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
          required
          className={inputClass}
        />
      )}
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
          required
          className={inputClass}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-3 text-gray-400 hover:text-gray-200 text-sm"
        >
          {showPassword ? "Hide" : "Show"}
        </button>
      </div>
      {type === "signup" && (
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
          required
          className={inputClass}
        />
      )}
      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3 rounded-lg text-white font-semibold transition duration-300 ${
          loading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? `${type === "login" ? "Logging in" : "Signing up"}...` : type === "login" ? "Login" : "Sign Up"}
      </button>
    </form>
  );
}
