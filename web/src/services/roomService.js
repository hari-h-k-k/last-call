import apiClient from '../lib/axios';

export const roomService = {
  getLiveAuctions: async () => {
    const response = await apiClient.get('/room/live-auctions');
    return response.data;
  },
  
  getAuctionOfTheDay: async () => {
    const response = await apiClient.get('/room/auction-of-the-day');
    return response.data;
  },

  getRoomByItemId: async (itemId) => {
    const response = await apiClient.get(`/room/item/${itemId}`);
    return response.data;
  },

  getRoomData: async (roomId) => {
    const response = await apiClient.get(`/room/${roomId}`);
    return response.data;
  },

  placeBid: async (roomId, bidAmount) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const response = await apiClient.post(`/room/${roomId}/bid?bidAmount=${bidAmount}&name=${user.name}`);
    return response.data;
  },

  getBidHistory: async (roomId) => {
    const response = await apiClient.get(`/room/${roomId}/bid-history`);
    return response.data;
  },

  getLeaderboard: async (roomId) => {
    const response = await apiClient.get(`/room/${roomId}/leaderboard`);
    return response.data;
  }
};