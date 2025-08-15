import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MaterialModule } from 'src/app/material.module';
import { EvenementService } from 'src/app/services/evenement.service';
import { MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-demande',
  imports: [
    CommonModule,
    MatCardModule,
    MaterialModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    ReactiveFormsModule
  ],
  templateUrl: './demande.component.html',
  styleUrl: './demande.component.scss'
})
export class DemandeComponent {
  evenementForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private evenementService: EvenementService,
    private dialogRef: MatDialogRef<DemandeComponent>
  ) {
    this.evenementForm = this.fb.group({
      titre: ['', Validators.required],
      description: ['', Validators.required],
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required],
      lieu: [''],
      degreImportance: [''],
      cout: [0],
      categorieEvenement: ['']
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.evenementForm.invalid) {
      return;
    }

    const formValue = this.evenementForm.value;

    const evenementDto = {
      titre: formValue.titre,
      description: formValue.description,
      dateDebut: new Date(formValue.dateDebut).toISOString(),
      dateFin: new Date(formValue.dateFin).toISOString(),
      lieu: formValue.lieu,
      degreImportance: formValue.degreImportance,
      cout: formValue.cout,
      categorieEvenement: formValue.categorieEvenement
    };

    this.evenementService.demanderEvenement(evenementDto).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Succès',
          text: "La demande d'événement a été envoyée avec succès !",
          confirmButtonColor: '#7F3FBF'
        }).then(() => {
          this.dialogRef.close(true); // ferme le dialog après OK
        });
        this.evenementForm.reset();
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: "Une erreur est survenue lors de l'envoi de la demande.",
          confirmButtonColor: '#d33'
        });
      }
    });
  }

  // Tableau des catégories
  categories = [
    'TEAM_BUILDING',
    'REUNION',
    'CONFERENCE',
    'SEMINAIRE',
    'ATELIER',
    'ANNIVERSAIRE_ENTREPRISE',
    'AUTRE'
  ];

  // Fonction pour afficher un label plus lisible
  formatCategorie(cat: string): string {
    return cat
      .toLowerCase()
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  }
}
