import { Injectable } from '@angular/core';
import { Chart, registerables } from 'chart.js';

// Registra i plugin necessari
Chart.register(...registerables);

@Injectable({
  providedIn: 'root'
})
export class SaldoChartService {
  /* VARIABILI */
  protected myChart: any;

  /* COSTRUTTORE */
  constructor() {}

  /* CREAZIONE GRAFICO */
  public createChart(valoreTransazioni: any, dataOraTransazioni: any) {
    this.myChart = new Chart('saldoChart', {
      type: 'line',
      data: {
        labels: dataOraTransazioni,
        datasets: [{
          data: valoreTransazioni,
          fill: true,
          borderColor: '#c51d39',
          borderWidth: 2,
          pointBackgroundColor: '#000000',
          tension: 0.1,
        }]
      },
      options: {
        scales: {
          x: {
            ticks: {
              color: '#000000', // Cambia il colore delle label sull'asse delle x
              maxRotation: 45
            }
          },
          y: {
            ticks: {
              color: '#000000' // Cambia il colore delle label sull'asse delle x
            }
          }
        },
        plugins: {
          legend: {
            display: false,
          }
        }
      }
    });
  }
}
