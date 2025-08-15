import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { EvenementService } from 'src/app/services/evenement.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [RouterLink, RouterModule,CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
evenements: any[] = [];

  constructor(private evenementService: EvenementService) {}

  ngOnInit(): void {
    this.chargerEvenements();
  }

  chargerEvenements(): void {
    this.evenementService.getAllEvenementsFinal().subscribe({
      next: (data: any[]) => {
        this.evenements = data;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des événements', err);
      }
    });
  }

  getImageUrl(imageName: string): string {
    return `http://localhost:8083/uploads/${imageName};` 
  }

  toggleDescription(event: any, e: Event) {
  e.preventDefault(); // pour éviter que le lien remonte en haut de page

  // Si showDescription n'existe pas encore, on l'initialise à false
  if (typeof event.showDescription === 'undefined') {
    event.showDescription = false;
  }

  event.showDescription = !event.showDescription;
}

}