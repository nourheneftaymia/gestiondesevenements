import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, inject, ViewChildren, ElementRef, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MaterialModule } from '../../material.module';
import { EvenementService } from 'src/app/services/evenement.service';

@Component({
  selector: 'app-dialog-modif-ev-final',
  standalone: true,
  templateUrl: './dialog-modif-ev-final.component.html',
  styleUrls: ['./dialog-modif-ev-final.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatDialogModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
     MatSelectModule, MatOptionModule, MaterialModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' }
  ]
})
export class DialogModifEvFinalComponent implements OnInit {
 

evenementForm!: FormGroup;
  imageEvenementFile?: File;
  fileNames: string[] = [];

  @ViewChildren('fileInput') fileInputs!: QueryList<ElementRef<HTMLInputElement>>;

  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<DialogModifEvFinalComponent>);
  private evenementService = inject(EvenementService);
  private data = inject(MAT_DIALOG_DATA); // doit contenir l'ID et les données de l'événement

  ngOnInit(): void {
    this.evenementForm = this.fb.group({
      titre: ['', Validators.required],
      description: [''],
      dateEvenement: ['', Validators.required],
      lieuEvenement: [''],
      cout: [0, [Validators.required, Validators.min(0)]],
      participantsIds: this.fb.array([]),
      fournisseurs: this.fb.array([]),
    });

    this.loadEvenementData(this.data);
  }

  get participantsArray(): FormArray {
    return this.evenementForm.get('participantsIds') as FormArray;
  }

  get fournisseursArray(): FormArray {
    return this.evenementForm.get('fournisseurs') as FormArray;
  }

  loadEvenementData(data: any) {
    this.evenementForm.patchValue({
      titre: data.titre,
      description: data.description,
      dateEvenement: new Date(data.dateEvenement),
      lieuEvenement: data.lieuEvenement,
      cout: data.cout
    });

    data.participants?.forEach((p: any) => this.participantsArray.push(this.fb.control(p.id)));
    data.fournisseurs?.forEach((f: any) => {
      const fournisseurGroup = this.fb.group({
        nom: [f.nom],
        email: [f.email],
        numero: [f.numero],
        type: [f.type],
        document: [null]
      });
      this.fournisseursArray.push(fournisseurGroup);
      this.fileNames.push(''); // placeholder pour fichier
    });
  }

  addParticipant(): void {
    this.participantsArray.push(this.fb.control('', Validators.required));
  }

  removeParticipant(index: number): void {
    this.participantsArray.removeAt(index);
  }

  addFournisseur(): void {
    const fournisseurGroup = this.fb.group({
      nom: [''],
      email: [''],
      numero: [''],
      type: [''],
      document: [null]
    });
    this.fournisseursArray.push(fournisseurGroup);
    this.fileNames.push('');
  }

  removeFournisseur(index: number): void {
    this.fournisseursArray.removeAt(index);
    this.fileNames.splice(index, 1);
  }

  triggerFileInput(index: number): void {
    const fileInput = this.fileInputs.toArray()[index];
    fileInput?.nativeElement.click();
  }

  onFileChange(event: Event, index: number): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      this.fournisseursArray.at(index).patchValue({
        document: file
      });
      this.fileNames[index] = file.name;
    }
  }

  onImageEvenementSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.imageEvenementFile = input.files[0];
    }
  }

  updateEvenementFinal(): void {
    if (this.evenementForm.invalid) {
      alert('Veuillez remplir tous les champs requis.');
      return;
    }

    const formData = new FormData();

    formData.append('titre', this.evenementForm.get('titre')?.value);
    formData.append('description', this.evenementForm.get('description')?.value || '');
    formData.append('dateEvenement', new Date(this.evenementForm.get('dateEvenement')?.value).toISOString().substring(0, 10));
    formData.append('lieuEvenement', this.evenementForm.get('lieuEvenement')?.value || '');
    formData.append('cout', this.evenementForm.get('cout')?.value.toString());

    if (this.imageEvenementFile) {
      formData.append('imageEvenement', this.imageEvenementFile, this.imageEvenementFile.name);
    }

    this.participantsArray.controls.forEach(ctrl => {
      formData.append('participantsIds', ctrl.value);
    });

    const fournisseursSansDocs = this.fournisseursArray.controls.map(fg => {
      const f = fg.value;
      return { nom: f.nom, email: f.email, numero: f.numero, type: f.type };
    });
    formData.append('fournisseurs', JSON.stringify(fournisseursSansDocs));

    this.fournisseursArray.controls.forEach((fg) => {
      const f = fg.value;
      if (f.document instanceof File) {
        formData.append('files', f.document);
      }
    });

    this.evenementService.updateEvenementFinal(this.data.id, formData).subscribe({
      next: () => {
        alert('✅ Événement mis à jour avec succès.');
        this.dialogRef.close(true);
      },
      error: err => {
        alert('Erreur lors de la mise à jour : ' + (err.error?.message || 'Inconnue'));
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

}
