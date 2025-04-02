import React, { useContext, useEffect, useState } from "react";
import { useNavigate,Route,Routes } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {jwtDecode} from "jwt-decode";
import "../styles/HomePage.css";
import {SideMenuBarAdmin,SideMenuBarUser} from "../components/SideMenuBar";
import "../styles/SideMenuBar.css";
import UsersPage from "./UsersPage";
import "../styles/UsersPage.css";
import LaboratoriesPage from "./LaboratoriesPage";
import ReservationPage from "./ReservationPage";

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
  const navigate = useNavigate();


  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  const changeView = (path: string) => {
    navigate(path);
  };

  return (
    <div className="viewer">
      <button className="toggle-button" onClick={toggleMenu}>
        <span className="menu-icon">☰</span>
      </button>
      <SideMenuBarAdmin isVisible={isMenuVisible} toggleMenu={toggleMenu} changeView={changeView} />
      <div className="content-area">
      <Routes>
          <Route path="/" element={<h1>Hola, bienvenido al inicio</h1>} />
          <Route path="usuarios" element={<UsersPage/> } />
          <Route path="reservas" element={<ReservationPage/>} />
          <Route path="laboratorios" element={<LaboratoriesPage/>} />
      </Routes>
      </div>
    </div>
  );
}

function UserView() {
  const [isMenuVisible, setIsMenuVisible] = React.useState(true);
  const navigate = useNavigate();


  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  const changeView = (path: string) => {
    navigate(path); 
  };

  return (
    <div className="viewer">
      <button className="toggle-button" onClick={toggleMenu}>
        <span className="menu-icon">☰</span>
      </button>
      <SideMenuBarUser isVisible={isMenuVisible} toggleMenu={toggleMenu} changeView={changeView}/>
      <div className="content-area">
        <Routes>
          <Route path="/" element={<h1>Hola, bienvenido al inicio</h1>} />
          <Route path="reservas" element={<ReservationPage/>} />
        </Routes>
      </div>
    </div>
  );
}