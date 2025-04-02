import React, { useState } from "react";
import "../../styles/UserModal.css";

interface Laboratory {
  idLabortatory: string;
  name: string;
  location: string;
}

interface EditLaboratoryModalProps {
  laboratory: Laboratory;
  onClose: () => void;
  onSave: (laboratory: Laboratory) => void;
}

export default function LaboratoryEditModal({ laboratory, onClose, onSave }: EditLaboratoryModalProps) {
  const [formData, setFormData] = useState<Laboratory>(laboratory);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Editar Laboratorio</h2>
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
            <button type="submit">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
}