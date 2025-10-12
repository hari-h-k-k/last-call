import apiClient from '../lib/axios';

export const authService = {
  login: async (usernameOrEmail, password) => {
    const response = await apiClient.post('/user/login', {
      usernameOrEmail,
      password
    });
    return response.data;
  },

  register: async (username, email, password, confirmPassword) => {
    const response = await apiClient.post('/user/register', {
      username,
      email,
      password,
      confirmPassword
    });
    return response.data;
  },

  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};