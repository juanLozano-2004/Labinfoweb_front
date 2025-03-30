import React, { useState } from "react";
import "../styles/UserModal.css";

interface User {
  username: string;
  email: string;
  password: string;
  fullName: string;
  role: string;
}

interface CreateUserModalProps {
  onClose: () => void;
  onSave: (user: User) => void;
}

export default function CreateUserModal({ onClose, onSave }: CreateUserModalProps) {
  const [formData, setFormData] = useState<User>({
    username: "",
    email: "",
    password: "",
    fullName: "",
    role: "USER", // Valor predeterminado
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData); // Envía los datos al padre
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Crear Usuario</h2>
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
            Contraseña:
            <input
              type="password"
              name="password"
              value={formData.password}
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
              <option value="ADMIN">Administrador</option>
              <option value="USER">Usuario</option>
            </select>
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