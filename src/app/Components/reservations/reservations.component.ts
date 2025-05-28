import { Component, OnInit } from '@angular/core';
import { ApartmentService } from 'src/app/services/apartment.service';
import { ResidenceService } from 'src/app/services/residence.service';
import { ReservationService } from 'src/app/services/reservation.service';
import { AuthService } from 'src/app/services/auth.service';
import { Apartment } from 'src/app/models/apartment';
import { Residence } from 'src/app/models/residence';
import { Reservation } from 'src/app/models/reservation';

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.css']
})
export class ReservationsComponent implements OnInit {
  reservations: Reservation[] = [];
  apartments: Apartment[] = [];
  residences: Residence[] = [];
  isAdmin: boolean = false;

  constructor(
    private _apartmentService: ApartmentService,
    private _residenceService: ResidenceService,
    private _reservationService: ReservationService,
    private _authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isAdmin = this._authService.getRole() === 'admin';
    this.loadResidences();
    this.loadApartments();
  }

  loadResidences() {
    this._residenceService.getResidences().subscribe((res) => {
      this.residences = res;
    });
  }

  loadApartments() {
    this._apartmentService.getApartments().subscribe((apartments) => {
      this.apartments = apartments;
      this.loadReservations(); // Ensure reservations load after apartments
    });
  }

  loadReservations() {
    const userId = this._authService.getUserId();
    if (this.isAdmin) {
      this._reservationService.getReservations().subscribe((reservations: Reservation[]) => {
        this.reservations = reservations;
      });
    } else if (userId) {
      this._reservationService.getReservationsByUserId(userId).subscribe((reservations: Reservation[]) => {
        this.reservations = reservations;
      });
    }
  }

  getApartment(apartmentId: number): Apartment | undefined {
    return this.apartments.find(a => a.id === apartmentId);
  }

  getResidence(ResidenceId: string | null | undefined): string {
    if (ResidenceId === null || ResidenceId === undefined) {
      return '---';
    }
    const residence = this.residences.find((res) => res.id === ResidenceId);
    return residence ? residence.name : '---';
  }
}