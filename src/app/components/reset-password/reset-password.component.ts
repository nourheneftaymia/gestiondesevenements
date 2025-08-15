import { Component, ElementRef,AfterViewInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { AuthServiceService } from 'src/app/services/auth-service.service';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  imports: [CommonModule,FormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent implements AfterViewInit {

  email = '';
  code: string[] = ['', '', '', '', '', ''];
  nouveauMotDePasse = '';
  confirmMotDePasse = '';

  etape = 1; // 1=email, 2=code, 3=nouveau mdp, 4=terminé
  message = '';
  erreur = '';

  constructor(private authService: AuthServiceService) {}

  @ViewChild('emailInput') emailInput!: ElementRef<HTMLInputElement>;
  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef>;

  ngAfterViewInit() {
    setTimeout(() => {
      this.emailInput?.nativeElement.focus();
    }, 0);
  }

  onInput(event: any, index: number): void {
    const input = event.target;
    const value = input.value;

    if (!/^[0-9]$/.test(value)) {
      input.value = '';
      return;
    }

    this.code[index] = value;

    const inputsArray = this.otpInputs.toArray();
    if (index < inputsArray.length - 1) {
      inputsArray[index + 1].nativeElement.focus();
    }
  }

  envoyerCode() {
    this.erreur = '';
    this.authService.envoyerCode(this.email).subscribe({
      next: (res) => {
        this.message = 'Code envoyé à votre adresse mail.';
        this.etape = 2;
      },
      error: (err) => {
        this.message = '';
        this.erreur = 'Erreur : ' + (err.error || err.message);
      }
    });
  }

  verifierCode() {
    this.erreur = '';
    const codeComplet = this.code.join('');

    this.authService.verifierCode(this.email, codeComplet).subscribe({
      next: (res: any) => {
        this.message = res.message || 'Code validé, veuillez entrer un nouveau mot de passe.';
        this.etape = 3;
      },
      error: (err) => {
        this.message = '';
        this.erreur = 'Erreur : ' + (err.error?.message || err.error || err.message || 'Erreur inconnue');
      }
    });
  }

  resetPassword() {
    this.erreur = '';
    if (this.nouveauMotDePasse !== this.confirmMotDePasse) {
      this.erreur = 'Les mots de passe ne correspondent pas.';
      return;
    }

    const codeComplet = this.code.join('');

    this.authService.resetPassword(this.email, codeComplet, this.nouveauMotDePasse).subscribe({
      next: () => {
        this.message = 'Mot de passe changé avec succès ! Vous pouvez maintenant vous connecter.';
        this.etape = 4;
      },
      error: (err) => {
        this.message = '';
        this.erreur = 'Erreur : ' + (err.error || err.message);
      }
    });
  }


  redirectToLogin() {
  // Redirige vers /login, à adapter selon ton routing
  window.location.href = '/login';
}
}