import React from "react";
import "../styles/Calendar.css";

interface Reservation {
  id?: string;
  date: string; // Fecha en formato YYYY-MM-DD
  time: string; // Hora en formato HH:mm
  className: string;
  professorName: string;
}

interface CalendarProps {
  reservations: Reservation[];
  onCellClick: (day: string, time: string) => void;
}

export default function Calendar({ reservations, onCellClick }: CalendarProps) {
  const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
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

  return (
    <div className="calendar">
      <table>
        <thead>
          <tr>
            <th>Hora</th>
            {days.map((day) => (
              <th key={day}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {intervals.map((interval) => (
            <tr key={interval}>
              <td>{interval}</td>
              {days.map((day) => {
                // Buscar la reserva correspondiente al día y hora
                const reservation = reservations.find(
                  (res) => res.date === day && res.time === interval
                );

                return (
                  <td
                    key={`${day}-${interval}`}
                    className={`calendar-cell ${reservation ? "reserved" : ""}`}
                    onClick={() => onCellClick(day, interval)}
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