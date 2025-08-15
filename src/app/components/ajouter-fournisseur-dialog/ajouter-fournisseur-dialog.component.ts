import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { formatRelative } from 'date-fns';
import { TypeFournisuer } from 'src/app/Models/type-fournisseur.model';
import { FournisseurServiceService } from 'src/app/services/fournisseur-service.service';

@Component({
  selector: 'app-ajouter-fournisseur-dialog',
  imports: [CommonModule , ReactiveFormsModule ,MatIcon, MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatSelectModule,],
  templateUrl: './ajouter-fournisseur-dialog.component.html',
  styleUrl: './ajouter-fournisseur-dialog.component.scss'
})
export class AjouterFournisseurDialogComponent {
  fournisseurForm: FormGroup;
  types = ['SECURITE', 'INFORMATIQUE', 'AUTRE']; // Enum simulé

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AjouterFournisseurDialogComponent>
  ) {
    this.fournisseurForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      numero: ['', Validators.required],
      type: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.fournisseurForm.valid) {
      const fournisseurData = this.fournisseurForm.value;
      // envoyer au backend ici
      this.dialogRef.close(fournisseurData);
    }
  }}