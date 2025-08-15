import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-detail-utilisateur-dialog',
  imports: [ MatDialogModule],
  templateUrl: './detail-utilisateur-dialog.component.html',
  styleUrl: './detail-utilisateur-dialog.component.scss'
})
export class DetailUtilisateurDialogComponent {
    constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

}
