
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { EvenementService } from 'src/app/services/evenement.service';


@Component({
  selector: 'app-stat-fournisseur',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stat-fournisseur.component.html',
  styleUrl: './stat-fournisseur.component.scss'
})
export class StatFournisseurComponent implements OnInit {
  stats: { [key: string]: number } = {};
  fournisseurs: string[] = [];
  counts: number[] = [];

  constructor(private evenementService: EvenementService) {}

  ngOnInit(): void {
    this.evenementService.getStatsFournisseursUtilisation().subscribe({
      next: (data) => {
        this.stats = data;
        this.fournisseurs = Object.keys(data);
        this.counts = Object.values(data);
      },
      error: (err) => console.error('Erreur récupération stats fournisseurs', err)
    });
  }
}
