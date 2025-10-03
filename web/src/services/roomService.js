import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const roomService = {
  getLiveAuctions: async () => {
    const response = await axios.get(`${API_BASE_URL}/room/live-auctions`);
    return response.data;
  },
  
  getAuctionOfTheDay: async () => {
    const response = await axios.get(`${API_BASE_URL}/room/auction-of-the-day`);
    return response.data;
  }
};