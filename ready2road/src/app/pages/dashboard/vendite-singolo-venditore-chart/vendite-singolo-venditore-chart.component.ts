import {Component, Input, OnInit} from '@angular/core';
import {StatisticService} from "../../../services/statistic.service";
import Chart from "chart.js/auto";
@Component({
  selector: 'app-vendite-singolo-venditore-chart',
  templateUrl: './vendite-singolo-venditore-chart.component.html',
  styleUrls: ['./vendite-singolo-venditore-chart.component.css', '../vendite-line-chart/vendite-line-chart.component.css']
})
export class VenditeSingoloVenditoreChartComponent implements OnInit{
  @Input() nomeVenditore!:string; // Nome del venditore
  public chart: any;
  availableYears: number[] = [];
  currentYear: number = new Date().getFullYear();
  selectedYear: number = this.currentYear;
  dati: Record<string, number[]>[] = [];
  constructor(private statisticService: StatisticService) {
    this.generaAnni();
  }

  ngOnInit(): void {
    this.createChart();
    this.updateChart();
  }
  private createChart() {
    let delayed:boolean|undefined;
    this.chart = new Chart('venditeSingoloVenditore', {
      type: 'bar',
      data: {
        labels: [],
        datasets: [
          {
            label: 'Biglietti aereo',
            data: [],
            backgroundColor: 'blue',
            borderWidth: 1,
          },
          {
            label: 'Biglietti treno',
            data: [],
            backgroundColor: 'red',
            borderWidth: 1,
          },
          {
            label: 'Biglietti bus',
            data: [],
            backgroundColor: 'green',
            borderWidth: 1,
          }
        ]
      },
      options: {
      borderColor:'white',
        scales: {
          y: {
            grid:{
              color:'grey'
            },
            beginAtZero: true,
            stacked: false,
            ticks:{
              font:{
                size:15
              },
            }
          },
          x:{
            grid:{
              display:false,
            },
            ticks:{
              font:{
                size:15
              }
            }
          }
        },
        plugins: {
          colors:{
            forceOverride: true,
          },
          legend: {
            display: true,
            labels:{
              font:{
                size: 18
              }
            },

          },
          tooltip: {
            enabled: false,
          },
        },
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          onComplete: () => {
            delayed = true;
          },
          delay: (context) => { // Delay per l'animazione
            let delay = 0;
            if (context.type === 'data' && context.mode === 'default' && !delayed) {
              delay = context.dataIndex * 300 + context.datasetIndex * 100;
            }
            return delay;
          },
        },
      }});
  }
  private updateChart() {
    this.statisticService.getVenditePerAnnoVenditore(this.selectedYear, this.nomeVenditore).subscribe(data => {
      this.dati = data;
      this.chart.data.labels = Object.keys(this.dati);
      const firstValues = [];
      const secondValues = [];
      const thirdValues = [];
      for (let i = 0; i < Object.keys(this.dati).length; i++) {
        firstValues.push(Object.values(this.dati)[i][0]);
        secondValues.push(Object.values(this.dati)[i][1]);
        thirdValues.push(Object.values(this.dati)[i][2]);

      }
        this.chart.data.datasets[0].data = firstValues; //aggiungo i dati del grafico
        this.chart.data.datasets[1].data = secondValues;
        this.chart.data.datasets[2].data = thirdValues;

      this.chart.update();
    });
  }
  protected updateYear() {
    this.updateChart();
  }
  private generaAnni() {
    for (let year = 2016; year <= this.currentYear; year++) {
      this.availableYears.push(year);
    }
  }
}
