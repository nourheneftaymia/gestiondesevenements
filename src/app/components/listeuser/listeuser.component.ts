import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MaterialModule } from '../../material.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { AjouteruserComponent } from '../ajouteruser/ajouteruser.component';
import { ModifieruserComponent } from '../modifieruser/modifieruser.component';
import { DetailUtilisateurDialogComponent } from '../detail-utilisateur-dialog/detail-utilisateur-dialog.component';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-listeuser',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MaterialModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule
  ],
  templateUrl: './listeuser.component.html',
  styleUrls: ['./listeuser.component.scss'],
   
})
export class ListeuserComponent implements OnInit {
  utilisateurs: any[] = [];

  constructor(private userService: UserService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadUtilisateurs();
  }

  loadUtilisateurs(): void {
    this.userService.getAll().subscribe({
      next: data => this.utilisateurs = data,
      error: err => console.error('Erreur chargement utilisateurs', err)
    });
  }

  openAjoutDialog(): void {
    const dialogRef = this.dialog.open(AjouteruserComponent, {
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) this.loadUtilisateurs();
    });
  }

  openUpdateDialog(user: any): void {
    const dialogRef = this.dialog.open(ModifieruserComponent, {
      width: '500px',
      data: user
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'updated') {
        this.loadUtilisateurs();
      }
    });
  }

  openDetailDialog(user: any): void {
    this.dialog.open(DetailUtilisateurDialogComponent, {
      width: '400px',
      data: user
    });
  }

  supprimerUtilisateur(id: number): void {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: "Cette action est irréversible !",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer !',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.delete(id).subscribe({
          next: () => {
            this.loadUtilisateurs();
            Swal.fire({
              title: 'Supprimé !',
              text: 'L’utilisateur a été supprimé avec succès.',
              icon: 'success',
              confirmButtonText: 'OK'
            });
          },
          error: err => {
            console.error('Erreur suppression', err);
            Swal.fire({
              title: 'Erreur !',
              text: 'La suppression a échoué.',
              icon: 'error',
              confirmButtonText: 'Fermer'
            });
          }
        });
      }
    });
  }


}
