import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {jwtDecode} from "jwt-decode";
import "../styles/HomePage.css";
import {SideMenuBarAdmin,SideMenuBarUser} from "../components/SideMenuBar";
import "../styles/SideMenuBar.css";

interface DecodedToken {
  Role: string;
  exp: number;
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

        // Verifica si el token ha expirado
        const currentTime = Math.floor(Date.now() / 1000); // Tiempo actual en segundos
        if (decoded.exp < currentTime) {
          console.error("El token ha expirado");
          navigate("/"); // Redirige si el token ha expirado
          return;
        }

        setRole(decoded.Role);
      } catch (error) {
        console.error("Error al decodificar el token:", error);
        navigate("/"); // Redirige si hay un error al decodificar el token
      }
    }
  }, [authContext, navigate]);

  if (!role) return <p>Cargando...</p>;

  return (
    <div className="home-container">
      <h1 className="home-title">Reservas Labinfo</h1>
      {role === "ADMIN" ? <AdminView /> : <UserView />}
    </div>
  );
}

function AdminView() {
  const [isMenuVisible, setIsMenuVisible] = React.useState(true);

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  return (
    <div className="viewer">
      <button className="toggle-button" onClick={toggleMenu}>
        <span className="menu-icon">☰</span>
      </button>
      <SideMenuBarAdmin isVisible={isMenuVisible} toggleMenu={toggleMenu} />
      <div className="content-area">
        <h1>Vista de Administrador</h1>
        <p>Aquí puedes gestionar usuarios, laboratorios, reservas, etc.</p>
      </div>
    </div>
  );
}

function UserView() {
  const [isMenuVisible, setIsMenuVisible] = React.useState(true);

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  return (
    <div className="viewer">
      <button className="toggle-button" onClick={toggleMenu}>
        <span className="menu-icon">☰</span>
      </button>
      <SideMenuBarUser isVisible={isMenuVisible} toggleMenu={toggleMenu} />
      <div className="content-area">
        <h1>Vista de Usuario</h1>
        <p>Aquí puedes gestionar usuarios, laboratorios, reservas, etc.</p>
      </div>
    </div>
  );
}