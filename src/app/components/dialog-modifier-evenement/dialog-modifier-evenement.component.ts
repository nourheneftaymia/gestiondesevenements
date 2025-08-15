import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EvenementService } from 'src/app/services/evenement.service';

@Component({
  selector: 'app-dialog-modifier-evenement',
  imports: [      CommonModule,           
      ReactiveFormsModule],
  templateUrl: './dialog-modifier-evenement.component.html',
  styleUrl: './dialog-modifier-evenement.component.scss'
})
export class DialogModifierEvenementComponent {


  form: FormGroup;
  idEvenement: string;

  constructor(
    public dialogRef: MatDialogRef<DialogModifierEvenementComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private evenementService: EvenementService
  ) {
    this.form = this.fb.group({
      idEvenement: [data.idEvenement,Validators.required],
      titre: [data.titre, Validators.required],
      description: [data.description],
      dateDebut: [this.formatDate(data.dateDebut)],
      dateFin: [this.formatDate(data.dateFin)],
      lieu: [data.lieu],
      cout: [data.cout],
      categorieEvenement: [data.categorieEvenement],
      degreImportance: [data.degreImportance]
    });
  }

  ngOnInit(){
    this.idEvenement = this.data.idEvenement;
    console.log('ID événement dans ngOnInit:', this.idEvenement);  // <--- LOG ID

    this.form.patchValue({
      idEvenement: this.data.idEvenement,
      titre: this.data.titre,
      description: this.data.description,
      dateDebut: this.formatDate(this.data.dateDebut),
      dateFin: this.formatDate(this.data.dateFin),
      lieu: this.data.lieu,
      cout: this.data.cout,
      categorieEvenement: this.data.categorieEvenement,
      degreImportance: this.data.degreImportance
    });
  }

  onSubmit() {
    const formData = {
      ...this.form.value,
      dateDebut: new Date(this.form.value.dateDebut).toISOString(),
      dateFin: new Date(this.form.value.dateFin).toISOString()
    };

    console.log('ID envoyé à updateEvenement:', this.data.idEvenement);
    console.log('⏱ Données envoyées:', formData);

    this.evenementService.updateEvenement(this.data.idEvenement, formData).subscribe({
      next: () => {
        alert("✅ Événement modifié avec succès !");
        this.dialogRef.close(true);
      },
      error: () => alert("❌ Erreur lors de la modification")
    });
  }
  formatDate(date: string | Date | null | undefined): string {
  if (!date) return '';  // ou null, ou une valeur par défaut adaptée
  const d = new Date(date);
  if (isNaN(d.getTime())) {
    console.warn('Date invalide reçue dans formatDate:', date);
    return '';
  }
  return d.toISOString().split('T')[0]; // => 'YYYY-MM-DD'
}


  // Tableau des catégories (mêmes valeurs que l'enum Java)
categories = [
  'TEAM_BUILDING',
  'REUNION',
  'CONFERENCE',
  'SEMINAIRE',
  'ATELIER',
  'ANNIVERSAIRE_ENTREPRISE',
  'AUTRE'
];

// Fonction pour afficher un label plus lisible
formatCategorie(cat: string): string {
  return cat
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
}



 
}










