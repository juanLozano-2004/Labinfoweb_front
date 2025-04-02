import React, { useState } from "react";
import "../styles/ReservationModal.css";

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (reservation: {
    laboratoryId: string;
    startTime: string;
    endTime: string;
    user: string;
    className: string;
    professorName: string;
  }) => void;
  laboratories: { idLabortatory: string; name: string }[];
  selectedDay: string;
  startTime: string;
  endTime: string;
  currentUser: string; // Usuario autenticado
  selectedLaboratory: string; // Laboratorio seleccionado
  onLaboratoryChange?: (laboratoryId: string) => void; // Función opcional para manejar cambios en el laboratorio
  token: string; // Token de autenticación
}

export default function ReservationCreateModal({
  isOpen,
  onClose,
  onSave,
  laboratories,
  selectedDay,
  startTime,
  endTime,
  currentUser,
  selectedLaboratory,
  onLaboratoryChange, // Recibe la función para actualizar el laboratorio
  token, // Token de autenticación
}: ReservationModalProps) {
  const [formData, setFormData] = useState({
    laboratoryId: selectedLaboratory, // Prellenar con el laboratorio seleccionado
    user: currentUser,
    className: "",
    professorName: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Si se cambia el laboratorio, actualiza el estado en el componente principal
    if (name === "laboratoryId" && onLaboratoryChange) {
      onLaboratoryChange(value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Token enviado en la solicitud POST:", token); // Verifica el token
    console.log("Datos enviados:", formData); // Verifica los datos enviados
    onSave({
      ...formData,
      startTime: `${selectedDay} ${startTime}`,
      endTime: `${selectedDay} ${endTime}`,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Crear Reserva</h2>
        <form onSubmit={handleSubmit}>
          <p>
            <strong>Día:</strong> {selectedDay}
          </p>
          <p>
            <strong>Hora de Inicio:</strong> {startTime}
          </p>
          <p>
            <strong>Hora de Fin:</strong> {endTime}
          </p>
          <label>
            Laboratorio:
            <select
              name="laboratoryId"
              value={formData.laboratoryId}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Seleccione un laboratorio
              </option>
              {laboratories.map((lab) => (
                <option key={lab.idLabortatory} value={lab.idLabortatory}>
                  {lab.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Usuario:
            <input
              type="text"
              name="user"
              value={formData.user}
              onChange={handleChange}
              readOnly
            />
          </label>
          <label>
            Nombre de la Clase:
            <input
              type="text"
              name="className"
              value={formData.className}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Nombre del Profesor:
            <input
              type="text"
              name="professorName"
              value={formData.professorName}
              onChange={handleChange}
              required
            />
          </label>
          <div className="modal-actions">
            <button type="button" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
}