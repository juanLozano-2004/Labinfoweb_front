import React, { useState, useEffect, useContext } from "react";
import "../styles/ReservationPage.css";
import axios from "axios";
import { API_BASE_URL } from "../services/globals";
import { AuthContext } from "../context/AuthContext"; // Importa el contexto de autenticación
import Calendar from "../components/Calendar"; // Asegúrate de que esta ruta sea correcta
import ReservationModal from "../components/ReservationModal";
import { differenceInWeeks, addDays, format } from "date-fns"; // Importa funciones para manejar fechas
import { es } from "date-fns/locale"; // Importa el locale español

interface Laboratory {
  idLabortatory: string;
  name: string;
  location: string; // Add the location property
}

interface Reservation {
  id?: string;
  laboratoryId: string;
  date: string; // Fecha en formato YYYY-MM-DD
  time: string; // Hora en formato HH:mm
  user: string;
  className: string;
  professorName: string;
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
  const [academicPeriod, setAcademicPeriod] = useState({
    startDate: "2025-01-15", // Fecha de inicio del periodo
    endDate: "2025-05-15",   // Fecha de fin del periodo
  });

  const calculateWeeks = (startDate: string, endDate: string) => {
    const weeks = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    const totalWeeks = differenceInWeeks(end, start);

    for (let i = 0; i <= totalWeeks; i++) {
      const weekStart = addDays(start, i * 7);
      weeks.push(format(weekStart, "yyyy-MM-dd"));
    }

    return weeks;
  };

  const weeks = calculateWeeks(academicPeriod.startDate, academicPeriod.endDate);

  const getDateFromDay = (dayName: string, currentWeek: number, academicPeriodStart: string): string => {
    const daysOfWeek = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const dayIndex = daysOfWeek.indexOf(dayName);

    if (dayIndex === -1) {
      throw new Error(`Día inválido: ${dayName}`);
    }

    // Calcula el inicio de la semana actual
    const startOfAcademicPeriod = new Date(academicPeriodStart);
    const startOfCurrentWeek = addDays(startOfAcademicPeriod, (currentWeek - 1) * 7);

    // Calcula la fecha del día seleccionado
    const selectedDate = addDays(startOfCurrentWeek, dayIndex);
    return format(selectedDate, "yyyy-MM-dd"); // Devuelve la fecha en formato YYYY-MM-DD
  };

  const convertTo24HourFormat = (time: string): string => {
    const [hour, minutePart] = time.split(":");
    const minute = minutePart.slice(0, 2);
    const period = minutePart.slice(3).toUpperCase(); // AM o PM

    let hour24 = parseInt(hour, 10);
    if (period === "PM" && hour24 !== 12) {
      hour24 += 12;
    } else if (period === "AM" && hour24 === 12) {
      hour24 = 0;
    }

    return `${hour24.toString().padStart(2, "0")}:${minute}:00`; // Formato HH:mm:ss
  };

