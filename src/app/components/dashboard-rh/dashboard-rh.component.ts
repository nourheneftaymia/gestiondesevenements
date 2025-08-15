import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';

import { MaterialModule } from 'src/app/material.module';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-dashboard-rh',
  imports: [CommonModule,
          MatCardModule,
          MaterialModule,
          MatIconModule,
          MatMenuModule,
          MatButtonModule,
          RouterOutlet,
          RouterLink,RouterModule],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './dashboard-rh.component.html',
  styleUrl: './dashboard-rh.component.scss'
})
export class DashboardRHComponent  {

    toggleProfileMenu = false;
      userFullName: string = '';
      userEmail: string = '';
     photoUrl: string = 'assets/images/default-avatar.jpg'; // image par défaut

   
  user: any = {};


  constructor(private userService: UserService , private router: Router) {}


   logout() {
     localStorage.removeItem('token');
     this.router.navigate(['/login']);
   }
 



   ngOnInit(): void {
  this.userService.getCurrentUser().subscribe({
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
 
}
