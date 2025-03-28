import React from "react";
import "../styles/SideMenuBar.css";

interface SideMenuBarProps {
  isVisible: boolean;
  toggleMenu: () => void;
}

export function SideMenuBarAdmin({ isVisible, toggleMenu }: SideMenuBarProps) {
  return (
    <div className={`side-menu-bar ${isVisible ? "visible" : "hidden"}`}>
      <h2>Menú</h2>
      <ul>
        <button>Inicio</button>
        <button>Usuarios</button>
        <button>Reservas</button>
        <button>Laboratorios</button>
        <button className="logout-button">Logout</button>
      </ul>
    </div>
  );
}

export function SideMenuBarUser({ isVisible, toggleMenu }: SideMenuBarProps) {
  return (
    <div className={`side-menu-bar ${isVisible ? "visible" : "hidden"}`}>
      <h2>Menú</h2>
      <ul>
        <button>Inicio</button>
        <button>Reservas</button>
        <button className="logout-button">Logout</button>
      </ul>
    </div>
  );
}
