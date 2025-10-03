"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';
import Navbar from '@/components/layout/Navbar';

export default function LoginPage() {
  const [formData, setFormData] = useState({ usernameOrEmail: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await authService.login(formData.usernameOrEmail, formData.password);
      console.log(response)
      if (response.success) {
        router.push('/');
      } else {
        setError(response.message || 'Login failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar show={true} />
      <div className="min-h-screen flex items-center justify-center bg-slate-800">
      <div className="max-w-md w-full bg-slate-700 rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-amber-400">Welcome Back</h1>
          <p className="text-slate-300 mt-2">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Username or Email
            </label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 bg-slate-600 border border-slate-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              value={formData.usernameOrEmail}
              onChange={(e) => setFormData({...formData, usernameOrEmail: e.target.value})}
              placeholder="Enter username or email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              className="w-full px-3 py-2 bg-slate-600 border border-slate-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 py-2 px-4 rounded-lg font-semibold transition-all disabled:opacity-50 shadow-md hover:shadow-lg"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="mt-6 text-center">
          <p className="text-slate-300">
            Don't have an account?{' '}
            <Link href="/signup" className="text-amber-400 hover:text-amber-300 hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
    </>
  );
}