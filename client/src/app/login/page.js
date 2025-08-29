"use client";
import AuthForm from "../../components/AuthForm";
import { useAuth } from "../../context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();

  const handleLogin = ({ username, password }) => {
    if (username === "test" && password === "123456") {
      login(username, "fake-jwt-token"); // Store in context
    } else {
      alert("Invalid credentials");
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

        {/* Extra Links */}
        <div className="mt-4 text-center">
          <p className="text-[#9CA3AF]">
            Don’t have an account?{" "}
            <span
              className="text-[#FACC15] font-semibold cursor-pointer hover:underline"
              onClick={() => window.location.href = "/signup"}
            >
              Sign Up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
