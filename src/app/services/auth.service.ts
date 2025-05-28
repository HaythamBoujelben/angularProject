import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { User } from '../models/user';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient) {}

  register(user: User): Observable<any> {
    return this.http.post(`${this.apiUrl}`, user);
  }

  login(user: User): Observable<User | null> {
    return this.http.get<User[]>(this.apiUrl).pipe(
      map(users => {
        const foundUser = users.find(u => u.email === user.email && u.password === user.password);
        if (foundUser) {
          // Store the user object in localStorage
          localStorage.setItem('user', JSON.stringify(foundUser));
        }
        return foundUser || null;
      }),
      catchError(() => {
        alert('Erreur de connexion, veuillez vérifier vos informations');
        return of(null);
      })
    );
  }

  getUserRole(): string {
    const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (!userStr) return '';
    try {
      const user = JSON.parse(userStr);
      return user?.role || '';
    } catch (e) {
      return '';
    }
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch (e) {
      return null;
    }
  }

  logout(): void {
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
  }

  getUsersByRole(role: 'user'): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl).pipe(
      map(users => users.filter(user => user.role === role)),
      catchError(() => {
        alert('Erreur lors de la récupération des utilisateurs');
        return of([]);
      })
    );
  }

  getRole(): string {
    const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (!userStr) return '';
    try {
      const user = JSON.parse(userStr);
      return user?.role || '';
    } catch (e) {
      return '';
    }
  }

  getUserId(): number | null {
    const user = this.getCurrentUser();
    return user ? user.id || null : null; // Extract id from the user object
  }

  isLoggedIn(): boolean {
    return !!this.getCurrentUser(); // Check if user object exists in storage
  }
}