
import { ChartData, ChartOptions } from 'chart.js';
import { EvenementService } from '../../services/evenement.service';
import { Component, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgChartsModule } from 'ng2-charts';

@Component({
  selector: 'app-evolution-top-categorie',
  imports: [ 

    NgChartsModule],
  templateUrl: './evolution-top-categorie.component.html',
  styleUrl: './evolution-top-categorie.component.scss'
})
export class EvolutionTopCategorieComponent implements OnInit {

  chartData: ChartData<'line'> = { labels: [], datasets: [] };
  chartOptions: ChartOptions = { responsive: true };

  constructor(private evenementService: EvenementService) {}
ngOnInit(): void {
  this.evenementService.getEvolutionTopCategorie()
    .subscribe((data: { [key: string]: number }) => {
      const labels: string[] = Object.keys(data);
      const values: number[] = Object.values(data);

      this.chartData = {
        labels: labels,
        datasets: [
          {
            label: 'Évolution de la catégorie la plus utilisée',
            data: values,
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          }
        ]
      };
    });
}


}