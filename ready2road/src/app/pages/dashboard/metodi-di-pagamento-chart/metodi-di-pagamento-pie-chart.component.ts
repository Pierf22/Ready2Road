import { Component, inject, OnInit } from '@angular/core';
import {Chart} from "chart.js/auto";
import {StatisticService} from "../../../services/statistic.service";

@Component({
  selector: 'metodi-di-pagamento-pie-chart',
  templateUrl: './metodi-di-pagamento-pie-chart.component.html',
  styleUrls: ['./metodi-di-pagamento-pie-chart.component.css']
})
export class MetodiDiPagamentoPieChart {
  datas: Record<string, number> = {};
  public chart: any;

  constructor(private statisticService: StatisticService) { }

  ngOnInit(): void {
    // Crea il grafico con una struttura vuota
    this.createChart();

    // Carica i dati dal servizio e aggiorna il grafico
    this.statisticService.getStatistichePieChartMetodiDiPagamento().subscribe(numb => {
      this.datas = numb;
      this.updateChart();
    });
  }

  createChart() {
    this.chart = new Chart("MyChart1", {
      type: 'pie',
      data: {
        labels: [],
        datasets: [{
          label: '',
          data: [],
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(255, 205, 86)',
            'rgb(54, 162, 235)',
            'rgb(201, 203, 207)',
            'rgb(75, 192, 192)',
          ],
          borderColor:'white',
          hoverOffset: 4
        }],
      },

      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins:{
          legend:{
            labels:{
              font:{
                size:16
              }
            }
          }
        }


      }
    });
  }

  updateChart() {
    // Aggiorna il grafico con i dati effettivi
    this.chart.data.labels = Object.keys(this.datas);
    this.chart.data.datasets[0].data = Object.values(this.datas);


    // Aggiorna il grafico
    this.chart.update();
  }

  protected readonly Object = Object;
}




