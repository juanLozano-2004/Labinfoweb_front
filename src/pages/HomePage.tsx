import React, { Component, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {jwtDecode} from "jwt-decode"; // Importa jwtDecode correctamente
import Card from "../components/Card";// Importa el componente Card
import "../styles/HomePage.css";

interface DecodedToken {
  Role: string;
}


export default function HomePage() {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    if (!authContext || !authContext.token) {
      navigate("/");
    } else {
      try {
        const decoded: DecodedToken = jwtDecode(authContext.token);
        setRole(decoded.Role);
      } catch (error) {
        console.error("Error al decodificar el token:", error);
        navigate("/");
      }
    }
  }, [authContext, navigate]);

  if (!role) return <p>Cargando...</p>;

  return (
    <div>
      <h1>Bienvenido a Home</h1>
      {role === "ADMIN" ? <AdminView navigate={navigate} /> : <UserView />}
    </div>
  );
}

function AdminView({navigate}: {navigate: any}) {
  return (
    <div className="options-grid">
    <Card title="Usuarios" onClick={() => navigate("/usuarios")} />
      <Card title="Laboratorios" onClick={() => navigate("/laboratorios")} />
      <Card title="Reservas" onClick={() => navigate("/reservas")} />
      <Card title="Reportes" onClick={() => navigate("/reportes")} />
    </div>
    );
}

function UserView() {
  return <h2>Vista de Usuario</h2>;
}