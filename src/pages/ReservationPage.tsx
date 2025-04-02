import React, { useState, useEffect, useContext } from "react";
import "../styles/ReservationPage.css";
import axios from "axios";
import { API_BASE_URL } from "../services/globals";
import { AuthContext } from "../context/AuthContext"; // Importa el contexto de autenticación
import Calendar from "../components/Calendar"; // Asegúrate de que esta ruta sea correcta
import ReservationCreateModal from "../components/ReservationCreateModal";
import { differenceInWeeks, addDays, format } from "date-fns"; // Importa funciones para manejar fechas
import ReservationEditModal from "../components/ReservationEditModal"; // Asegúrate de que esta ruta sea correcta


interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
}

interface Laboratory {
  idLabortatory: string;
  name: string;
  location: string; // Add the location property
}

interface Reservation {
  id?: string;
  laboratoryId?: string;
  date: string; // Fecha en formato YYYY-MM-DD
  time: string; // Hora en formato HH:mm
  startTime?: string; // Hora de inicio en formato ISO-8601
  endTime?: string; // Hora de fin en formato ISO-8601
  user?: string;
  className: string;
  professorName: string;
}

export default function ReservationPage() {
  const authContext = useContext(AuthContext); // Obtén el contexto de autenticación
  const token = authContext?.token;
  const currentUser = authContext?.user;
  const [user, setUser] = useState<User | null>(null);
  const [laboratories, setLaboratories] = useState<Laboratory[]>([]);
  const [selectedLaboratory, setSelectedLaboratory] = useState<string | null>(null);
  const [currentWeek, setCurrentWeek] = useState<number>(1);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isCreatingReservation, setIsCreatingReservation] = useState<boolean>(false);
  const [isEditingReservation, setIsEditingReservation] = useState<boolean>(false); // Nuevo estado para el modal de edición
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null); // Reserva seleccionada para editar
  const [selectedCell, setSelectedCell] = useState<{ day: string; time: string; endTime?: string } | null>(null);
  const [academicPeriod] = useState({
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
  
          console.log("Respuesta del backend:", response.data); // Log para verificar la respuesta del backend
  
          // Verificar si response.data es un arreglo
          if (!Array.isArray(response.data)) {
            console.error("Error: response.data no es un arreglo:", response.data);
            setReservations([]); // Asignar un arreglo vacío si no es un arreglo
            return;
          }
  
          // Transformar las reservas
          const transformedReservations = response.data.map((reservation: any) => {
            const startDate = new Date(reservation.startTime);
            const endDate = new Date(reservation.endTime);
  
            return {
              id: reservation.id,
              laboratoryName: reservation.laboratory.name,
              laboratoryId: reservation.laboratory.idLabortatory,
              user: reservation.user.username,
              date: format(startDate, "yyyy-MM-dd"), // Extraer solo la fecha en formato YYYY-MM-DD
              time: `${format(startDate, "h:mm a")} - ${format(endDate, "h:mm a")}`, // Formato de hora
              className: reservation.className,
              professorName: reservation.professorName,
            };
          });
  
          console.log("Reservas transformadas:", transformedReservations);
  
          // Filtrar las reservas por la semana actual
          const startOfWeek = addDays(new Date(academicPeriod.startDate), (currentWeek - 1) * 7);
          const endOfWeek = addDays(startOfWeek, 6);
  
          const filteredReservations = transformedReservations.filter((reservation: any) => {
            const reservationDate = reservation.date;
            const startDate = format(startOfWeek, "yyyy-MM-dd");
            const endDate = format(endOfWeek, "yyyy-MM-dd");
  
            return reservationDate >= startDate && reservationDate <= endDate;
          });
  
          console.log("Reservas transformadas y filtradas:", filteredReservations);
          setReservations(filteredReservations);
        } catch (error) {
          console.error("Error fetching reservations:", error); // Mostrar errores en la consola
          setReservations([]); // Asignar un arreglo vacío en caso de error
        }
      };
  
      fetchReservations();
    }
  },[currentWeek, token]);

    useEffect(() => {
    async function fetchUser() {
      try {
        if (currentUser) {
          const response = await axios.get(`${API_BASE_URL}/api/v1/user/getByUsername/${currentUser}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUser(response.data); // Guarda el usuario en el estado
        } else {
          console.warn("El valor de 'currentUser' es nulo o indefinido."); // Log para casos donde currentUser no está definido
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    }
  
    fetchUser();
  }, [currentUser, token]);

  const handleCreateReservation = (day: string, time: string) => {
    const [startTime, endTime] = time.split(" - "); // Divide el rango en hora de inicio y fin
    setSelectedCell({ day, time: startTime, endTime }); // Guarda tanto la hora de inicio como la hora de fin
    setIsCreatingReservation(true);
  };

  const handleEditReservation = (reservation: Reservation) => {
    setSelectedReservation(reservation);
  
    // Configura la celda seleccionada basada en la reserva
    const [startTime, endTime] = reservation.time.split(" - "); // Divide el rango de tiempo en inicio y fin
    setSelectedCell({
      day: reservation.date, // Usa la fecha de la reserva
      time: startTime,       // Hora de inicio
      endTime: endTime,      // Hora de fin
    });
  
    setIsEditingReservation(true);
  };

  const handleSaveEditedReservation = async (updatedReservation: Reservation) => {
    try {
      if (!selectedReservation) {
        console.error("No hay una reserva seleccionada para editar.");
        return;
      }

      if(!selectedCell){
        console.error("No hay una celda seleccionada para editar.");
        return;
      }
      
      const date = selectedCell.day; // Fecha seleccionada
      const startTime = `${date}T${convertTo24HourFormat(selectedCell.time)}`; // Hora de inicio en formato ISO-8601
      const endTime = `${date}T${convertTo24HourFormat(selectedCell.endTime || "00:00")}`; // Hora de fin en formato ISO-8601

      const payload = {
        id: selectedReservation.id, // Usa el ID de la reserva seleccionada
        laboratory: {
          idLabortatory: selectedReservation.laboratoryId,
          name: laboratories.find((lab) => lab.idLabortatory === selectedReservation.laboratoryId)?.name || "",
          location: laboratories.find((lab) => lab.idLabortatory === selectedReservation.laboratoryId)?.location || "",
        },
        startTime: startTime, // Usa el valor actualizado o el original
        endTime: endTime, // Usa el valor actualizado o el original
        user: user, // Objeto completo del usuario
        className: updatedReservation.className || selectedReservation.className, // Usa el valor actualizado o el original
        professorName: updatedReservation.professorName || selectedReservation.professorName, // Usa el valor actualizado o el original
      };

      console.log("Datos enviados al backend para editar la reserva:", payload);
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/reservation/update`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Reserva actualizada:", response.data);
      console.log("Respuesta del backend al editar la reserva:", response.data);
      setReservations((prev) =>
        prev.map((res) => (res.id === updatedReservation.id ? updatedReservation : res))
      );
      setIsEditingReservation(false);
    } catch (error) {
      console.error("Error updating reservation:", error);
    }
  };

  const handleDeleteReservation = async (id: string) => {
    try {
      console.log("Intentando eliminar la reserva con ID:", id);
      await axios.delete(`${API_BASE_URL}/api/v1/reservation/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Reserva eliminada:", id);
      setReservations((prev) => prev.filter((res) => res.id !== id));
      setIsEditingReservation(false);
    } catch (error) {
      console.error("Error deleting reservation:", error);
    }
  };

  const handleSaveReservation = async (reservation: Reservation) => {
    try {
      console.log(currentUser);
      if (!user) {
        console.error("El objeto 'user' no está disponible. No se puede crear la reserva.");
        return;
      }
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
        user: user,
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
  
      console.log("Reserva creada:", response.data);
  
      // Llamar a fetchReservations para sincronizar las reservas
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
                laboratoryId: reservation.laboratory.idLabortatory,
                user: reservation.user.username,
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
        reservations={reservations.map((reservation) => ({
          ...reservation,
          laboratoryId: reservation.laboratoryId || "", // Ensure laboratoryId is always a string
          user: reservation.user || "Unknown User", // Provide a default value for user
        }))}
        startOfWeek={addDays(new Date(academicPeriod.startDate), (currentWeek - 1) * 7)}
        onCellClick={(day, time) => handleCreateReservation(day, time)}
        onReservationClick={(reservation) => handleEditReservation(reservation)} // Cambia esto para usar la función de edición
      />

      {/* Modal para Crear Reservas */}
      <ReservationCreateModal
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

        token={token || ""}
      />

      {/* Modal para Editar Reservas */}
      {selectedReservation && (
        <ReservationEditModal
          isOpen={isEditingReservation}
          onClose={() => setIsEditingReservation(false)}
          reservation={{
            ...selectedReservation,
            id: selectedReservation?.id || "",
            laboratoryId: selectedReservation?.laboratoryId || "", // Asegúrate de que laboratoryId sea un string
            user: selectedReservation?.user || "defaultUser", // Provide a default value for user
          }}
          onSave={handleSaveEditedReservation}
          onDelete={handleDeleteReservation}
        />
      )}
    </div>
  );
}