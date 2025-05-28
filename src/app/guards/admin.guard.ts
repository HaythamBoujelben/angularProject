// import { CanActivateFn } from "@angular/router";

// export const adminGuard: CanActivateFn = (route, state) => {
//   const userStr = localStorage.getItem('user');
  
//   if (userStr) {
//     try {
//       const user = JSON.parse(userStr);
//       console.log('Utilisateur récupéré dans guard:', user); // Log pour vérifier l'objet
//       if (user?.role === 'admin') {
//         return true;
//       }
//     } catch (e) {
//       console.error('Erreur lors du parsing de l\'utilisateur', e);
//     }
//   }
  
//   console.log('Accès refusé, utilisateur non autorisé');
//   return false;
// };
