import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const itemService = {
  searchItems: async (query) => {
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await axios.get(
      `${API_BASE_URL}/item/search-items/${encodeURIComponent(query)}`, { headers }
    );
    return response.data;
  },
  
  getCategories: async () => {
    const response = await axios.get(`${API_BASE_URL}/item/categories`);
    return response.data;
  },
  
  // getTodaysAuctions: async () => {
  //   const response = await axios.get(`${API_BASE_URL}/item/get-upcoming-items`);
  //   return response.data;
  // },
  //
  // getUpcomingItems: async () => {
  //   const response = await axios.get(`${API_BASE_URL}/item/get-upcoming-items`);
  //   return response.data;
  // },
  
  getLastCallToRegister: async () => {
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await axios.get(`${API_BASE_URL}/item/last-call-to-register`, { headers });
    console.log(response)
    return response.data;
  },

  getItemById: async (id) => {
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await axios.get(`${API_BASE_URL}/item/${id}`, { headers });
    return response.data;
  }
};

// export const roomService = {
//   getLiveAuctions: async () => {
//     const response = await axios.get(`${API_BASE_URL}/room/live-auctions`);
//     return response.data;
//   },
//
//   getAuctionOfTheDay: async () => {
//     const response = await axios.get(`${API_BASE_URL}/room/auction-of-the-day`);
//     return response.data;
//   }
// };
//
// export const authService = {
//   login: async (usernameOrEmail, password) => {
//     const response = await axios.post(`${API_BASE_URL}/user/login`, {
//       usernameOrEmail,
//       password
//     });
//     return response.data;
//   },
//
//   register: async (username, email, password, confirmPassword) => {
//     const response = await axios.post(`${API_BASE_URL}/user/register`, {
//       username,
//       email,
//       password,
//       confirmPassword
//     });
//     return response.data;
//   }
// };