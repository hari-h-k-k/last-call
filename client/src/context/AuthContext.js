"use client";
import { createContext, useContext, useState } from "react";
import { setAuthToken } from "../lib/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const login = (username, token) => {
    sessionStorage.setItem(
        "userInfo",
        JSON.stringify({ username: username, token: token })
    );
    setAuthToken(token); // sync token with Axios
  };

  const logout = () => {
    sessionStorage.setItem(
        "userInfo",
        JSON.stringify({ username: "", token: "" })
    );
    setAuthToken(null); // clear token
  };

  return (
    <AuthContext.Provider value={{ login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
