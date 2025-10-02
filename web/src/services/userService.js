import { api } from '@/lib/api';

export const userService = {
  async getUserProfile() {
    const response = await api.get('/user/profile');
    console.log('getUserProfile response:', response.data);
    
    if (response.data.success) {
      localStorage.setItem('user', JSON.stringify(response.data.subject));
    }
    
    return response.data;
  },

  async updateProfile(profileData) {
    try {
      console.log('Sending profile data:', profileData);
      const response = await api.put('/user/profile', profileData);
      console.log('updateProfile response:', response.data);
      
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