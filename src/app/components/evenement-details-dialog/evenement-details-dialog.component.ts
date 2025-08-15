import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogActions } from '@angular/material/dialog';

@Component({
  selector: 'app-evenement-details-dialog',
  imports: [MatDialogContent, MatDialogActions , CommonModule],
  templateUrl: './evenement-details-dialog.component.html',
  styleUrl: './evenement-details-dialog.component.scss'
})
export class EvenementDetailsDialogComponent {
 constructor(
    public dialogRef: MatDialogRef<EvenementDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
    fileUrls: string[][] = [];
    fileNames: string[][] = [];


}
