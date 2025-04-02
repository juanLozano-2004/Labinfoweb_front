import React, { useState } from "react";
import "../../styles/UserModal.css";

interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: string;
  creationDate?: string;
  lastLogin?: string;
}

interface EditUserModalProps {
  user: User; // Usuario obligatorio para edición
  onClose: () => void;
  onSave: (user: User) => void;
}

export default function EditUserModal({ user, onClose, onSave }: EditUserModalProps) {
  const [formData, setFormData] = useState<User>(user);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
        <h2>Editar Usuario</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Nombre Completo:
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Usuario:
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Rol:
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="ADMIN">ADMIN</option>
              <option value="USER">USER</option>
            </select>
          </label>
          <p><strong>Fecha de Creación:</strong> {user.creationDate}</p>
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



