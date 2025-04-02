import React, { createContext, useState, useEffect } from "react";
import { login as loginService } from "../services/authService";

interface AuthContextType {
  token: string | null;
  user: string | null; // Add the user property
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [user, setUser] = useState<string | null>(localStorage.getItem("user"));

  async function login(username: string, password: string) {
    try {
      const token = await loginService(username, password);
      console.log("Token:", token); // Mostrar el token en la consola
      setToken(token);
      localStorage.setItem("token", token);
      localStorage.setItem("user", username); // Guardar el usuario en localStorage
    } catch (error) {
      console.error("Error en login:", error);
    }
  }

  function logout() {
    setToken(null);
    setUser(null); // Limpia el usuario autenticado
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  
  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}