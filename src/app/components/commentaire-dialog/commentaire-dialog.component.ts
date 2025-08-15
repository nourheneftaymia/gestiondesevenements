import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-commentaire-dialog',
  imports: [MatDialogModule],
  templateUrl: './commentaire-dialog.component.html',
  styleUrl: './commentaire-dialog.component.scss'
})
export class CommentaireDialogComponent {
  commentaire: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.commentaire = data.commentaire;
  }
}
