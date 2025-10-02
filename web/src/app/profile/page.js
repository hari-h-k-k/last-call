"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', username: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const loadUserProfile = async () => {
      const userData = authService.getUser();
      if (!userData) {
        router.push('/login');
        return;
      }
      
      try {
        // Fetch complete user profile from API
        const response = await authService.getUserProfile();
        if (response.success) {
          const fullUserData = response.data;
          setUser(fullUserData);
          setFormData({ 
            name: fullUserData.name || '', 
            username: fullUserData.username || '', 
            email: fullUserData.email || '' 
          });
        } else {
          // Fallback to localStorage data
          setUser(userData);
          setFormData({ 
            name: userData.name || '', 
            username: userData.username || '', 
            email: userData.email || '' 
          });
        }
      } catch (err) {
        // Fallback to localStorage data on error
        setUser(userData);
        setFormData({ 
          name: userData.name || '', 
          username: userData.username || '', 
          email: userData.email || '' 
        });
      }
    };
    
    loadUserProfile();
  }, [router]);

  const handleLogout = () => {
    authService.logout();
    router.push('/');
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setProfileImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await authService.updateProfile(formData);
      
      if (response.success) {
        setUser(response.data);
        setSuccess('Profile updated successfully!');
        setIsEditing(false);
      } else {
        setError(response.message || 'Update failed');
      }
    } catch (err) {
      // Fallback to localStorage update if API fails
      const updatedUser = { ...user, ...formData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setSuccess('Profile updated locally!');
      setIsEditing(false);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-800 py-16">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-slate-700 rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden">
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl text-amber-600">👤</span>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
            <h1 className="text-3xl font-bold text-amber-400">{user.name || "User"}</h1>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Full Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-600 border border-slate-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Enter your full name"
                />
              ) : (
                <p className="text-slate-300">{user.name || 'Not provided'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Username
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-600 border border-slate-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              ) : (
                <p className="text-slate-300">{user.username}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Email
              </label>
              {isEditing ? (
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-600 border border-slate-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              ) : (
                <p className="text-slate-300">{user.email || 'Not provided'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Member Since
              </label>
              <p className="text-slate-300">
                {user.dateCreated ? new Date(user.dateCreated).toLocaleDateString() : 'Unknown'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Account Status
              </label>
              <p className="text-slate-300">
                {user.isVerified ? '✅ Verified' : '⏳ Pending Verification'}
              </p>
            </div>

            <div className="flex space-x-4 pt-6">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="bg-amber-500 hover:bg-amber-600 text-slate-900 px-6 py-2 rounded-lg font-medium transition-all disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="bg-slate-600 hover:bg-slate-700 text-white px-6 py-2 rounded-lg font-medium transition-all"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-900 px-6 py-2 rounded-lg font-medium transition-all"
                >
                  Edit Profile
                </button>
              )}
              
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium transition-all"
              >
                Logout
              </button>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}
            
            {success && (
              <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                {success}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}