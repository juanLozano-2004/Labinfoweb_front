import React, { useState,useEffect } from "react";
import "../styles/ReservationEditModal.css";


interface Reservation {
  id: string;
  laboratoryId: string;
  date: string;
  time: string;
  user: string;
  className: string;
  professorName: string;
}

interface ReservationEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservation: Reservation;
  onSave: (updatedReservation: Reservation) => void;
  onDelete: (id: string) => void;
}

export default function ReservationEditModal({
  isOpen,
  onClose,
  reservation,
  onSave,
  onDelete,
}: ReservationEditModalProps) {
  const [formData, setFormData] = useState({
    className:"",
    professorName:"",
  });

  useEffect(() => {
    if (reservation) {
      setFormData({
        className: reservation.className,
        professorName: reservation.professorName,
      });
    }
  }, [reservation]);  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...reservation,
      className: formData.className,
      professorName: formData.professorName,
    });
    onClose();
  };

  const handleDelete = () => {
    onDelete(reservation.id);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Editar Reserva</h2>
        <form onSubmit={handleSave}>
          <p>
            <strong>Laboratorio:</strong> {reservation.laboratoryId}
          </p>
          <p>
            <strong>Fecha:</strong> {reservation.date}
          </p>
          <p>
            <strong>Hora:</strong> {reservation.time}
          </p>
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
            <button type="button" onClick={handleDelete} className="delete-button">
              Eliminar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}