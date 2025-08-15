import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-dialog-modifier-invitation',
  imports: [    CommonModule,           
      ReactiveFormsModule,
      MatFormFieldModule,
      MatInputModule,
      MatSelectModule,
      MatDialogModule],
  templateUrl: './dialog-modifier-invitation.component.html',
  styleUrl: './dialog-modifier-invitation.component.scss'
})
export class DialogModifierInvitationComponent {
invitationForm!: FormGroup;
  utilisateurs: any[] = [];
  evenements: any[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DialogModifierInvitationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    // Initialisation des listes après que data est injecté
    this.utilisateurs = this.data.utilisateurs;
    this.evenements = this.data.evenements;

    this.invitationForm = this.fb.group({
      idUser: [this.data.invitation.idUser, Validators.required],
      idEvenement: [this.data.invitation.idEvenement, Validators.required],
      message: [this.data.invitation.message, [Validators.required, Validators.minLength(5)]],
    });
  }

  modifier(): void {
    if (this.invitationForm.valid) {
      this.dialogRef.close(this.invitationForm.value);
    }
  }

  compareById(o1: any, o2: any): boolean {
    return o1 === o2;
  }
  
}
