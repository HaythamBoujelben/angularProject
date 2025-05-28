import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ResidenceService } from 'src/app/services/residence.service';
import { Residence } from 'src/app/models/residence';
import { AuthService } from 'src/app/services/auth.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-residence-details',
  templateUrl: './residence-details.component.html',
  styleUrls: ['./residence-details.component.css']
})
export class ResidenceDetailsComponent implements OnInit {
  residence!: Residence;
  userRole: string = '';
  isLoading: boolean = true;
  error: string = '';
  selectedImage: string = '';

  constructor(
    private route: ActivatedRoute,
    private residenceService: ResidenceService,
    private authService: AuthService,
    private titleService: Title
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isLoading = true;
      this.residenceService.getResidenceById(id).subscribe({
        next: (res) => {
          if (res) {
            this.residence = res;
            this.selectedImage = this.residence.image;
            // Mettre à jour le titre de la page avec le nom de la résidence
            this.titleService.setTitle(`${this.residence.name} | MyRentals`);
          }
          this.isLoading = false;
        },
        error: (err) => {
          this.error = 'Impossible de charger les détails de la résidence';
          this.isLoading = false;
          console.error('Erreur lors du chargement de la résidence:', err);
        }
      });
    }

    const currentUser = this.authService.getCurrentUser();
    this.userRole = currentUser ? currentUser.role : '';
  }

  isClientView(): boolean {
    return this.userRole === 'user' || this.userRole === '';
  }

  isAdminView(): boolean {
    return this.userRole === 'admin';
  }

  changeMainImage(imageUrl: string): void {
    this.selectedImage = imageUrl;
  }

  getStatusClass(): string {
    if (!this.residence) return '';
    
    const status = this.residence.status.toLowerCase();
    if (status.includes('disponible')) return 'status-available';
    if (status.includes('indisponible') || status.includes('complet')) return 'status-unavailable';
    if (status.includes('maintenance') || status.includes('rénovation')) return 'status-maintenance';
    
    return '';
  }
  
  // Si vous avez besoin de formatter des informations pour l'affichage
  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('fr-FR');
  }
}