export class Apartment {
  id!: number;
  apartNum!: number;
  floorNum!: number;
  surface!: number;
  terrace!: string;
  surfaceterrace!: number;
  category!: string;
  ResidenceId!: string; // Changed to string to match Residence.id
}