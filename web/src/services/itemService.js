import apiClient from '../lib/axios';

export const itemService = {
  // createItem: async (itemData) => {
  //   const token = localStorage.getItem('token');
  //   const response = await axios.post(`${API_BASE_URL}/item/create-item`, itemData, {
  //     headers: {
  //       'Authorization': `Bearer ${token}`,
  //       'Content-Type': 'application/json'
  //     }
  //   });
  //   return response.data;
  // },

  createItem: async (itemData) => {
    const response = await apiClient.post('/item/create-item', itemData);
    return response.data;
  },

  searchItems: async (query) => {
    const response = await apiClient.get(`/item/search-items/${encodeURIComponent(query)}`);
    return response.data;
  },

  getMyItems: async (query) => {
      const response = await apiClient.get(`/item/my-items`);
      return response.data;
    },

  getCategories: async () => {
    const response = await apiClient.get('/item/categories');
    return response.data;
  },

  getLastCallToRegister: async () => {
    const response = await apiClient.get('/item/last-call-to-register');
    return response.data;
  },

  getItemById: async (id) => {
    const response = await apiClient.get(`/item/${id}`);
    return response.data;
  },


  subscribeToItem: async (itemId) => {
    const response = await apiClient.put(`/item/item-subscribe?itemId=${itemId}`);
    return response.data;
  },

  unsubscribeFromItem: async (itemId) => {
    const response = await apiClient.put(`/item/item-unsubscribe?itemId=${itemId}`);
    return response.data;
  },

  registerForAuction: async (itemId) => {
    const response = await apiClient.post(`/item/${itemId}/register`);
    return response.data;
  },

  unregisterFromAuction: async (itemId) => {
    const response = await apiClient.delete(`/item/${itemId}/unregister`);
    return response.data;
  },

  // exitAuction: async (itemId) => {
  //   const token = localStorage.getItem('token');
  //   const response = await axios.post(`${API_BASE_URL}/item/${itemId}/exit`, {}, {
  //     headers: {
  //       'Authorization': `Bearer ${token}`,
  //       'Content-Type': 'application/json'
  //     }
  //   });
  //   return response.data;
  // },

  addToWatchlist: async (itemId) => {
    const response = await apiClient.put(`/item/item-subscribe?itemId=${itemId}`);
    return response.data;
  },

  exitAuction: async (itemId) => {
    const response = await apiClient.delete(`/item/${itemId}/unregister`);
    return response.data;
  },

  updateItem: async (itemId, itemData) => {
    const response = await apiClient.put(`/item/update-item/${itemId}`, itemData);
    return response.data;
  }
};