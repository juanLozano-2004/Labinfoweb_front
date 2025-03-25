import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav>
      <ul>
        <li><Link to="/home">Inicio</Link></li>
        <li><Link to="/perfil">Perfil</Link></li>
        <li><Link to="/config">Configuración</Link></li>
      </ul>
    </nav>
  );
}
