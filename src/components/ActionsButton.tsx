import React, { useState, useRef, useEffect } from "react";
import "../styles/ActionButton.css";

interface ActionsButtonProps {
  onAdd?: () => void; // Acción para añadir (usuario o laboratorio)
  onExportExcel?: () => void; // Acción para exportar a Excel
  addLabel: string; // Etiqueta personalizada para el botón "Añadir"
}

export default function ActionsButton({ onAdd, onExportExcel, addLabel }: ActionsButtonProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Cerrar el menú cuando se hace clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="actions-button-container" ref={menuRef}>
      <button 
        className="main-action-button"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        Acciones ▼
      </button>
      
      {isMenuOpen && (
        <div className="dropdown-menu">
          <button 
            className="dropdown-item"
            onClick={() => {
              if (onAdd) onAdd();
              setIsMenuOpen(false);
            }}
          >
            ➕ {addLabel}
          </button>
          <button 
            className="dropdown-item"
            onClick={() => {
              if (onExportExcel) onExportExcel();
              setIsMenuOpen(false);
            }}
          >
            📊 Exportar como Excel
          </button>
        </div>
      )}
    </div>
  );
}