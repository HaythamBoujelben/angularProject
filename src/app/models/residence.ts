export interface Residence {
    id: string;  
    name: string;
    address: string;
    image: string;
    status: string;
    floor: number; // Ajout du nombre d'étages
    nbreAppartements: number; // Ajout du nombre d'appartements
}
