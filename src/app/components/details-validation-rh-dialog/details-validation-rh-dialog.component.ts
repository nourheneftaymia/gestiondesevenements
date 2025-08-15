import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { EvenementDTO } from 'src/app/Models/EvenementDTO';

@Component({
  selector: 'app-details-validation-rh-dialog',
    standalone: true,
  imports: [ MatDialogModule,
      MatIconModule,
      MatInputModule,
    CommonModule],
  templateUrl: './details-validation-rh-dialog.component.html',
  styleUrl: './details-validation-rh-dialog.component.scss'
})
export class DetailsValidationRhDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}
