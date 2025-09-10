"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSignup } from "@/hooks/useSignUp";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: ""
  });
  const router = useRouter();
  const { signup, loading, error } = useSignup();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      await signup(username, password);
      alert(`Account created for ${username}`);
      router.replace("/login");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 shadow-xl rounded-2xl p-8 w-96">
        <h1 className="text-3xl font-bold text-white text-center mb-6">Sign Up</h1>
        <p className="text-gray-400 text-center mb-6">
          Create your account to start bidding
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {["username", "password", "confirmPassword"].map((field) => (
            <input
              key={field}
              type={field.includes("password") ? "password" : "text"}
              name={field}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={formData[field]}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg bg-gray-900 border border-blue-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          ))}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-semibold transition duration-300 ${
              loading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>

          {error && <p className="text-red-400 text-center">{error}</p>}
        </form>

        <div className="mt-4 text-center">
          <p className="text-gray-400">
            Already have an account?{" "}
            <span
              className="text-yellow-400 font-semibold cursor-pointer hover:underline"
              onClick={() => router.push("/login")}
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
