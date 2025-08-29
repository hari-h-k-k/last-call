import axios from "axios";
import { getAuthToken } from "./auth"; // helper to get token from context

// Base Axios instance
const api = axios.create({
  baseURL: "https://api.example.com", // replace with your API base URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken(); // Get token from context
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
