'use client';
import { useState } from 'react';
import Modal from '../ui/Modal';
import { authService } from '../../services/itemService';

export default function SignupModal({ isOpen, onClose, onSwitchToLogin }) {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await authService.register(
        formData.username,
        formData.email,
        formData.password,
        formData.confirmPassword
      );
      if (response.success) {
        onSwitchToLogin();
        setFormData({ username: '', email: '', password: '', confirmPassword: '' });
      } else {
        setError(response.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Register error:', error);
      setError(error.response?.data?.message || error.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Create Account</h2>
        <p className="text-slate-400">Join the auction community</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-2 rounded-lg text-sm">
            {error}
          </div>
        )}
        <div>
          <input
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={(e) => setFormData({...formData, username: e.target.value})}
            className="w-full bg-slate-800 text-white px-4 py-3 rounded-lg border border-slate-700 focus:border-amber-500 focus:outline-none"
            required
          />
        </div>
        <div>
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full bg-slate-800 text-white px-4 py-3 rounded-lg border border-slate-700 focus:border-amber-500 focus:outline-none"
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            className="w-full bg-slate-800 text-white px-4 py-3 rounded-lg border border-slate-700 focus:border-amber-500 focus:outline-none"
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
            className="w-full bg-slate-800 text-white px-4 py-3 rounded-lg border border-slate-700 focus:border-amber-500 focus:outline-none"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-amber-500/50 text-slate-900 py-3 rounded-lg font-semibold transition-colors"
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>

      <div className="text-center mt-6">
        <p className="text-slate-400">
          Already have an account?{' '}
          <button
            onClick={onSwitchToLogin}
            className="text-amber-500 hover:text-amber-400 font-medium"
          >
            Sign in
          </button>
        </p>
      </div>
    </Modal>
  );
}