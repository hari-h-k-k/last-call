import apiClient from '../lib/axios';

export const itemService = {

  createItem: async (itemData) => {
    const response = await apiClient.post('/item/create-item', itemData);
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

  registerForAuction: async (itemId) => {
    const response = await apiClient.post(`/item/${itemId}/register`);
    return response.data;
  },

  unregisterFromAuction: async (itemId) => {
    const response = await apiClient.delete(`/item/${itemId}/unregister`);
    return response.data;
  },

  searchItemsWithFilters: async (searchRequest) => {
    const response = await apiClient.post('/item/search-with-filters', searchRequest);
    return response.data;
  },

  getItemsWithFilters: async (filters) => {
    return itemService.searchItemsWithFilters(filters);
  },

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
  },

  deleteItem: async (itemId) => {
    const response = await apiClient.delete(`/item/delete-item/${itemId}`);
    return response.data;
  }
};