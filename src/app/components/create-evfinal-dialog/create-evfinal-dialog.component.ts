import { Component, ElementRef, OnInit, Optional, QueryList, ViewChildren, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { EvenementService } from 'src/app/services/evenement.service';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { UserService } from 'src/app/services/user.service';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-evfinal-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MaterialModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
  ],
  providers: [
    MatNativeDateModule,
    { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' }
  ],
  templateUrl: './create-evfinal-dialog.component.html',
  styleUrls: ['./create-evfinal-dialog.component.scss'],
})
export class CreateEVFinalDialogComponent implements OnInit {
  evenementForm!: FormGroup;
  utilisateurs: any[] = [];

  // Fichiers fournisseurs
  fileNames: string[][] = [];
  fileUrls: string[][] = [];

  // Images événement
  imageEvenementFiles: File[] = [];

  @ViewChildren('fileInput') fileInputs!: QueryList<ElementRef<HTMLInputElement>>;
  @ViewChild('imageInput') imageInput!: ElementRef<HTMLInputElement>;

  constructor(
    private fb: FormBuilder,
    private evenementService: EvenementService,
    private authService: AuthServiceService,
    private userService: UserService,
    @Optional() private dialogRef: MatDialogRef<CreateEVFinalDialogComponent>
  ) {}

  ngOnInit(): void {
    this.evenementForm = this.fb.group({
      titre: ['', Validators.required],
      description: [''],
      dateEvenement: ['', Validators.required],
      lieuEvenement: [''],
      cout: [0, [Validators.required, Validators.min(0)]],
      participants: this.fb.array([]),
      fournisseurs: this.fb.array([]),
    });

    this.chargerUtilisateurs();
    this.addParticipant();
    this.addFournisseur();
  }

  // Participants
  get participantsArray(): FormArray {
    return this.evenementForm.get('participants') as FormArray;
  }

  addParticipant(): void {
    const participantGroup = this.fb.group({
      idUser: [null],
      email: ['', [Validators.required, Validators.email]],
      nom: ['']
    });
    this.participantsArray.push(participantGroup);
  }

  removeParticipant(index: number): void {
    this.participantsArray.removeAt(index);
  }

  onParticipantSelected(index: number): void {
    const participantGroup = this.participantsArray.at(index);
    const idUser = participantGroup.get('idUser')?.value;
    const user = this.utilisateurs.find(u => u.idUser === idUser);
    if (user) {
      participantGroup.patchValue({
        email: user.email,
        nom: user.nom || ''
      });
    }
  }

  // Fournisseurs
  get fournisseursArray(): FormArray {
    return this.evenementForm.get('fournisseurs') as FormArray;
  }

  addFournisseur(): void {
    const fournisseurGroup = this.fb.group({
      nom: [''],
      email: [''],
      numero: [''],
      type: [''],
      document: [[]]
    });
    this.fournisseursArray.push(fournisseurGroup);
    this.fileNames.push([]);
    this.fileUrls.push([]);
  }

  removeFournisseur(index: number): void {
    this.fournisseursArray.removeAt(index);
    this.fileNames.splice(index, 1);
    this.fileUrls.splice(index, 1);
  }

  triggerFileInput(index: number): void {
    const fileInput = this.fileInputs.toArray()[index];
    fileInput?.nativeElement.click();
  }

  onFileChange(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      Array.from(input.files).forEach(file => {
        const currentFiles = this.fournisseursArray.at(index).value.document || [];
        currentFiles.push(file);
        this.fournisseursArray.at(index).patchValue({ document: currentFiles });

        this.fileNames[index].push(file.name);
        this.fileUrls[index].push(URL.createObjectURL(file));
      });
      input.value = '';
    }
  }

  removeFournisseurFile(fournisseurIndex: number, fileIndex: number) {
    this.fileNames[fournisseurIndex].splice(fileIndex, 1);
    this.fileUrls[fournisseurIndex].splice(fileIndex, 1);
    const files = this.fournisseursArray.at(fournisseurIndex).value.document as File[];
    files.splice(fileIndex, 1);
    this.fournisseursArray.at(fournisseurIndex).patchValue({ document: files });
  }

  addFileInput(fournisseurIndex: number) {}

  // Images événement
  triggerImageInput() {
    this.imageInput.nativeElement.click();
  }

  onImageEvenementSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      Array.from(input.files).forEach(file => this.imageEvenementFiles.push(file));
      input.value = '';
    }
  }

  removeImageEvenement(index: number) {
    this.imageEvenementFiles.splice(index, 1);
  }

  // Utilisateurs
  chargerUtilisateurs(): void {
    this.userService.getAll().subscribe({
      next: data => this.utilisateurs = data,
      error: err => console.error('Erreur chargement utilisateurs', err)
    });
  }

  // Submit
  onSubmit(): void {
    if (this.evenementForm.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Champs manquants',
        text: 'Veuillez remplir tous les champs requis.',
        confirmButtonColor: '#3085d6'
      });
      return;
    }

    const formData = new FormData();
    formData.append('titre', this.evenementForm.get('titre')?.value);
    formData.append('description', this.evenementForm.get('description')?.value || '');
    formData.append('dateEvenement', new Date(this.evenementForm.get('dateEvenement')?.value).toISOString().substring(0, 10));
    formData.append('lieuEvenement', this.evenementForm.get('lieuEvenement')?.value || '');
    formData.append('cout', this.evenementForm.get('cout')?.value.toString());

    // Ajout des images de l'événement
    this.imageEvenementFiles.forEach(file => formData.append('imagesEvenement', file, file.name));

    // Participants
    const participants = this.participantsArray.controls.map(ctrl => ({
      idUser: ctrl.get('idUser')?.value,
      email: ctrl.get('email')?.value
    }));
    formData.append('participants', JSON.stringify(participants));

    // Fournisseurs
    const fournisseurs = this.fournisseursArray.controls.map(fg => {
      const f = fg.value;
      return { nom: f.nom, email: f.email, numero: f.numero, type: f.type };
    });
    formData.append('fournisseurs', JSON.stringify(fournisseurs));

    // Documents fournisseurs
    this.fournisseursArray.controls.forEach(fg => {
      const f = fg.value;
      if (Array.isArray(f.document)) {
        f.document.forEach((file: File) => formData.append('files', file));
      }
    });

    this.evenementService.createEvenementFinal(formData).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Succès',
          text: 'Événement créé avec succès 🎉',
          confirmButtonColor: '#28a745'
        }).then(() => this.dialogRef?.close(true));
      },
      error: err => {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: err.error?.message || 'Une erreur est survenue.',
          confirmButtonColor: '#d33'
        });
        console.error('Erreur création événement', err);
      }
    });
  }

  onCancel(): void {
    this.dialogRef?.close(false);
  }
}
