// src/app/guards/auth.guard.ts
import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const user = localStorage.getItem('user');
  return !!user;  // true si l'utilisateur est connecté, false sinon
};