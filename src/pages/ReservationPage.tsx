import React, { useState, useEffect, useContext } from "react";
import "../styles/ReservationPage.css";
import axios from "axios";
import { API_BASE_URL } from "../services/globals";
import { AuthContext } from "../context/AuthContext"; // Importa el contexto de autenticación
import Calendar from "../components/Calendar"; // Asegúrate de que esta ruta sea correcta
import ReservationModal from "../components/ReservationModal"; // Importa el modal para crear reservas

interface Laboratory {
  idLabortatory: string;
  name: string;
}

interface Reservation {
  id?: string;
  laboratoryId: string;
  date: string; // Fecha en formato YYYY-MM-DD
  time: string; // Hora en formato HH:mm
  user: string;
  className: string;
}

export default function ReservationPage() {
  const authContext = useContext(AuthContext); // Obtén el contexto de autenticación
  const token = authContext?.token;
  const currentUser = authContext?.user; 
  const [laboratories, setLaboratories] = useState<Laboratory[]>([]);
  const [selectedLaboratory, setSelectedLaboratory] = useState<string | null>(null);
  const [currentWeek, setCurrentWeek] = useState<number>(1);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isCreatingReservation, setIsCreatingReservation] = useState<boolean>(false);
  const [selectedCell, setSelectedCell] = useState<{ day: string; time: string; endTime?: string } | null>(null);

  // Fetch laboratories from the backend
  useEffect(() => {
    async function fetchLaboratories() {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/v1/laboratory/all`, {
          headers: {
            Authorization: `Bearer ${token}`, // Incluye el token en los encabezados
          },
        });
        setLaboratories(response.data);
      } catch (error) {
        console.error("Error fetching laboratories:", error);
      }
    }

    fetchLaboratories();
  }, [token]);

  // Fetch reservations for the selected laboratory and week
  useEffect(() => {
    if (selectedLaboratory) {
      const fetchReservations = async () => {
        try {
          const response = await axios.get(
            `${API_BASE_URL}/api/v1/reservation/all?laboratoryId=${selectedLaboratory}&week=${currentWeek}`,
            {
              headers: {
                Authorization: `Bearer ${token}`, // Incluye el token en los encabezados
              },
            }
          );
          setReservations(response.data);
        } catch (error) {
          console.error("Error fetching reservations:", error);
        }
      };

      fetchReservations();
    }
  }, [selectedLaboratory, currentWeek, token]);

    const handleCreateReservation = (day: string, time: string) => {
    const [startTime, endTime] = time.split(" - "); // Divide el rango en hora de inicio y fin
    setSelectedCell({ day, time: startTime, endTime }); // Guarda tanto la hora de inicio como la hora de fin
    setIsCreatingReservation(true);
    };
const handleSaveReservation = async (reservation: Reservation) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/v1/reservation/post`,
      reservation,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Incluye el token en los encabezados
        },
      }
    );
    setReservations((prev) => [...prev, response.data]);
    setIsCreatingReservation(false);
    setSelectedCell(null);
  } catch (error) {
    console.error("Error saving reservation:", error);
  }
};

  const handleExportToExcel = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/reservation/export?laboratoryId=${selectedLaboratory}&week=${currentWeek}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Incluye el token en los encabezados
          },
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `reservas-semana-${currentWeek}.xlsx`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Error exporting reservations to Excel:", error);
    }
  };

  const handleWeekNavigation = (direction: "prev" | "next") => {
    setCurrentWeek((prev) => (direction === "prev" ? prev - 1 : prev + 1));
  };

  return (
    <div className="reservation-page">
      <h1 className="page-title">Gestión de Reservas</h1>

      {/* Selector de Laboratorio */}
      <div className="laboratory-selector">
        <label>
          Laboratorio:
          <select
            value={selectedLaboratory || ""}
            onChange={(e) => setSelectedLaboratory(e.target.value)}
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
      </div>

      {/* Selector de Semana */}
      <div className="week-navigation">
        <label>
          Semana:
          <select
            value={currentWeek}
            onChange={(e) => setCurrentWeek(Number(e.target.value))}
          >
            {Array.from({ length: 18 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                Semana {i + 1}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Calendario */}
      <Calendar
        reservations={reservations}
        onCellClick={(day, time) => handleCreateReservation(day, time)}
      />

      {/* Botón de Exportar a Excel */}
      <div className="export-button">
        <button onClick={handleExportToExcel}>Exportar a Excel</button>
      </div>

      {/* Modal para Crear Reservas */}
      <ReservationModal
  isOpen={isCreatingReservation}
  onClose={() => setIsCreatingReservation(false)}
  onSave={(reservation) => handleSaveReservation({
    ...reservation,
    date: selectedCell?.day || "",
    time: `${selectedCell?.time || ""} - ${selectedCell?.endTime || ""}`
  })}
  laboratories={laboratories}
  selectedDay={selectedCell?.day || ""}
  startTime={selectedCell?.time || ""}
  endTime={selectedCell?.endTime || ""}
  currentUser={currentUser || ""} 
    />
    </div>
  );
}