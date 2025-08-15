
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { NotificationsComponent } from '../notifications/notifications.component';
import { UserService } from '../../services/user.service';
import { MaterialModule } from '../../material.module'; // Assurez-vous que le chemin est correct
import { CommonModule } from '@angular/common';

 
@Component({
  selector: 'app-dashbord-superieur-heararchique',
  imports: [CommonModule,
          MatCardModule,
          MaterialModule,
          MatIconModule,
          MatMenuModule,
          MatButtonModule,
          RouterOutlet,
          RouterLink,RouterModule,
          NotificationsComponent
       ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './dashbord-superieur-heararchique.component.html',
 styleUrls: ['./dashbord-superieur-heararchique.component.scss']
 })

export class DashbordSuperieurHeararchiqueComponent implements OnInit{
     toggleProfileMenu = false;
     toggleNotif = false;
     invitations : any[] = [];
       userFullName: string = '';
      userEmail: string = '';
     photoUrl: string = 'assets/images/default-avatar.jpg'; // image par défaut
   constructor(private router: Router ,private dialog: MatDialog,private utilisateurService: UserService) {}
 
   logout() {
     localStorage.removeItem('token');
     this.router.navigate(['/login']);
   }
    

 ngOnInit(): void {
  this.utilisateurService.getCurrentUser().subscribe({
    next: (user) => {
      this.userFullName = `${user.prenom} ${user.nom}`;
      this.userEmail = user.email;
      this.photoUrl = user.photoUrl ? `http://localhost:8083/uploads/${user.photoUrl}` : 'assets/images/avatar-doctor.png';
    },
    error: (err) => {
      console.error('Erreur récupération utilisateur :', err);
    }
  });
}

 



   ouvrirNotifications() {
  const dialogRef = this.dialog.open(NotificationsComponent, {
    width: '500px', // adapte la taille si besoin
  });

  dialogRef.afterClosed().subscribe(result => {
    // tu peux traiter les données retournées ici si nécessaire
    console.log("Dialog des notifications fermé");
  });
}


    
}