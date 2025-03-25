import React, { createContext, useState, useEffect } from "react";
import { login as loginService } from "../services/authService";

interface AuthContextType {
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

  async function login(username: string, password: string) {
    try {
      const token = await loginService(username, password);
      console.log("Token:", token); // Mostrar el token en la consola
      setToken(token);
      localStorage.setItem("token", token);
    } catch (error) {
      console.error("Error en login:", error);
    }
  }

  function logout() {
    setToken(null);
    localStorage.removeItem("token");
  }

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}