import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Fournisseur } from 'src/app/Models/Fournisseur';
import { TypeFournisuer } from 'src/app/Models/type-fournisseur.model';
import { FournisseurServiceService } from 'src/app/services/fournisseur-service.service';
import { AjouterFournisseurDialogComponent } from '../ajouter-fournisseur-dialog/ajouter-fournisseur-dialog.component';
import { DocumentFournisseurDialogComponent } from '../document-fournisseur-dialog/document-fournisseur-dialog.component';
import { MatIcon } from '@angular/material/icon';



@Component({
  selector: 'app-listefournisseur',
  imports: [FormsModule , CommonModule,
    ReactiveFormsModule , MatIcon],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

  templateUrl: './listefournisseur.component.html',
  styleUrl: './listefournisseur.component.scss'
})
export class ListefournisseurComponent  implements OnInit {
  
  fournisseurs: Fournisseur[] = [];

  constructor(
    private fournisseurService: FournisseurServiceService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadFournisseurs();
  }

  loadFournisseurs() {
    this.fournisseurService.getAllFournisseurs().subscribe({
      next: data => this.fournisseurs = data,
      error: err => console.error(err)
    });
  }

  openAjouterDialog() {
    const dialogRef = this.dialog.open(AjouterFournisseurDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'refresh') {
        this.loadFournisseurs();
      }
    });
  }

  openDocumentDialog(f: Fournisseur) {
    this.dialog.open(DocumentFournisseurDialogComponent, {
      data: f
    });
  }
  selectedFournisseur: Fournisseur | null = null;

afficherDocuments(f: Fournisseur) {
  this.selectedFournisseur = f;
  this.fournisseurService.getDocumentsByFournisseur(f.id!).subscribe(docs => {
    this.selectedFournisseur!.documents = docs;
  });
}

}