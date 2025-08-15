import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MaterialModule } from '../../material.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { EvenementService } from 'src/app/services/evenement.service';
import { DialogModifierEvenementComponent } from '../dialog-modifier-evenement/dialog-modifier-evenement.component';
import { DemandeComponent } from '../demande/demande.component';
import { CommentaireDialogComponent } from '../commentaire-dialog/commentaire-dialog.component';
import { DetailsValidationRhDialogComponent } from '../details-validation-rh-dialog/details-validation-rh-dialog.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-demandeevent',
  imports: [
    CommonModule,
    MatCardModule,
    MaterialModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './demandeevent.component.html',
   schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styleUrls: ['./demandeevent.component.scss']  
})
export class DemandeeventComponent implements OnInit {
  isDialogOpen = false;
  evenementForm!: FormGroup;
  evenements: any[] = [];

  constructor(
    private evenementService: EvenementService,
    private fb: FormBuilder,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.evenementForm = this.fb.group({
      titre: [''],
      description: [''],
      dateDebut: [''],
      dateFin: [''],
      lieu: [''],
      degreImportance: [''],
      cout: [''],
      categorieEvenement: ['']
    });

    this.loadEvenements();
  }

  envoyerDemande(): void {
    const formValue = this.evenementForm.value;

    const evenement = {
      idEvenement: formValue.idEvenement,
      titre: formValue.titre,
      description: formValue.description,
      dateDebut: new Date(formValue.dateDebut).toISOString(),
      dateFin: new Date(formValue.dateFin).toISOString(),
      lieu: formValue.lieu,
      degreImportance: formValue.degreImportance,
      cout: formValue.cout,
      categorieEvenement: formValue.categorieEvenement
    };

    this.evenementService.demanderEvenement(evenement).subscribe({
      next: (res: any) => {
        console.log('Demande envoyée avec succès', res);
        this.loadEvenements();
      },
      error: (err: any) => {
        console.error('Erreur lors de l\'envoi', err);
      }
    });
  }

  loadEvenements(): void {
    this.evenementService.getMesDemandes().subscribe({
      next: (data) => {
        console.log('Evenements chargés:', data);
        this.evenements = Array.isArray(data) ? data : [];
        if (!Array.isArray(data)) {
          console.warn('Données reçues incorrectes:', data);
        }
      },
      error: (err: any) => {
        this.evenements = [];
        console.error('Erreur chargement événements', err);
      }
    });
  }

  openAjoutDialog(): void {
    this.isDialogOpen = true;

    const dialogRef = this.dialog.open(DemandeComponent, {
      width: '600px',
    });

    dialogRef.afterClosed().subscribe(result => {
      this.isDialogOpen = false;
      if (result === true) this.loadEvenements();
    });
  }

ouvrirDialogModification(event: any): void {
  console.log('Event reçu pour modification:', event);

  const dialogRef = this.dialog.open(DialogModifierEvenementComponent, {
    width: '500px',
    data: event
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result === 'updated') {
      this.loadEvenements();

      // Afficher la popup SweetAlert2 ici
      Swal.fire({
        icon: 'success',
        title: 'Modifié !',
        text: '✅ Événement modifié avec succès !',
        timer: 2000,
        showConfirmButton: false
      });
    }
  });
}


  updateEventStatus(id: number, status: string, commentaire: string) {
    const index = this.evenements.findIndex(e => e.idEvenement === id);
    if (index !== -1) {
      this.evenements[index].status = status;
      this.evenements[index].commentaireRh = commentaire;
    }
  }

  ouvrirDialogCommentaire(commentaire: string): void {
    this.dialog.open(CommentaireDialogComponent, {
      width: '300px',
      data: { commentaire }
    });
  }

  ouvrirDialogDetailValidation(demande: any) {
    this.dialog.open(DetailsValidationRhDialogComponent, {
      width: '500px',
      data: demande
    });
  }

  supprimerEvenement(id: number, status: string): void {
  if (status !== 'EN_ATTENTE') {
    Swal.fire({
      icon: 'warning',
      title: 'Action non autorisée',
      text: '❌ Vous ne pouvez supprimer que les demandes en attente.',
    });
    return;
  }

  Swal.fire({
    title: 'Êtes-vous sûr ?',
    text: "Cette action est irréversible !",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Oui, supprimer !',
    cancelButtonText: 'Annuler'
  }).then((result) => {
    if (result.isConfirmed) {
      this.evenementService.supprimerEvenement(id).subscribe({
        next: () => {
          this.loadEvenements(); // recharge la liste
          Swal.fire('Supprimé !', 'L\'événement a été supprimé avec succès.', 'success');
        },
        error: (err: any) => {
          console.error('Erreur suppression', err);
          Swal.fire('Erreur !', 'La suppression a échoué.', 'error');
        }
      });
    }
  });
}

  getStatusClass(status: string): string {
  switch (status) {
    case 'VALIDEE':
      return 'status-validée';
    case 'REFUSEE':
      return 'status-refusée';
    case 'EN_ATTENTE':
      return 'status-attente';
    default:
      return 'status-inconnu';
  }
}

}
