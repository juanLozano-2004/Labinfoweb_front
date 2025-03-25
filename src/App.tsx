import React from "react";
import LoginPage from "./pages/LoginPage";
import AuthProvider from "./context/AuthContext";

export default function App() {
  return (
  <AuthProvider>
    <LoginPage />
  </AuthProvider>
  );  
}




