import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Fournisseur } from 'src/app/Models/Fournisseur';
import { FournisseurServiceService } from 'src/app/services/fournisseur-service.service';

@Component({
  selector: 'app-document-fournisseur-dialog',
  imports: [CommonModule , ReactiveFormsModule],
  templateUrl: './document-fournisseur-dialog.component.html',
  styleUrl: './document-fournisseur-dialog.component.scss'
})
export class DocumentFournisseurDialogComponent  implements OnInit {

  selectedFournisseur: Fournisseur;
  formDocument: FormGroup;
  fichier: File | null = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Fournisseur,
    private fournisseurService: FournisseurServiceService,
    private fb: FormBuilder
  ) {
    this.selectedFournisseur = data;
    this.formDocument = this.fb.group({
      commentaire: ['']
    });
  }

  ngOnInit(): void {
    this.loadDocuments();
  }

  loadDocuments(): void {
    if (!this.selectedFournisseur?.id) return;
    this.fournisseurService.getDocumentsByFournisseur(this.selectedFournisseur.id).subscribe(docs => {
      this.selectedFournisseur.documents = docs;
    });
  }

  onFileChange(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      this.fichier = event.target.files[0];
    } else {
      this.fichier = null;
    }
  }

  upload(): void {
    if (!this.fichier || !this.selectedFournisseur?.id) {
      alert('Veuillez sélectionner un fichier.');
      return;
    }

    const commentaire = this.formDocument.value.commentaire || '';

    this.fournisseurService.uploadDocument(this.selectedFournisseur.id, this.fichier, commentaire).subscribe(() => {
      this.loadDocuments();
      this.formDocument.reset();
      this.fichier = null;
    }, error => {
      console.error('Erreur lors de l\'upload:', error);
    });
  }
}
