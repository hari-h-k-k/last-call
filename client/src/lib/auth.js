let authToken = null;

// Setter function called from AuthContext
export const setAuthToken = (token) => {
  authToken = token;
};

// Getter function for Axios interceptor
export const getAuthToken = () => authToken;
