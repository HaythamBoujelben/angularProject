import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Residence } from '../models/residence';
import { map } from 'rxjs/operators';



@Injectable({
  providedIn: 'root',
})
export class ResidenceService {

  private apiUrl = 'http://localhost:3000/residence';


  // Chemin vers ton fichier db.json

  constructor(private http: HttpClient) {}

  // Méthode pour récupérer la liste des résidences depuis db.json
  getResidences(): Observable<Residence[]> {
    return this.http.get<Residence[]>(this.apiUrl);
  }

  
  getResidenceById(id: string): Observable<Residence | undefined> {
    return this.http.get<Residence[]>(this.apiUrl).pipe(
      map((residences) => residences.find((residence) => residence.id === id))
    );
  }
  
  
  
}
