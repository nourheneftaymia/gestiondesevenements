import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
// Importer MatCardModule d'Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';


import { UserService } from '../../services/user.service';
import { EvenementService } from '../../services/evenement.service';
import { InvitationserviceService } from 'src/app/services/invitationservice.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-envoyer-invitation',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule
  ],
  schemas:[],
  templateUrl: './envoyer-invitation.component.html',
  styleUrls: ['./envoyer-invitation.component.scss']
})
export class EnvoyerInvitationComponent implements OnInit {

  invitationForm!: FormGroup;
  utilisateurs: any[] = [];
  evenements: any[] = [];

  constructor(
    private dialogRef: MatDialogRef<EnvoyerInvitationComponent>,
    private fb: FormBuilder,
    private invitationService: InvitationserviceService,
    private userService: UserService,
    private evenementService: EvenementService
  ) {}

  ngOnInit(): void {
    this.invitationForm = this.fb.group({
      idUser: [null, Validators.required],
      idEvenement: [null, Validators.required],
      message: ['', [Validators.required, Validators.minLength(5)]]
    });

    this.chargerUtilisateurs();
    this.chargerEvenements();
  }

  chargerUtilisateurs(): void {
    this.userService.getAll().subscribe({
      next: data => this.utilisateurs = data,
      error: err => console.error('Erreur lors du chargement des utilisateurs', err)
    });
  }

  chargerEvenements(): void {
    this.evenementService.getEvenementsValides().subscribe({
      next: data => this.evenements = data,
      error: err => console.error('Erreur lors du chargement des événements', err)
    });
  }
  annuler(): void {
  this.dialogRef.close();
}

  envoyer(): void {
    if (this.invitationForm.valid) {
      const invitationData = {
        ...this.invitationForm.value,
        statusInvitation: 'EN_ATTENTE'
      };
      console.log('Données à envoyer :', invitationData);

      this.invitationService.envoyerInvitation(invitationData).subscribe({
        next: res => console.log('Invitation envoyée !', res),
        error: err => console.error('Erreur lors de l\'envoi de l\'invitation', err)
      });

    } else {
      console.warn('Formulaire invalide');
    }
  }
  compareById = (option: any, value: any): boolean => option === value;
  compareByName = (option: any, value: any): boolean => option.name === value.name;
}
