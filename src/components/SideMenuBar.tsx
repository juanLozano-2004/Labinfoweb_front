import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/SideMenuBar.css";

interface SideMenuBarProps {
  isVisible: boolean;
  toggleMenu: () => void;
  changeView: (path: string) => void;
}

export function SideMenuBarAdmin({ isVisible, toggleMenu ,changeView }: SideMenuBarProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken"); 
    navigate("/"); 
  };
  return (
    <div className={`side-menu-bar ${isVisible ? "visible" : "hidden"}`}>
      <h2>Menú</h2>
      <ul>
        <button onClick={() => changeView("/home")}>Inicio</button>
        <button onClick={() => changeView("/home/usuarios")}>Usuarios</button>
        <button onClick={() => changeView("/home/reservas")} >Reservas</button>
        <button onClick={() => changeView("/home/laboratorios")}>Laboratorios</button>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </ul>
    </div>
  );
}

export function SideMenuBarUser({ isVisible, toggleMenu, changeView }: SideMenuBarProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken"); 
    navigate("/"); 
  };
  return (
    <div className={`side-menu-bar ${isVisible ? "visible" : "hidden"}`}>
      <h2>Menú</h2>
      <ul>
        <button onClick={() => changeView("/home")}>Inicio</button>
        <button onClick={() => changeView("/home/reservas")} >Reservas</button>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </ul>
    </div>
  );
}
