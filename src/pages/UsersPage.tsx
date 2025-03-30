import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import "../styles/UsersPage.css";
import { API_BASE_URL } from "../services/globals";
import ActionsButton from "../components/ActionsButton";
import UserEditModal from "../components/UserEditModal";
import UserCreateModal from "../components/UserCreateModal";

interface User {
  id?: string;
  username: string;
  email: string;
  password?: string;
  fullName: string;
  role: string;
  creationDate?: string;
  lastLogin?: string;
}

type ModalState = {
  type: "create" | "edit" | null; 
  user: User | null; 
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalState, setModalState] = useState<ModalState>({ type: null, user: null }); // Estado combinado
  const authContext = useContext(AuthContext);

  // Fetch users from the backend
  useEffect(() => {
    async function fetchUsers() {
      if (!authContext?.token) {
        setError("No estás autenticado. Por favor, inicia sesión.");
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/api/v1/user/all`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authContext.token}`,
          },
        });
        setUsers(response.data);
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
        setError("No se pudo obtener la lista de usuarios. Verifica tu conexión o tus permisos.");
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, [authContext?.token]);

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/v1/user/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authContext?.token}`,
        },
      });
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
    } catch (error) {
      console.error("Error al borrar usuario:", error);
      setError("No se pudo borrar el usuario. Verifica tus permisos.");
    }
  };

  const handleEdit = (user: User) => {
    setModalState({ type: "edit", user }); // Abre el modal de edición con el usuario seleccionado
  };

  const handleAddUser = () => {
    setModalState({ type: "create", user: null }); // Abre el modal de creación
  };

  const handleSave = async (user: User) => {
    try {
      if (modalState.type === "edit" && user.id) {
        // Editar usuario existente
        const response = await axios.post(`${API_BASE_URL}/api/v1/user/update`, user, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authContext?.token}`,
          },
        });
        setUsers((prevUsers) =>
          prevUsers.map((u) => (u.id === user.id ? response.data : u))
        );
      } else if (modalState.type === "create") {
        // Crear nuevo usuario
        const response = await axios.post(`${API_BASE_URL}/api/v1/user/create`, user, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authContext?.token}`,
          },
        });
        setUsers((prevUsers) => [...prevUsers, response.data]);
      }
      setModalState({ type: null, user: null }); // Cierra el modal
    } catch (error) {
      console.error("Error al guardar el usuario:", error);
      setError("No se pudo guardar el usuario. Verifica los datos.");
    }
  };

  return (
    <div>
      <div className="user-list-header">
        <h1>Lista de Usuarios</h1>
        <ActionsButton 
          onAddUser={handleAddUser}
          onExportExcel={() => console.log("Exportar como Excel")}
        />
      </div>

      {error && <p className="error-message">{error}</p>}

      {loading ? (
        <p>Cargando usuarios...</p>
      ) : (
        <div className="user-list">
          {users.map((user) => (
            <div key={user.id} className="user-row">
              <div className="info">
                <p><strong>Nombre Completo:</strong> {user.fullName}</p>
                <p><strong>Usuario:</strong> {user.username}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Rol:</strong> {user.role}</p>
              </div>
              <div className="actions">
                <button
                  className="edit-button"
                  onClick={() => handleEdit(user)}
                >
                  Editar
                </button>
                <button
                  className="delete-button"
                  onClick={() => handleDelete(user.id!)}
                >
                  Borrar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalState.type === "edit" && modalState.user && (
        <UserEditModal
          user={{ ...modalState.user, id: modalState.user?.id || "" }}
          onClose={() => setModalState({ type: null, user: null })}
          onSave={handleSave}
        />
      )}

      {modalState.type === "create" && (
        <UserCreateModal
          onClose={() => setModalState({ type: null, user: null })}
          onSave={handleSave}
        />
      )}
    </div>
  );
}