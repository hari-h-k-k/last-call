"use client";
import { createContext, useContext, useState } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [info, setInfo] = useState({
    username: "",
    token: "",
  });

  const router = useRouter();

  const login = (username, token) => {
    setInfo({ username, token });
    router.push("/home");
  };

  const logout = () => {
    setInfo({ username: "", token: "" });
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ info, setInfo, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
