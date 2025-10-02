import { api } from '@/lib/api';

export const authService = {
  async login(usernameOrEmail, password) {
    const response = await api.post('/user/login', {
      usernameOrEmail,
      password
    });
    
    if (response.data.success && response.data.data.token) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify({
        id: response.data.data.userId,
        username: response.data.data.username
      }));
    }
    
    return response.data;
  },

  async register(username, email, password, confirmPassword) {
    const response = await api.post('/user/register', {
      username,
      email,
      password,
      confirmPassword
    });
    
    return response.data;
  },

  async verify() {
    const response = await api.post('/user/verify');
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated() {
    return !!localStorage.getItem('token');
  }
};