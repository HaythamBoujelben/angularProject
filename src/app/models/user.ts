// user.model.ts
export interface User {
    id?: number;
    name: string;
    email: string;
    password: string;
  mobile : string;
  role: 'user' | 'admin';  // Rôle de l'utilisateur
  dateInscription?: string;    
  dateNaissance?: string;         // pour connaître l'âge (facultatif)
  pieceIdentite?: string;         // numéro de CIN/passeport pour vérification
  photo?: string;                 // URL de la photo de profil
  statut?: 'actif' | 'inactif' ;  // état du compte 
  favoris?: number[];            // liste d'ID d’appartements favoris
  adresse?: string;               // Adresse de l'utilisateur (utile pour des cas admin ou profil)
  genre?: 'homme' | 'femme';   

  }
  