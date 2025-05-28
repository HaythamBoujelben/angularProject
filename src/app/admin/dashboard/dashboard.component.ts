import { Component, OnInit } from '@angular/core';
import { ResidenceConsumerService } from 'src/app/services/residence-consumer.service';
import { AuthService } from 'src/app/services/auth.service';  // Importer AuthService
import { Residence } from 'src/app/models/residence';
import { User } from 'src/app/models/user';  // Assurez-vous d'importer le modèle User

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  totalResidences = 0;
  totalAppartements = 0;
  totalClients = 0;  // Total des clients
  topResidences: { name: string, apartmentCount: number }[] = [];

  constructor(
    private _residenceConsumer: ResidenceConsumerService,
    private _authService: AuthService  // Injecter le service AuthService
  ) {}

  ngOnInit(): void {
    // Récupération des données des résidences
    this._residenceConsumer.fetchAll().subscribe({
      next: (residences: Residence[]) => {
        this.totalResidences = residences.length;
        this.totalAppartements = residences.reduce(
          (acc, r) => acc + (r.nbreAppartements || 0),
          0
        );

        this.topResidences = residences
          .map(r => ({
            name: r.name,
            apartmentCount: r.nbreAppartements || 0
          }))
          .sort((a, b) => b.apartmentCount - a.apartmentCount)
          .slice(0, 3);
      },
      error: (err) => {
        console.error('Erreur lors du chargement des résidences :', err);
      }
    });

    // Récupération des utilisateurs (clients)
    this._authService.getUsersByRole('user').subscribe({
      next: (users: User[]) => {
        this.totalClients = users.length;  // Nombre total de clients
      },
      error: (err) => {
        console.error('Erreur lors du chargement des utilisateurs :', err);
      }
    });
  }
}
