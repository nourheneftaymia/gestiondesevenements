import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent implements OnInit {
  utilisateur: any = {};
  editionActive: boolean = false;
  selectedFile: File | null = null;
  photoUrl: string = 'assets/images/default-avatar.jpg'; // image par défaut

  constructor(private utilisateurService: UserService) {}

  ngOnInit(): void {
    console.log("🔄 Initialisation du composant profil...");
    this.loadCurrentUser();
  }

  loadCurrentUser() {
  this.utilisateurService.getCurrentUser().subscribe({
    next: (data) => {
      console.log("✅ Utilisateur chargé :", data);
      this.utilisateur = data;

      console.log('Photo reçue:', data.photo);

      if (data.photo && data.photo.trim() !== '') {
        const timestamp = new Date().getTime();
        this.photoUrl = this.utilisateurService.getUserPhoto(data.photo) + '?t=' + timestamp;
      } else {
        this.photoUrl = 'assets/images/default-avatar.jpg';
      }

      console.log("🖼️ URL photo dans la barre :", this.photoUrl);
    },
    error: (err) => {
      console.error("❌ Erreur de chargement du profil", err);
      this.photoUrl = 'assets/images/default-avatar.jpg';
    }
  });
}

  activerEdition(): void {
    console.log("📝 Mode édition activé");
    this.editionActive = true;
  }

  enregistrer(): void {
    if (!this.utilisateur) {
      console.warn("❗ Aucune donnée utilisateur à enregistrer.");
      return;
    }

    console.log("💾 Enregistrement des données :", this.utilisateur);

    this.utilisateurService.update(this.utilisateur.idUser, this.utilisateur).subscribe({
      next: () => {
        console.log("✅ Données utilisateur mises à jour");

        if (this.selectedFile) {
          console.log("📤 Upload de la photo en cours...");
          const formData = new FormData();
          formData.append('photo', this.selectedFile);

          this.utilisateurService.uploadPhoto(this.utilisateur.idUser, formData).subscribe({
            next: () => {
              console.log("✅ Photo envoyée avec succès");

              // Recharge utilisateur pour récupérer la nouvelle photo
              this.utilisateurService.getCurrentUser().subscribe(user => {
                this.utilisateur.photo = user.photo;

                // Forcer le reload de l'image avec timestamp anti-cache
                const timestamp = new Date().getTime();
                this.photoUrl = this.utilisateurService.getUserPhoto(user.photo) + '?t=' + timestamp;

                console.log(`🖼️ Nouvelle photo utilisateur chargée pour la barre : ${this.photoUrl}`);

                alert("Profil et photo mis à jour !");
                this.selectedFile = null;
                this.editionActive = false;
              });
            },
            error: (err) => {
              console.error("❌ Erreur lors de l'upload de la photo :", err);
              alert("Erreur lors de l'envoi de la photo.");
            }
          });
        } else {
          console.log("✅ Mise à jour sans nouvelle photo");
          alert("Profil mis à jour !");
          this.editionActive = false;
        }
      },
      error: (err) => {
        console.error("❌ Erreur lors de la mise à jour :", err);
        alert("Erreur lors de la mise à jour.");
      }
    });
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      console.log("📸 Fichier sélectionné :", this.selectedFile.name, this.selectedFile.type);
    } else {
      console.warn("⚠️ Aucun fichier sélectionné");
    }
  }

  
}
