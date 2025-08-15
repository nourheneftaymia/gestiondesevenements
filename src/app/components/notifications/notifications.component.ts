import { Component, OnInit } from '@angular/core';

import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { EvenementService } from '../../services/evenement.service';
import { InvitationserviceService } from 'src/app/services/invitationservice.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

  invitations: any[] = [];
  idUser!: number;
  evenements: any[] = [];
  // Gérer le modal
  modalVisible = false;
  selectedInvitation: any = null;
  notificationListVisible = false;


  constructor(
    private invitationService: InvitationserviceService,
    private userService: UserService,
    private evenementService: EvenementService
  ) {}

  toggleNotificationList() {
  this.notificationListVisible = !this.notificationListVisible;
}

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.idUser = user.idUser;
        this.loadInvitations();
        this.loadEvenements();
      },
      error: (err) => {
        console.error('Erreur lors de la récupération de l\'utilisateur', err);
      }
    });
  }

  loadInvitations(): void {
    this.invitationService.getInvitationsByUser(this.idUser).subscribe({
      next: (data) => this.invitations = data,
      error: (err) => console.error('Erreur lors du chargement des invitations', err)
    });
  }

  loadEvenements(): void {
    this.evenementService.getEvenementsValides().subscribe({
      next: (data) => this.evenements = data,
      error: (err) => console.error('Erreur lors du chargement des événements', err)
    });
  }

  // Ouvre modal avec invitation sélectionnée
  ouvrirInvitation(invitation: any): void {
    this.selectedInvitation = invitation;
    this.modalVisible = true;
  }

  // Ferme modal
  fermerModal(): void {
    this.modalVisible = false;
    this.selectedInvitation = null;
  }

  validerInvitation(idInvitation: number): void {
    this.invitationService.validerInvitation(idInvitation).subscribe({
      next: (response) => {
        console.log('Invitation validée avec succès', response);
        this.fermerModal();
        this.loadInvitations(); // optionnel, recharge la liste
      },
      error: (error) => {
        console.error('Erreur lors de la validation', error);
      }
    });
  }

  rejeterInvitation(idInvitation: number): void {
    if (confirm('Confirmer le rejet de cette invitation ?')) {
      this.invitationService.rejeterInvitation(idInvitation).subscribe({
        next: (response) => {
          console.log('Invitation rejetée avec succès', response);
          this.fermerModal();
          this.loadInvitations(); // optionnel, recharge la liste
        },
        error: (error) => {
          console.error('Erreur lors du rejet', error);
        }
      });
    }
  }
}
