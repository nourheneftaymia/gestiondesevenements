import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { UserService } from 'src/app/services/user.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';

@Component({
  selector: 'app-modifieruser',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,   // ⬅️ OBLIGATOIRE pour *ngIf
        ReactiveFormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatSelectModule,
        MatOptionModule,
        MatNativeDateModule,
  ],
  templateUrl: './modifieruser.component.html',
  styleUrls: ['./modifieruser.component.scss']
})
export class ModifieruserComponent implements OnInit {

  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private dialogRef: MatDialogRef<ModifieruserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    console.log("Données reçues :", this.data); // DEBUG

    this.form = this.fb.group({
      nom: [this.data.nom || '', Validators.required],
      prenom: [this.data.prenom || '', Validators.required],
      email: [this.data.email || '', [Validators.required, Validators.email]],
      password: [this.data.password || '', Validators.required],
      idparent: [this.data.parent?.id || null],
      role: [this.data.role || '', Validators.required]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const updatedUser = this.form.value;
    this.userService.update(this.data.idUser, updatedUser).subscribe({
    next: (res) => {
      console.log("Réponse back-end :", res);  // optionnel pour debug
      this.dialogRef.close('updated');
    },
    error: err => {
      console.error('Erreur modification :', err);
      alert('Erreur lors de la modification');
    }
  });
  }
}
