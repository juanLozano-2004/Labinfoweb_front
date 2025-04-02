import React from "react";
import "../styles/Calendar.css";
import { format, addDays, startOfWeek } from "date-fns";
import { es } from "date-fns/locale";

interface Reservation {
  id?: string;
  date: string; // Fecha en formato YYYY-MM-DD
  time: string; // Intervalo de tiempo en formato "7:00 AM - 8:30 AM"
  className: string;
  professorName: string;
  laboratoryId: string;
  user: string;
}

interface CalendarProps {
  reservations: Reservation[];
  startOfWeek: Date; // Fecha de inicio de la semana actual
  onCellClick: (day: string, time: string) => void;
  onReservationClick: (reservation: Reservation) => void; // Función para manejar clics en reservas
}

export default function Calendar({ reservations, startOfWeek: initialStartOfWeek, onCellClick,onReservationClick }: CalendarProps) {
  // Asegurarse de que la semana comience en Lunes
  const startOfWeekMonday = startOfWeek(initialStartOfWeek, { locale: es });

  // Calcular las fechas de la semana actual (Lunes a Sábado)
  const weekDays = Array.from({ length: 6 }, (_, i) => addDays(startOfWeekMonday, i));
  const intervals = [
    "7:00 AM - 8:30 AM",
    "8:30 AM - 10:00 AM",
    "10:00 AM - 11:30 AM",
    "11:30 AM - 1:00 PM",
    "1:00 PM - 2:30 PM",
    "2:30 PM - 4:00 PM",
    "4:00 PM - 5:30 PM",
    "5:30 PM - 7:00 PM",
  ];

  // Capitalizar la primera letra de los días
  const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

  return (
    <div className="calendar">
      <table>
        <thead>
          <tr>
            <th>Hora</th>
            {weekDays.map((day, index) => (
              <th key={index}>
                {capitalize(format(day, "EEEE", { locale: es }))} <br />
                {format(day, "dd/MM/yyyy")}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {intervals.map((interval) => (
            <tr key={interval}>
              <td>{interval}</td>
              {weekDays.map((day) => {
                const reservation = reservations.find(
                  (res) =>
                    res.date === format(day, "yyyy-MM-dd") && res.time === interval
                );

                return (
                  <td
                    key={`${format(day, "yyyy-MM-dd")}-${interval}`}
                    className={`calendar-cell ${reservation ? "reserved" : ""}`}
                    onClick={() =>
                      reservation
                        ? onReservationClick(reservation) // Llama a onReservationClick si hay una reserva
                        : onCellClick(format(day, "yyyy-MM-dd"), interval) // Llama a onCellClick si no hay reserva
                    }
                  >
                    {reservation ? (
                      <div className="reservation">
                        <strong>{reservation.className}</strong>
                        <br />
                        <span>{reservation.professorName}</span>
                      </div>
                    ) : null}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}