import apiClient from '../lib/axios';

export const roomService = {
  getLiveAuctions: async () => {
    const response = await apiClient.get('/room/live-auctions');
    return response.data;
  },
  
  getAuctionOfTheDay: async () => {
    const response = await apiClient.get('/room/auction-of-the-day');
    return response.data;
  }
};