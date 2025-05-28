import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApartmentService } from 'src/app/services/apartment.service';
import { ResidenceService } from 'src/app/services/residence.service';
import { ReservationService } from 'src/app/services/reservation.service';
import { Apartment } from 'src/app/models/apartment';
import { Residence } from 'src/app/models/residence';
import { Reservation } from 'src/app/models/reservation';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-apartments',
  templateUrl: './apartments.component.html',
  styleUrls: ['./apartments.component.css'],
})
export class ApartmentsComponent implements OnInit {
  apartments: Apartment[] = [];
  residences: Residence[] = [];
  selectedApartment: Apartment | null = null;
  isAdmin: boolean = false;
  isUser: boolean = false;
  isLoggedIn: boolean = false;

  constructor(
    private _apartmentService: ApartmentService,
    private _residenceService: ResidenceService,
    private _reservationService: ReservationService,
    private _authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkUserRole();
    this.loadApartments();
    this._residenceService.getResidences().subscribe((res) => {
      this.residences = res;
    });
  }

  checkUserRole() {
    const role = this._authService.getRole();
    this.isAdmin = role === 'admin';
    this.isUser = role === 'user';
    this.isLoggedIn = this._authService.isLoggedIn();
  }

  loadApartments() {
    this._apartmentService.getApartments().subscribe((apartments) => {
      this.apartments = apartments;
    });
  }

  showDetails(apartment: Apartment) {
    this.selectedApartment = { ...apartment };
  }

  getResidence(ResidenceId: string | null | undefined): string {
    if (ResidenceId === null || ResidenceId === undefined) {
      return '---';
    }
    const residence = this.residences.find((res) => res.id === ResidenceId);
    return residence ? residence.name : '---';
  }

  deleteApartment(id: number | undefined) {
    if (id !== undefined) {
      this._apartmentService.deleteApartment(id).subscribe(() => {
        this.loadApartments();
        this.selectedApartment = null;
      });
    }
  }

  updateApartment(): void {
    if (this.selectedApartment) {
      if (!this.selectedApartment.apartNum || !this.selectedApartment.floorNum || !this.selectedApartment.category || !this.selectedApartment.ResidenceId) {
        alert('Veuillez remplir tous les champs requis.');
        return;
      }

      this._apartmentService.updateApartment(this.selectedApartment).subscribe(
        (updatedApartment) => {
          const index = this.apartments.findIndex(a => a.id === updatedApartment.id);
          if (index !== -1) {
            this.apartments[index] = updatedApartment;
          }
          alert('Appartement mis à jour avec succès');
          this.selectedApartment = null;
        },
        (error: any) => {
          console.error('Erreur lors de la mise à jour', error);
          alert('Erreur lors de la mise à jour');
        }
      );
    }
  }

  reserveApartment(apartment?: Apartment) {
    const userId = this._authService.getUserId();
    const apartmentToReserve = apartment || this.selectedApartment;
    const apartmentId = apartmentToReserve?.id;

    if (!this._authService.isLoggedIn() || !userId) {
      alert('Vous devez être connecté pour réserver.');
      return;
    }

    if (apartmentId) {
      const reservation: Reservation = {
        id: 0,
        apartmentId,
        userId,
        dateReservation: new Date(),
        status: 'pending'
      };

      this._reservationService.createReservation(reservation).subscribe(
        () => {
          alert('Réservation envoyée avec succès !');
          if (!this.isAdmin) {
            const modal = document.getElementById('apartmentDetailsModal');
            if (modal) {
              modal.classList.remove('show');
              modal.style.display = 'none';
              document.body.classList.remove('modal-open');
              const backdrop = document.querySelector('.modal-backdrop');
              if (backdrop) backdrop.remove();
            }
            // Navigate to reservations page to see the updated list
            this.router.navigate(['/reservation']);
          }
        },
        (error: any) => {
          console.error('Erreur lors de la réservation', error);
          alert('Erreur lors de la réservation. Veuillez réessayer.');
        }
      );
    } else {
      alert('Aucun appartement sélectionné.');
    }
  }
}