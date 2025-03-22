import { User } from "./User";

export interface Reservation {
    idReservation: string;
    laboratory: string;
    dateHour: Date;
    user: User;
    className: string;
    creationDate: Date;
}