'use client';
import { useState } from 'react';
import Modal from '../ui/Modal';
import { authService } from '../../services/authService';

export default function LoginModal({ isOpen, onClose, onSwitchToSignup }) {
  const [formData, setFormData] = useState({ usernameOrEmail: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await authService.login(formData.usernameOrEmail, formData.password);
      if (response.success && response.subject.token) {
        localStorage.setItem('token', response.subject.token);
        localStorage.setItem('user', JSON.stringify({
          name: response.subject.name,
          username: response.subject.username,
          userId: response.subject.userId
        }));
        onClose();
        window.location.reload();
      } else {
        setError(response.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data?.message || error.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
        <p className="text-slate-400">Sign in to your account</p>
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
            placeholder="Username or Email"
            value={formData.usernameOrEmail}
            onChange={(e) => setFormData({...formData, usernameOrEmail: e.target.value})}
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
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-amber-500/50 text-slate-900 py-3 rounded-lg font-semibold transition-colors"
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>

      <div className="text-center mt-6">
        <p className="text-slate-400">
          Don't have an account?{' '}
          <button
            onClick={onSwitchToSignup}
            className="text-amber-500 hover:text-amber-400 font-medium"
          >
            Sign up
          </button>
        </p>
      </div>
    </Modal>
  );
}