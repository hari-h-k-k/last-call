import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const authService = {
  login: async (usernameOrEmail, password) => {
    const response = await axios.post(`${API_BASE_URL}/user/login`, {
      usernameOrEmail,
      password
    });
    return response.data;
  },

  register: async (username, email, password, confirmPassword) => {
    const response = await axios.post(`${API_BASE_URL}/user/register`, {
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