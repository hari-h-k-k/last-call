"use client";
import { createContext, useContext, useState } from "react";
import { setAuthToken } from "../lib/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [info, setInfo] = useState({ username: "", token: "" });

  const login = (username, token) => {
    setInfo({ username, token });
    setAuthToken(token); // sync token with Axios
  };

  const logout = () => {
    setInfo({ username: "", token: "" });
    setAuthToken(null); // clear token
  };

  return (
    <AuthContext.Provider value={{ info, setInfo, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
