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
  }) => void;
  laboratories: { idLabortatory: string; name: string }[];
  selectedDay: string;
  startTime: string;
  endTime: string;
  currentUser: string; // Usuario autenticado
}

export default function ReservationModal({
  isOpen,
  onClose,
  onSave,
  laboratories,
  selectedDay,
  startTime,
  endTime,
  currentUser,
}: ReservationModalProps) {
  const [formData, setFormData] = useState({
    laboratoryId: "",
    user: currentUser, // Prellenar con el usuario autenticado
    className: "",
    professorName: "", // Nuevo campo para el nombre del profesor
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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