import { Apartment } from "./apartment";

export interface Reservation {
  id: number;
  apartmentId: number;
  userId: number;
  dateReservation: Date;
  status: string; // e.g., 'pending', 'confirmed', 'cancelled'
  apartment?: Apartment; // Optional: for joined apartment data
}