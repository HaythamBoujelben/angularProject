import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  user: User = {
    name: '',
    email: '',
    password: '',
    mobile : '',
    role: 'user' // rôle par défaut
  };
  
  rememberMe = false;
  isLoading = false;

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    this.isLoading = true;
  
    this.authService.login(this.user).subscribe(
      (response) => {
        this.isLoading = false;
  
        if (response) {
          const storage = this.rememberMe ? localStorage : sessionStorage;
          storage.setItem('user', JSON.stringify(response));
  
          // Vérifie ici ce qui est enregistré
          console.log('Utilisateur enregistré:', response);  // Log de l'utilisateur enregistré
  
          // Redirection en fonction du rôle
          const role = this.authService.getUserRole();
          console.log('Rôle de l\'utilisateur:', role);  // Log du rôle
          if (role === 'admin') {
            this.router.navigate(['admin/dashboard']);
          } else {
            this.router.navigate(['/home']);
          }
        } else {
          this.showErrorNotification('Email ou mot de passe incorrect');
        }
      },
      (error) => {
        this.isLoading = false;
        console.error('Erreur de connexion:', error);
        this.showErrorNotification('Erreur de connexion, veuillez vérifier vos informations');
      }
    );
  }
  
  

  showErrorNotification(message: string) {
    // Implémentation simple d'une notification d'erreur
    // Dans un projet réel, vous pourriez utiliser un service de notification ou une bibliothèque
    const notification = document.createElement('div');
    notification.className = 'error-notification';
    notification.innerHTML = `
      <i class="fas fa-exclamation-circle"></i>
      <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Affiche l'animation
    setTimeout(() => {
      notification.classList.add('show');
    }, 10);
    
    // Retire après 3 secondes
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }
  togglePasswordVisibility(event: Event) {
    event.preventDefault();
    const passwordInput = document.getElementById('password') as HTMLInputElement;
    const passwordToggle = event.target as HTMLElement;
  
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      passwordToggle.classList.remove('fa-eye');
      passwordToggle.classList.add('fa-eye-slash');
    } else {
      passwordInput.type = 'password';
      passwordToggle.classList.remove('fa-eye-slash');
      passwordToggle.classList.add('fa-eye');
    }
  }
  
}