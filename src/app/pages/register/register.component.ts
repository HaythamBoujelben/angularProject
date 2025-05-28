import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  user: User = {
    name: '',
    email: '',
    password: '',
    mobile: '',
    role: 'user',
    statut: 'actif',
    genre: 'homme',
    adresse: '',
    pieceIdentite: '',
    dateNaissance: '',
    photo: ''
  };

  showPassword = false;
  isSubmitting = false;
  photoPreview: string | ArrayBuffer | null = null;
  defaultPhoto = 'assets/default-user-icon.png';
  formSubmitted = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Initialiser les valeurs si nécessaire
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onRegister() {
    this.formSubmitted = true;
    
    if (this.isSubmitting) return;

    this.isSubmitting = true;
    this.user.dateInscription = new Date().toISOString();

    // Si l'utilisateur n'a pas sélectionné d'image, utiliser l'icône par défaut
    if (!this.photoPreview) {
      this.user.photo = this.defaultPhoto;
    }

    this.authService.register(this.user).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        
        // Animation de succès
        this.showSuccessMessage();
        
        // Redirection après un court délai
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.handleError(error);
      }
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Vérifier si c'est une image
      if (!file.type.match(/image\/(jpeg|jpg|png|gif)/)) {
        alert('Format de fichier non supporté. Veuillez sélectionner une image.');
        return;
      }
      
      // Vérifier la taille de l'image (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('L\'image est trop volumineuse. Taille maximale: 2MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.photoPreview = e.target.result;
        this.user.photo = e.target.result; // Stocker l'image en base64
      };
      reader.readAsDataURL(file);
    }
  }

  // Afficher un message de succès
  private showSuccessMessage() {
    // Implémenter une notification de succès
    console.log('Inscription réussie!');
    // Cette méthode pourrait être intégrée avec un service de notification
  }

  // Gérer les erreurs
  private handleError(error: any) {
    let errorMessage = 'Une erreur est survenue lors de l\'inscription';
    
    // Personnaliser le message d'erreur en fonction de la réponse
    if (error.status === 409) {
      errorMessage = 'Cette adresse email est déjà utilisée';
    } else if (error.status === 400) {
      errorMessage = 'Veuillez vérifier les informations saisies';
    }
    
    console.error('Erreur d\'inscription:', error);
    // Cette méthode pourrait être intégrée avec un service de notification
    alert(errorMessage);
  }
}