  useEffect(() => {
    async function fetchLaboratories() {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/v1/laboratory/all`, {
          headers: {
            Authorization: `Bearer ${token}`, // Incluye el token en los encabezados
          },
        });
        console.log("Laboratorios obtenidos:", response.data); // Verifica los datos obtenidos
        setLaboratories(response.data);
      } catch (error) {
        console.error("Error fetching laboratories:", error);
      }
    }

    fetchLaboratories();
  }, [token]);

  useEffect(() => {
    if (selectedLaboratory) {
      const fetchReservations = async () => {
        try {
          const response = await axios.get(
            `${API_BASE_URL}/api/v1/reservation/getByLaboratory/${selectedLaboratory}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
  
          console.log("Respuesta del backend:", response.data); // Verificar la respuesta del backend
  
          // Filtrar las reservas por la semana actual
          const startOfWeek = addDays(new Date(academicPeriod.startDate), (currentWeek - 1) * 7);
          const endOfWeek = addDays(startOfWeek, 6);
  
          const transformedReservations = response.data.map((reservation: any) => {
            const startDate = new Date(reservation.startTime);
            const endDate = new Date(reservation.endTime);
          
            return {
              id: reservation.id,
              laboratoryName: reservation.laboratory.name,
              date: format(startDate, "yyyy-MM-dd"), // Extraer solo la fecha en formato YYYY-MM-DD
              time: `${format(startDate, "h:mm a")} - ${format(endDate, "h:mm a")}`, // Formato de hora
              className: reservation.className,
              professorName: reservation.professorName,
            };
          });
  
          console.log("Fecha de inicio de la semana:", format(startOfWeek, "yyyy-MM-dd"));
          console.log("Fecha de fin de la semana:", format(endOfWeek, "yyyy-MM-dd"));
          
          const filteredReservations = transformedReservations.filter((reservation: any) => {
            console.log("Fecha de la reserva:", reservation.date);
            const startDate = format(startOfWeek, "yyyy-MM-dd");
            const endDate = format(endOfWeek, "yyyy-MM-dd");
          
            return reservation.date >= startDate && reservation.date <= endDate;
          });
  
          console.log("Reservas transformadas y filtradas:", filteredReservations); // Verificar las reservas transformadas y filtradas
          setReservations(filteredReservations);
        } catch (error) {
          console.error("Error fetching reservations:", error); // Mostrar errores en la consola
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
      // Usar directamente la fecha seleccionada
      const date = selectedCell?.day || ""; // Fecha en formato YYYY-MM-DD
  
      // Convierte las horas al formato de 24 horas
      const startTime = `${date}T${convertTo24HourFormat(selectedCell?.time || "00:00")}`;
      const endTime = `${date}T${convertTo24HourFormat(selectedCell?.endTime || "00:00")}`;
  
      const payload = {
        laboratory: {
          idLabortatory: reservation.laboratoryId,
          name: laboratories.find((lab) => lab.idLabortatory === reservation.laboratoryId)?.name || "",
          location: laboratories.find((lab) => lab.idLabortatory === reservation.laboratoryId)?.location || "",
        },
        startTime, // Enviar en formato ISO-8601
        endTime,   // Enviar en formato ISO-8601
        user: {
          username: currentUser || "defaultUser",
          email: "default@example.com",
          fullName: "Default User",
        },
        className: reservation.className,
        professorName: reservation.professorName,
      };
  
      console.log("Datos enviados al backend:", payload);
  
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/reservation/create`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      // Llamar a fetchReservations para actualizar las reservas
      if (selectedLaboratory) {
        const fetchReservations = async () => {
          try {
            const response = await axios.get(
              `${API_BASE_URL}/api/v1/reservation/getByLaboratory/${selectedLaboratory}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
  
            console.log("Reservas actualizadas:", response.data);
  
            // Transformar y filtrar las reservas
            const startOfWeek = addDays(new Date(academicPeriod.startDate), (currentWeek - 1) * 7);
            const endOfWeek = addDays(startOfWeek, 6);
  
            const transformedReservations = response.data.map((reservation: any) => {
              const startDate = new Date(reservation.startTime);
              const endDate = new Date(reservation.endTime);
  
              return {
                id: reservation.id,
                laboratoryName: reservation.laboratory.name,
                date: format(startDate, "yyyy-MM-dd"), // Extraer solo la fecha en formato YYYY-MM-DD
                time: `${format(startDate, "h:mm a")} - ${format(endDate, "h:mm a")}`, // Formato de hora
                className: reservation.className,
                professorName: reservation.professorName,
              };
            });
  
            const filteredReservations = transformedReservations.filter((reservation: any) => {
              const reservationDate = reservation.date;
              const startDate = format(startOfWeek, "yyyy-MM-dd");
              const endDate = format(endOfWeek, "yyyy-MM-dd");
  
              return reservationDate >= startDate && reservationDate <= endDate;
            });
  
            setReservations(filteredReservations);
          } catch (error) {
            console.error("Error fetching reservations:", error);
          }
        };
  
        await fetchReservations(); // Actualizar las reservas
      }
  
      setIsCreatingReservation(false);
      setSelectedCell(null);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error saving reservation:", error.response || error.message);
      } else {
        console.error("Error saving reservation:", error);
      }
    }
  };
  
  const handleExportToExcel = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/reservation/export?laboratoryId=${selectedLaboratory}&week=${currentWeek}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
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

      <div className="laboratory-selector">
        <label>
          Laboratorio:
          <select
            value={selectedLaboratory || ""}
            onChange={(e) => setSelectedLaboratory(e.target.value)} // Ahora selecciona el nombre del laboratorio
          >
            <option value="" disabled>
              Seleccione un laboratorio
            </option>
            {laboratories.map((lab) => (
              <option key={lab.idLabortatory} value={lab.name}> {/* Usa el nombre como valor */}
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
            {weeks.map((week, index) => (
              <option key={index} value={index + 1}>
                Semana {index + 1} ({week})
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Calendario */}
      <Calendar
        reservations={reservations}
        startOfWeek={addDays(new Date(academicPeriod.startDate), (currentWeek - 1) * 7)}
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
        onSave={(reservation) =>
          handleSaveReservation({
            ...reservation,
            date: selectedCell?.day || "",
            time: `${selectedCell?.time || ""} - ${selectedCell?.endTime || ""}`,
          })
        }
        laboratories={laboratories}
        selectedDay={selectedCell?.day || ""}
        startTime={selectedCell?.time || ""}
        endTime={selectedCell?.endTime || ""}
        currentUser={currentUser || ""}
        selectedLaboratory={selectedLaboratory || ""}
        onLaboratoryChange={(labId) => setSelectedLaboratory(labId)}
        token={token || ""}
      />
    </div>
  );
}