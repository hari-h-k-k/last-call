"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import AuthForm from "@/components/AuthForm";

export default function SignupPage() {
  const router = useRouter();
  const { signup, loading, error } = useAuth();

  const handleSignup = async ({ username, email, password, confirmPassword }) => {
    try {
      const response = await signup(username, email, password, confirmPassword);
      console.log(response)
      if (response.success) {
        alert(response.message);
        router.replace("/login");
      } else {
        alert(response.message);
      }
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

        <AuthForm type="signup" onSubmit={handleSignup} loading={loading} />

        {error && <p className="text-red-400 text-center mt-2">{error}</p>}

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