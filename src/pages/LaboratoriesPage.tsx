import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import "../styles/LaboratoriesPage.css";
import { API_BASE_URL } from "../services/globals";
import ActionsButton from "../components/ActionsButton";
import LaboratoryEditModal from "../components/Laboratory/LaboratoryEditModal";
import LaboratoryCreateModal from "../components/Laboratory/LaboratoryCreateModal";

interface Laboratory {
  idLabortatory?: string;
  name: string;
  location: string;
}

type ModalState = {
  type: "create" | "edit" | null;
  laboratory: Laboratory | null;
};

export default function LaboratoriesPage() {
  const [laboratories, setLaboratories] = useState<Laboratory[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalState, setModalState] = useState<ModalState>({ type: null, laboratory: null });
  const authContext = useContext(AuthContext);

  // Fetch laboratories from the backend
  useEffect(() => {
    async function fetchLaboratories() {
      if (!authContext?.token) {
        setError("No estás autenticado. Por favor, inicia sesión.");
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/api/v1/laboratory/all`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authContext.token}`,
          },
        });
        setLaboratories(response.data);
      } catch (error) {
        console.error("Error al obtener laboratorios:", error);
        setError("No se pudo obtener la lista de laboratorios. Verifica tu conexión o tus permisos.");
      } finally {
        setLoading(false);
      }
    }

    fetchLaboratories();
  }, [authContext?.token]);

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/v1/laboratory/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authContext?.token}`,
        },
      });
      setLaboratories((prevLabs) => prevLabs.filter((lab) => lab.idLabortatory !== id));
    } catch (error) {
      console.error("Error al borrar laboratorio:", error);
      setError("No se pudo borrar el laboratorio. Verifica tus permisos.");
    }
  };

  const handleEdit = (laboratory: Laboratory) => {
    setModalState({ type: "edit", laboratory }); // Abre el modal de edición con el laboratorio seleccionado
  };

  const handleAddLaboratory = () => {
    setModalState({ type: "create", laboratory: null }); // Abre el modal de creación
  };

  const handleSave = async (laboratory: Laboratory) => {
    try {
      if (modalState.type === "edit" && laboratory.idLabortatory) {
        // Editar laboratorio existente
        const response = await axios.post(`${API_BASE_URL}/api/v1/laboratory/update`, laboratory, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authContext?.token}`,
          },
        });
        setLaboratories((prevLabs) =>
          prevLabs.map((lab) => (lab.idLabortatory === laboratory.idLabortatory ? response.data : lab))
        );
      } else if (modalState.type === "create") {
        // Crear nuevo laboratorio
        const response = await axios.post(`${API_BASE_URL}/api/v1/laboratory/create`, laboratory, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authContext?.token}`,
          },
        });
        setLaboratories((prevLabs) => [...prevLabs, response.data]);
      }
      setModalState({ type: null, laboratory: null }); // Cierra el modal
    } catch (error) {
      console.error("Error al guardar el laboratorio:", error);
      setError("No se pudo guardar el laboratorio. Verifica los datos.");
    }
  };

  return (
    <div>
      <div className="laboratory-list-header">
        <h1>Lista de Laboratorios</h1>
        <ActionsButton 
          onAdd={handleAddLaboratory}
          onExportExcel={() => console.log("Exportar como Excel")}
          addLabel ="Crear Laboratorio"
        />
      </div>

      {error && <p className="error-message">{error}</p>}

      {loading ? (
        <p>Cargando laboratorios...</p>
      ) : (
        <div className="laboratory-list">
          {laboratories.map((lab) => (
            <div key={lab.idLabortatory} className="laboratory-row">
              <div className="info">
                <p><strong>Nombre:</strong> {lab.name}</p>
                <p><strong>Ubicación:</strong> {lab.location}</p>
              </div>
              <div className="actions">
                <button
                  className="edit-button"
                  onClick={() => handleEdit(lab)}
                >
                  Editar
                </button>
                <button
                  className="delete-button"
                  onClick={() => handleDelete(lab.idLabortatory!)}
                >
                  Borrar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalState.type === "edit" && modalState.laboratory && (
        <LaboratoryEditModal
          laboratory={{ ...modalState.laboratory, idLabortatory: modalState.laboratory?.idLabortatory || "" }}
          onClose={() => setModalState({ type: null, laboratory: null })}
          onSave={handleSave}
        />
      )}

      {modalState.type === "create" && (
        <LaboratoryCreateModal
          onClose={() => setModalState({ type: null, laboratory: null })}
          onSave={handleSave}
        />
      )}
    </div>
  );
}