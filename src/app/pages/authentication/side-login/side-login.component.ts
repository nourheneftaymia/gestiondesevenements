import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { CommonModule } from '@angular/common';

import { MatDialog } from '@angular/material/dialog';
import { ResetPasswordComponent } from 'src/app/components/reset-password/reset-password.component';
@Component({
  selector: 'app-side-login',
  imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule ,CommonModule],
  templateUrl: './side-login.component.html',
})
export class AppSideLoginComponent {
 email = '';
  password = '';
  errorMessage = '';
  successMessage = '';

  constructor(private authService: AuthServiceService, private router: Router,  private dialog: MatDialog) {}

  onSubmit(): void {
   this.authService.login({ email: this.email, password: this.password }).subscribe({
  next: (response) => {
    this.authService.saveToken(response.token ,response.role);
    this.successMessage = '✅ Connexion réussie !';
    this.errorMessage = '';

     switch (response.role) {
        case 'RESPONSABLE_RH':
          this.router.navigate(['/dashboard/RH']);
          break;
          case 'SUPERIEUR_HEARARCHIQUE':
            this.router.navigate(['/dashboard/superieur']);
            break;
          case 'EMPLOYE':
            this.router.navigate(['/dashboard/employe']);
            break;
                default:
            this.router.navigate(['/']);
  }
    },
  error: () => {
    this.errorMessage = '❌ Email ou mot de passe incorrect.';
    this.successMessage = '';
  }
});

  }
  

openForgotPasswordDialog() {
  const mainContent = document.getElementById('main-content');
  if (mainContent) {
    mainContent.classList.add('blur-background');
  }

  const dialogRef = this.dialog.open(ResetPasswordComponent, {
    width: '450px',
    disableClose: true,
  });

  dialogRef.afterClosed().subscribe(() => {
    if (mainContent) {
      mainContent.classList.remove('blur-background');
    }
  });
}


  
}