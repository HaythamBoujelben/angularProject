import { Component, OnInit } from '@angular/core';
import { ApartmentService } from 'src/app/services/apartment.service';
import { ResidenceService } from 'src/app/services/residence.service';
import { Apartment } from 'src/app/models/apartment';
import { Residence } from 'src/app/models/residence';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-apartment',
  templateUrl: './add-apartment.component.html',
  styleUrls: ['./add-apartment.component.css']
})
export class AddApartmentComponent implements OnInit {
  apartmentForm: FormGroup;
  residences: Residence[] = [];
  errorMessage: string | null = null;

  constructor(
    private _apartmentService: ApartmentService,
    private _residenceService: ResidenceService,
    private _authService: AuthService,
    private fb: FormBuilder
  ) {
    this.apartmentForm = this.fb.group({
      apartNum: ['', Validators.required],
      floorNum: ['', Validators.required],
      surface: [0, [Validators.required, Validators.min(1)]],
      terrace: ['Non', Validators.required],
      surfaceterrace: [0],
      category: ['', Validators.required], // Initialize as empty string to match default option
      ResidenceId: ['', Validators.required] // Initialize as empty string to match default option
    });
  }

  ngOnInit(): void {
    this._residenceService.getResidences().subscribe((res) => {
      this.residences = res;
    });
  }

  onSubmit(): void {
    if (this.apartmentForm.valid) {
      const newApartment: Apartment = this.apartmentForm.value; // ResidenceId is already string

      // Vérifier si un appartement avec le même apartNum et ResidenceId existe
      this._apartmentService.getApartments().subscribe((apartments) => {
        const exists = apartments.some(
          (apt) => apt.apartNum === newApartment.apartNum && apt.ResidenceId === newApartment.ResidenceId
        );

        if (exists) {
          this.errorMessage = 'Un appartement avec ce numéro existe déjà dans cette résidence.';
          return;
        }

        // Ajouter l'appartement
        this._apartmentService.addApartment(newApartment).subscribe(
          () => {
            alert('Appartement ajouté avec succès !');
            this.apartmentForm.reset({ terrace: 'Non', surfaceterrace: 0, category: '', ResidenceId: '' });
            this.errorMessage = null;
          },
          (error) => {
            this.errorMessage = 'Erreur lors de l\'ajout de l\'appartement.';
            console.error(error);
          }
        );
      });
    }
  }

  get isAdmin(): boolean {
    return this._authService.getRole() === 'admin';
  }
}