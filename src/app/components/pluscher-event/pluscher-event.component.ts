import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { EvenementService } from 'src/app/services/evenement.service';

@Component({
  selector: 'app-pluscher-event',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, NgChartsModule],
  templateUrl: './pluscher-event.component.html',
  styleUrl: './pluscher-event.component.scss'
})
export class PluscherEventComponent implements OnInit {

  evenement: any;
  loading = true;
  error = '';

  // Chart config
  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      }
    }
  };
  public pieChartLabels: string[] = [];
  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: [],
    datasets: [
      { data: [] }
    ]
  };
  public pieChartType: 'pie' = 'pie';


  constructor(private evenementService: EvenementService) { }

  ngOnInit(): void {
  this.evenementService.getEvenementPlusCherAvecRepartition().subscribe({
  next: (data) => {
    this.evenement = data.evenement;

    const repartition = data.repartitionCout; // ici ce sera juste { "Total": 1234 }
    this.pieChartLabels = Object.keys(repartition);
    this.pieChartData = {
      labels: this.pieChartLabels,
      datasets: [
        { data: Object.values(repartition) as number[] }
      ]
    };

    this.loading = false;
  },
  error: () => {
    this.error = 'Erreur lors du chargement';
    this.loading = false;
  }
});

}
}