import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { EvenementDTO } from 'src/app/Models/EvenementDTO';

@Component({
  selector: 'app-validation-rh-dialog',
 standalone: true,
  imports: [  CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatDialogModule,
    MatButtonModule,
   MatFormFieldModule,  // ✅ ajouté
    MatInputModule  ],
     
  templateUrl: './validation-rh-dialog.component.html',
  styleUrl: './validation-rh-dialog.component.scss'
})
export class ValidationRhDialogComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ValidationRhDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EvenementDTO
  ) {
    this.form = this.fb.group({
      idEvenement: [data.idEvenement],
      dateDebut: [data.dateDebut],
      dateFin: [data.dateFin],
      lieu: [data.lieu],
      cout: [data.cout],
      commentaireRh: ['']
    });
  }

  submit() {
    this.dialogRef.close(this.form.value);
  }
}
