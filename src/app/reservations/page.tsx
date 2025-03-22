"use client";

import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer, Event } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Reservation } from "@/model/Reservation";
import { getAllReservations } from "@/services/reservationService";
import { title } from "process";

const localizer = momentLocalizer(moment);

interface CalendarEvent {
    id: number;
    title: string;
    start: Date;
    end: Date;
}

const ReservationCalendar = () => {
    const [events, setEvents] = useState<CalendarEvent[]>([]);

    // useEffect(() => {
    //     const fetchReservations = async () => {
    //         try {
    //             const data = await getAllReservations();
    //             const events = data.map(reservation => ({
    //                 id: parseInt(reservation.idReservation, 10),
    //                 title: reservation.laboratory + " " + reservation.className,
    //                 start: reservation.dateHour,
    //                 end: new Date(new Date().setHours(new Date().getHours() + 1.5))
    //             }));
    //             setEvents(events);
    //         } catch (error) {
    //             console.error("Error: can't get all reservations");
    //         }
    //     }
    //     fetchReservations();
    // }, []);

    useEffect(() => {
        setEvents([
            {
                id: 1,
                title: "Meeting",
                start: new Date(),
                end: new Date(new Date().setHours(new Date().getHours() + 1))
            }
        ]);
    }, []);

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Reservation Calendar</h2>
            <div className="bg-white p-4 rounded-lg shadow-md">
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 500 }}
                />
            </div>
        </div>
    );
};

export default ReservationCalendar;