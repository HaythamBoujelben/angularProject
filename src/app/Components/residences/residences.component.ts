import { Component, OnInit, OnDestroy } from '@angular/core';
import { Residence } from '../../models/residence';
import { ResidenceService } from '../../services/residence.service';
import { ResidenceConsumerService } from 'src/app/services/residence-consumer.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-residences',
  templateUrl: './residences.component.html',
  styleUrls: ['./residences.component.css'],
})
export class ResidencesComponent implements OnInit, OnDestroy {
  title: string = 'Gestion des Résidences';
  residences: Residence[] = [];
  selectedResidence!: Residence;
  hide: boolean = true;
  searchText: string = '';
  editMode: boolean = false;
  editedResidence!: Residence;
  private subscription!: Subscription;

  userRole: string = '';

  constructor(
    private _residenceService: ResidenceService,
    private _residenceConsumer: ResidenceConsumerService,
    private _router: Router,
    private _authService: AuthService
  ) {}

  ngOnInit(): void {
    // Récupération du rôle utilisateur
    this.userRole = this._authService.getUserRole();

    // Chargement des résidences via le service API
    this.subscription = this._residenceConsumer.fetchAll().subscribe({
      next: (residences: Residence[]) => {
        this.residences = residences;
      },
      error: (e) => {
        console.error(e);
        alert("Erreur lors du chargement des résidences.");
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  // 🔍 Filtrage dynamique
  filterByAddress(): Residence[] {
    return this.residences.filter((residence) =>
      residence.address.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  // 📍 Affichage localisation
  showLocation(r: Residence): void {
    this.selectedResidence = r;
    this.hide = false;
    this.editMode = false;
  }

  // ✏️ Activer le mode édition
  editResidence(residence: Residence): void {
    this.editedResidence = { ...residence }; // Clonage pour édition
    this.editMode = true;
    this.hide = false;
  }

  // 💾 Sauvegarder les modifications
  saveResidence(): void {
    if (!this.editedResidence || !this.editedResidence.id) {
      alert("Résidence invalide.");
      return;
    }

    this._residenceConsumer.update(this.editedResidence).subscribe({
      next: (updated: Residence) => {
        alert('✅ Résidence modifiée avec succès.');
        const index = this.residences.findIndex((r) => r.id === updated.id);
        if (index !== -1) {
          this.residences[index] = updated;
        }
        this.editMode = false;
        this.hide = true;
      },
      error: (err) => {
        console.error(err);
        alert("❌ Erreur lors de la modification.");
      }
    });
  }

  // 🗑️ Supprimer une résidence
  deleteResidence(id: string | number): void {
    if (!id) {
      alert("L'ID de la résidence est invalide.");
      return;
    }

    if (confirm('Êtes-vous sûr de vouloir supprimer cette résidence ?')) {
      this._residenceConsumer.remove(id).subscribe({
        next: () => {
          alert('🗑️ Résidence supprimée avec succès.');
          this.residences = this.residences.filter((r) => r.id !== id);
        },
        error: (err) => {
          console.error(err);
          alert('❌ Erreur lors de la suppression.');
        }
      });
    }
  }

  // Optimisation Angular : suivi par ID
  trackById(index: number, item: Residence): string {
    return item.id;
  }
}