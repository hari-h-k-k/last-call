import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const itemService = {
  searchItems: async (query) => {
    const response = await axios.get(
      `${API_BASE_URL}/item/search-items/${encodeURIComponent(query)}`
    );
    return response.data;
  },
  
  getCategories: async () => {
    const response = await axios.get(`${API_BASE_URL}/item/categories`);
    return response.data;
  }
};