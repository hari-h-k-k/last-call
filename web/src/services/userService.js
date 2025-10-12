import apiClient from '../lib/axios';

export const userService = {
  async getUserProfile() {
    const response = await apiClient.get('/user/profile');
    
    if (response.data.success) {
      localStorage.setItem('user', JSON.stringify(response.data.subject));
    }
    
    return response.data;
  },

  async updateProfile(profileData) {
    try {
      const response = await apiClient.put('/user/profile', profileData);
      
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