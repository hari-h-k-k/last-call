import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const userService = {
  async getUserProfile() {
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await axios.get(`${API_BASE_URL}/user/profile`, { headers });
    
    if (response.data.success) {
      localStorage.setItem('user', JSON.stringify(response.data.subject));
    }
    
    return response.data;
  },

  async updateProfile(profileData) {
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await axios.put(`${API_BASE_URL}/user/profile`, profileData, { headers });
      
      if (response.data.success) {
        localStorage.setItem('user', JSON.stringify(response.data.subject));
      }
      
      return response.data;
    } catch (error) {
      console.error('Update profile error:', error.response?.data || error.message);
      return error.response?.data || { success: false, message: 'Update failed' };
    }
  },

  updateUser(userData) {
    localStorage.setItem('user', JSON.stringify(userData));
  }
};