import React, { useState } from "react";
import "../../styles/LaboratoryModal.css";

interface Laboratory {
  name: string;
  location: string;
}

interface CreateLaboratoryModalProps {
  onClose: () => void;
  onSave: (laboratory: Laboratory) => void;
}

export default function LaboratoryCreateModal({ onClose, onSave }: CreateLaboratoryModalProps) {
  const [formData, setFormData] = useState<Laboratory>({
    name: "",
    location: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData); // Envía los datos al método onSave
    onClose(); // Cierra el modal después de guardar
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Crear Laboratorio</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Nombre:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Ubicación:
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </label>
          <div className="modal-actions">
            <button type="button" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit">Crear</button>
          </div>
        </form>
      </div>
    </div>
  );
}