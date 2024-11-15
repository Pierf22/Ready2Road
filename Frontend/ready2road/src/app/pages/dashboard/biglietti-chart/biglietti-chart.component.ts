import {Component, Input} from '@angular/core';
import {StatisticService} from "../../../services/statistic.service";
import {Chart} from "chart.js/auto";

@Component({
  selector: 'app-biglietti-chart',
  templateUrl: './biglietti-chart.component.html',
  styleUrl: './biglietti-chart.component.css'
})
export class BigliettiChartComponent {
  @Input() nomeVenditore!:string;
  datas: Record<string, number> = {};
  public chart: any;

  constructor(private statisticService: StatisticService) { }

  ngOnInit(): void {
    // Crea il grafico con una struttura vuota
    this.createChart();

    // Carica i dati dal servizio e aggiorna il grafico
    this.statisticService.getStatistichePieChartBiglietti(this.nomeVenditore).subscribe(numb => {
      this.datas = numb;
      this.updateChart();
    });
  }

  createChart() {
    this.chart = new Chart("bigliettiPieChart", {
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
          borderColor: 'white',
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


}
