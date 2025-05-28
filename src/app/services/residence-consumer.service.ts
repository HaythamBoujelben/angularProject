import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Residence } from '../models/residence';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ResidenceConsumerService {
  private ApiUrl: string = 'http://localhost:3000/residence';

  constructor(private http: HttpClient) {}

  

  // Récupérer toutes les résidences
  fetchAll(): Observable<Residence[]> {
    return this.http.get<Residence[]>(this.ApiUrl);
  }

  // Récupérer une résidence par ID
  fetchById(id: number): Observable<Residence> {
    return this.http.get<Residence>(`${this.ApiUrl}/${id}`);
  }

  // Ajouter une nouvelle résidence
  add(body: Residence): Observable<Residence> {
    return this.http.post<Residence>(this.ApiUrl, body);
  }

  // Mettre à jour une résidence
  update(residence: Residence): Observable<Residence> {
    return this.http.put<Residence>(`${this.ApiUrl}/${residence.id}`, residence);
  }

  // Supprimer une résidence
  remove(id: string | number): Observable<any> {
    return this.http.delete(`${this.ApiUrl}/${id}`);
  }
}
