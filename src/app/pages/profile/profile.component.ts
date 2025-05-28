import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user!: User;
  originalUser!: User;
  editMode = false;
  saving = false;
  error = '';
  
  constructor(
    private authService: AuthService, 
    private http: HttpClient, 
    private router: Router
  ) {}
  
  ngOnInit(): void {
    const userData = this.authService.getCurrentUser();
    if (userData) {
      this.user = { ...userData };
      this.originalUser = { ...userData };
    } else {
      // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
      this.router.navigate(['/login']);
    }
  }
  
  getInitials(): string {
    if (!this.user?.name) return '';
    
    const nameParts = this.user.name.split(' ');
    if (nameParts.length > 1) {
      return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
    }
    return this.user.name.substring(0, 2).toUpperCase();
  }
  
  saveChanges() {
    // Vérification simple de la validité des champs
    if (!this.user.name || !this.user.email || !this.user.mobile) {
      this.error = 'Veuillez remplir tous les champs obligatoires';
      return;
    }
    
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailPattern.test(this.user.email)) {
      this.error = 'Adresse email invalide';
      return;
    }
    
    this.error = '';
    this.saving = true;
    
    // Mise à jour sur le serveur JSON
    this.http.put(`http://localhost:3000/users/${this.user.id}`, this.user)
      .pipe(finalize(() => this.saving = false))
      .subscribe(
        () => {
          // Mise à jour dans le stockage local
          localStorage.setItem('user', JSON.stringify(this.user));
          sessionStorage.setItem('user', JSON.stringify(this.user));
          
          // Mise à jour de l'original pour les futures annulations
          this.originalUser = { ...this.user };
          
          this.editMode = false;
        },
        (error) => {
          console.error('Erreur lors de la mise à jour du profil', error);
          this.error = 'Une erreur est survenue lors de l\'enregistrement. Veuillez réessayer.';
        }
      );
  }
  
  cancelEdit() {
    this.user = { ...this.originalUser };
    this.editMode = false;
    this.error = '';
  }
}