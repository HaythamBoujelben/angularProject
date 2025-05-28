import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Residence } from 'src/app/models/residence';  // Modèle Résidence
import { ResidenceService } from 'src/app/services/residence.service';  // Service pour récupérer les résidences

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  searchTerm: string = '';
  residences: Residence[] = [];
  filteredResidencesList: Residence[] = [];

  constructor(private residenceService: ResidenceService, private router: Router) {}

  ngOnInit() {
    this.residenceService.getResidences().subscribe(data => {
      this.residences = data;
      this.filteredResidencesList = [...this.residences];
    });
  }

  filterResidences() {
    if (this.searchTerm) {
      this.filteredResidencesList = this.residences.filter(residence =>
        residence.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        residence.address.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredResidencesList = [...this.residences];
    }
  }

  goToApartments(residenceId: string) {
   this.router.navigate([`details/${residenceId}`]);
   }

  filteredResidences() {
    return this.filteredResidencesList;
  }
}
