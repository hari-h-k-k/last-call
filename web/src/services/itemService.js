import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const itemService = {
  createItem: async (itemData) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_BASE_URL}/item/create-item`, itemData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  },

  searchItems: async (query) => {
    const token = localStorage.getItem('token');
    const headers = token ? {Authorization: `Bearer ${token}`} : {};
    const response = await axios.get(
      `${API_BASE_URL}/item/search-items/${encodeURIComponent(query)}`, {headers}
    );
    return response.data;
  },

  getCategories: async () => {
    const response = await axios.get(`${API_BASE_URL}/item/categories`);
    return response.data;
  },

  getLastCallToRegister: async () => {
    const token = localStorage.getItem('token');
    const headers = token ? {Authorization: `Bearer ${token}`} : {};
    const response = await axios.get(`${API_BASE_URL}/item/last-call-to-register`, {headers});
    console.log(response)
    return response.data;
  },

  getItemById: async (id) => {
    const token = localStorage.getItem('token');
    const headers = token ? {Authorization: `Bearer ${token}`} : {};
    const response = await axios.get(`${API_BASE_URL}/item/${id}`, {headers});
    return response.data;
  }
};