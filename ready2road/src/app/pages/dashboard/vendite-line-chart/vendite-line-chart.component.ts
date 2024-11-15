import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import {StatisticService} from "../../../services/statistic.service";
import {CommonModule} from "@angular/common";


@Component({
  selector: 'app-vendite-line-chart',
  templateUrl: './vendite-line-chart.component.html',
  styleUrls: ['./vendite-line-chart.component.css']
})
export class VenditeLineChartComponent {
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

  createChart() {
    let delayed:boolean|undefined;
    this.chart = new Chart('MyChart3', {
      type: 'bar',
      data: {
        labels: [],
        datasets: [
          {
            label: 'Biglietti aereo',
            data: [],
            backgroundColor: 'blue',
            borderWidth:1
          },
          {
            label: 'Biglietti treno',
            data: [],
            backgroundColor: 'red',
            borderWidth:1
          },
          {
            label: 'Biglietti bus',
            data: [],
            backgroundColor: 'green',
            borderWidth:1
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
            ticks: {
              font:{
                size:15
              }
            }
          },
          x:{
            grid:{
              display:false
            },
            ticks:{
              font:{
                size:15
              }
            }
          }
        },
        plugins: {
          legend: {
            display: true,
            labels:{
              font:{
                size:18
              }
            }
          },
          tooltip: {
            enabled:false,
            mode: 'index',
            intersect: false,
          },
        },
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          onComplete: () => {
            delayed = true;
          },
          delay: (context) => {
            let delay = 0;
            if (context.type === 'data' && context.mode === 'default' && !delayed) {
              delay = context.dataIndex * 300 + context.datasetIndex * 100;
            }
            return delay;
          },
      },

    }});

  }


  updateChart() {
    // Chiamato quando ricevi i dati
    this.statisticService.getVenditePerAnno(this.selectedYear).subscribe(data => {
      this.dati = data;
      this.chart.data.labels = Object.keys(this.dati);
      this.chart.data.datasets[0].data = Object.values(this.dati)[0];
      this.chart.data.datasets[1].data = Object.values(this.dati)[1];
      this.chart.data.datasets[2].data = Object.values(this.dati)[2];
      this.chart.update();
    });
  }

  updateYear() {
    this.updateChart();
  }

  protected readonly Object = Object;

  private generaAnni() {
    for (let year = 2016; year <= this.currentYear; year++) {
      this.availableYears.push(year);
    }

  }

}

