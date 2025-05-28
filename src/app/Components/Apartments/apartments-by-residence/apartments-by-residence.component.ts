import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApartmentService } from 'src/app/services/apartment.service';
import { ResidenceService } from 'src/app/services/residence.service';
import { Apartment } from 'src/app/models/apartment';
import { Residence } from 'src/app/models/residence';

@Component({
  selector: 'app-apartments-by-residence',
  templateUrl: './apartments-by-residence.component.html',
  styleUrls: ['./apartments-by-residence.component.css'],
})
export class ApartmentsByResidenceComponent implements OnInit {
  apartments: Apartment[] = [];
  residences: Residence[] = [];

  constructor(
    private _activated: ActivatedRoute,
    private _apartmentService: ApartmentService,
    private _residenceService: ResidenceService
  ) {}

  ngOnInit(): void {
    const residenceId = this._activated.snapshot.params['id']; // Keep as string

    // Charger les résidences
    this._residenceService.getResidences().subscribe((res) => {
      this.residences = res;
    });

    // Charger les appartements filtrés par résidence
    this._apartmentService.getApartments().subscribe((data: Apartment[]) => {
      this.apartments = data.filter((a: Apartment) => a.ResidenceId === residenceId);
    });
  }

  // Méthode pour récupérer le nom de la résidence en fonction de son ID
  getResidence(ResidenceId: string | null | undefined): string {
    if (ResidenceId === null || ResidenceId === undefined) {
      return '---';
    }
    const residence = this.residences.find((res) => res.id === ResidenceId);
    return residence ? residence.name : '---';
  }
}