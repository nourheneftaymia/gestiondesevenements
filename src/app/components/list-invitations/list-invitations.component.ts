import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { UserService } from '../../services/user.service';
import { EvenementService } from '../../services/evenement.service';

import { EnvoyerInvitationComponent } from '../envoyer-invitation/envoyer-invitation.component';


import { InvitationserviceService } from 'src/app/services/invitationservice.service';
import { DialogModifierInvitationComponent } from '../dialog-modifier-invitation/dialog-modifier-invitation.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-invitations',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatPaginatorModule,
    MatIconModule,
    MatTooltipModule,
   
  ],
  templateUrl: './list-invitations.component.html',
  styleUrls: ['./list-invitations.component.scss']
})
export class ListInvitationsComponent {
  invitations: any[] = [];
  utilisateurs: any[] = [];
  evenements: any[] = [];

  constructor(
    private dialog: MatDialog,
    private invitationService: InvitationserviceService,
    private userService: UserService,
    private evenementService: EvenementService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadInvitations();
    this.loadUtilisateurs();
    this.loadEvenements();
  }

  loadInvitations(): void {
    this.invitationService.getAllInvitationsAvecDetails().subscribe({
      next: data => this.invitations = data,
      error: err => console.error('Erreur chargement invitations', err)
    });
  }

  loadUtilisateurs(): void {
    this.userService.getAll().subscribe({
      next: data => this.utilisateurs = data,
      error: err => console.error('Erreur chargement utilisateurs', err)
    });
  }

  loadEvenements(): void {
    this.evenementService.getEvenementsValides().subscribe({
      next: data => this.evenements = data,
      error: err => console.error('Erreur chargement événements', err)
    });
  }

  openAjoutDialog(): void {
    const dialogRef = this.dialog.open(EnvoyerInvitationComponent, {
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) this.loadInvitations();
    });
  }

  

  ouvrirModifierInvitationDialog(invitation: any): void {
    const dialogRef = this.dialog.open(DialogModifierInvitationComponent, {
      width: '600px',
      data: {
        invitation,
        utilisateurs: this.utilisateurs,
        evenements: this.evenements
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const updatedInvitation = {
          ...invitation,
          ...result // contient les nouveaux champs : idUser, idEvenement, message
        };

        this.invitationService.modifierInvitation(updatedInvitation).subscribe({
          next: () => this.loadInvitations(),
          error: err => console.error('Erreur modification invitation', err)
        });
      }
    });
  }



supprimerInvitation(invitation: any): void {
  Swal.fire({
    title: 'Êtes-vous sûr ?',
    text: `Voulez-vous vraiment supprimer l'invitation pour ${invitation.nom} ${invitation.prenom} ?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Oui, supprimer',
    cancelButtonText: 'Annuler'
  }).then((result) => {
    if (result.isConfirmed) {
      this.invitationService.supprimerInvitation(invitation.idInvitation).subscribe({
        next: () => {
          this.invitations = this.invitations.filter(i => i.idInvitation !== invitation.idInvitation);
          Swal.fire('Supprimé !', 'L\'invitation a été supprimée avec succès.', 'success');
        },
        error: err => {
          console.error('Erreur lors de la suppression :', err);
          Swal.fire('Erreur', 'Échec de la suppression.', 'error');
        }
      });
    }
  });
}

}
