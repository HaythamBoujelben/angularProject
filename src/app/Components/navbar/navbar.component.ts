import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Notification } from 'src/app/models/notification';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  isScrolled = false;

  // ✅ Notifications
  notifications: Notification[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {
    this.loadNotifications(); // ✅ Charger les notifications dès l'ouverture
  }

  // ✅ Chargement des notifications non lues
  loadNotifications() {
    const user = this.getUserInfo();
    if (user) {
      this.notificationService.getNotifications(user.id).subscribe((data) => {
        this.notifications = data.filter(n => !n.read);
      });
    }
  }

  // ✅ Marquer une notification comme lue
  markNotificationAsRead(notification: Notification) {
    this.notificationService.markAsRead(notification.id).subscribe(() => {
      notification.read = true;
      this.notifications = this.notifications.filter(n => !n.read);
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 10;
    const navbar = document.querySelector('.navbar');
    if (navbar) {
      if (this.isScrolled) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
  }

  logout() {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      this.authService.logout();
      this.router.navigate(['/login']);
    }
  }

  isLoggedIn(): boolean {
    return !!(localStorage.getItem('user') || sessionStorage.getItem('user'));
  }

  getUserInfo() {
    const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  }

  getHomeLink(): string {
    if (this.isLoggedIn()) {
      const user = this.getUserInfo();
      if (user && user.role === 'admin') {
        return '/admin/dashboard';
      }
    }
    return '/home';
  }

  isAdmin(): boolean {
    return this.authService.getUserRole() === 'admin';
  }

  isUser(): boolean {
    return this.authService.getUserRole() === 'user';
  }
}
