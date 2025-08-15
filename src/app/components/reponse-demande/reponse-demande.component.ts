import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { EvenementService } from 'src/app/services/evenement.service';
import { ValidationRhDialogComponent } from '../validation-rh-dialog/validation-rh-dialog.component';
import { EvenementDTO } from 'src/app/Models/EvenementDTO';
import { DetailsValidationRhDialogComponent } from '../details-validation-rh-dialog/details-validation-rh-dialog.component';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-reponse-demande',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatDialogModule,
    MatButtonModule,
    MatPaginator
  ],
  templateUrl: './reponse-demande.component.html',
  styleUrls: ['./reponse-demande.component.scss']
})
export class ReponseDemandeComponent implements OnInit {

  demandes: any[] = [];
  commentaireMap: { [id: number]: string } = {};

  @ViewChild('dialogMessage') dialogMessageTpl!: TemplateRef<any>;
  dialogRef!: MatDialogRef<any>;

  constructor(
    private evenementService: EvenementService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadDemandes();
  }

  loadDemandes(): void {
    this.evenementService.getDemandesEnAttente().subscribe(data => {
      this.demandes = data;
    });
  }

  valider(id: number): void {
    this.evenementService.validerDemande(id).subscribe({
      next: () => {
        this.loadDemandes();
      },
      error: err => {
        console.error("Erreur validation", err);
      }
    });
  }

  rejeter(idEvenement: number): void {
    const commentaire = this.commentaireMap[idEvenement]?.trim() || '';

    if (!commentaire) {
      this.openDialog(); // Afficher le dialog Angular Material
      return;
    }

    this.evenementService.rejeterDemande(idEvenement, commentaire).subscribe({
      next: () => {
        this.loadDemandes();
      },
      error: error => {
        console.error("Erreur lors du rejet", error);
      }
    });
  }

  openDialog() {
    this.dialogRef = this.dialog.open(this.dialogMessageTpl, { width: '300px' });
  }

  closeDialog() {
    this.dialogRef.close();
  }

  // 🔁 Historique : En attente / Validés / Rejetés
  chargerDemandesEnAttente() {
    this.evenementService.getDemandesEnAttente().subscribe(data => {
      this.demandes = data;
    });
  }

  chargerDemandesValidees() {
    this.evenementService.getEvenementsValides().subscribe(data => {
      this.demandes = data;
    });
  }

  chargerDemandesRejetees() {
    this.evenementService.getEvenementsRejetes().subscribe(data => {
      this.demandes = data;
    });
  }
ouvrirDialogValidation(demande: EvenementDTO) {
  const dialogRef = this.dialog.open(ValidationRhDialogComponent, {
    width: '600px',
    data: demande
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.evenementService.validerDemandeAvecInfos(result.idEvenement, result)
        .subscribe(() => {
          this.chargerDemandesEnAttente();
        });
    }
  });
}


}
