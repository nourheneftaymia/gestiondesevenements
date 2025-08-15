import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ChartData, ChartOptions, ChartType } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { InvitationserviceService } from 'src/app/services/invitationservice.service';

@Component({
  selector: 'app-taux-participation',
    standalone: true,
    imports: [NgChartsModule, CommonModule],
  templateUrl: './taux-participation.component.html',
  styleUrls: ['./taux-participation.component.scss']
})
export class TauxParticipationComponent implements OnInit {

 
  // Type de graphique
  barChartType: ChartType = 'bar';

  // Options du graphique
  barChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        // max: 100 // si tu veux un max, sinon supprime cette ligne
      }
    }
  };

  // Labels (titres des événements)
  barChartLabels: string[] = [];

  // Données du graphique (datasets)
  barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: []
  };

  constructor(private invitationService: InvitationserviceService) {}

  ngOnInit(): void {
    this.invitationService.getTauxParticipation().subscribe({
      next: (data: any[]) => {
        console.log('Data reçue:', data);

        this.barChartLabels = data.map(d => d.titreEvenement);

        this.barChartData = {
          labels: this.barChartLabels,
          datasets: [
            {
              label: 'Nombre de participants acceptés',
              data: data.map(d => d['nombreValidées']),  // utilise la notation crochets pour la clé avec accent
              backgroundColor: '#3f51b5',
              borderColor: '#3f51b5',
              borderWidth: 1
            }
          ]
        };
      },
      error: (err) => {
        console.error('Erreur API', err);
      }
    });
  }

}
