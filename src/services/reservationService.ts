import { Reservation } from "@/model/Reservation";

export const getAllReservations = async (): Promise<Reservation[]> => {
    try {
        const response = await fetch('http://localhost:8080/api/reservation/get/all');
        if (!response.ok) {

            throw new Error("Error fetching all reservations");

        }
        const data = await response.json();
        return data.message;
    } catch (error) {
        throw new Error("Error fetching all reservations");
    }
};

export const saveReservation = async (reserva: Reservation): Promise<Reservation[]> => {
    try {
        const response = await fetch('http://localhost:8080/api/reservation/post/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reserva),
        });
        if (!response.ok) throw new Error("Error creating reservation");
        const data = await response.json();
        return data.message;
    } catch {
        throw new Error("Error creating reservation");
    }
};

// export const deleteReservation = async (id: string): Promise<{ success: boolean; message: string }> => {
//     try {
//         const response = await fetch('http://localhost:8080/api/reservation/delete/{id}',{
//             method: 'DELETE',
//         });
//         if (!response.ok) throw new Error("Error deleting reservation");
//         const data = await response.json();
//         return data.message;
//     } catch {
//         throw new Error("Error deleting reservation");
//     }
// }