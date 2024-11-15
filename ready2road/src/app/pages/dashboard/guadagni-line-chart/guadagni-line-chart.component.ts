import {Component} from '@angular/core';
import {StatisticService} from "../../../services/statistic.service";
import  {Chart} from "chart.js/auto";
import {forkJoin, Observable} from "rxjs";

@Component({
  selector: 'app-guadagni-line-chart',
  templateUrl: './guadagni-line-chart.component.html',
  styleUrl: './guadagni-line-chart.component.css'
})
export class GuadagniLineChartComponent {
  public selectedTimeRange: string = "6days";
  public isActive1Day:boolean=true;
  public isActive5Days:boolean=false;
  public isActive10Days:boolean=false;
  getDate(number: number) {
    var d = new Date();
    var sixDaysAgo: Date = new Date(d.setDate(d.getDate() - number));

    var daySixDaysAgo: number = sixDaysAgo.getDate();
    var monthSixDaysAgo: number = sixDaysAgo.getMonth() + 1;
    var yearSixDaysAgo: number = sixDaysAgo.getFullYear();

    return `${daySixDaysAgo}/${monthSixDaysAgo}/${yearSixDaysAgo}`;
  }
  setOneDayGap():string[]{
    let arr:string[]=[];
    for (let i=5; i>-1; i--){
      arr.push(this.getDate(i));
    }
    return arr;

  }
  datas: Record<string, number> = {};
  public chart: any;
  public oneDayGap:string[]=[];
  public fiveDayGap:string[]=[];
  public tenDayGap:string[]=[];







  constructor(private statisticService: StatisticService) {

    this.oneDayGap=this.setOneDayGap();
    this.updateChart(this.oneDayGap);
  }

  ngOnInit(): void {
    this.createChart();

  }

  createChart() {
    this.chart = new Chart("MyChart2", {
      type: 'line',
      data: {
        labels: this.oneDayGap,
        datasets: [
          {
            label: 'guadagni',
            data: [6, -100, 100],
            borderColor: 'rgb(255, 165, 0)',
            backgroundColor: 'rgb(255, 165, 0)',
            pointBackgroundColor:'rgb(255, 0, 0)',
            pointStyle: 'circle',
            pointRadius: 5,
            pointHoverRadius: 10
          }
        ]
      },
      options: {
        scales:{
          y:{
            grid:{
              color:'grey',
            },
            ticks:{
              font:{
                size:15,
              },
              callback: function(value, index, values) {
                return value + '€';
              }
            }
          },
          x:{
            ticks:{
              font:{
                size:15,
              }
            },
            grid:{
              display:false,
            }
          }
        },
        animation: {duration: 500,},
        interaction: {
          intersect: false
        },
        responsive: true,
        maintainAspectRatio: false,

        plugins: {
          title: {
            display: false,
          },
          legend:{
            display:false,
          },
          tooltip:{
            displayColors: false,
            callbacks: {
              label: function(context) {
                return context.dataset.label + ': ' + context.parsed.y + '€';
              }
            }
          }
        }
      }
    });}

  active6Days() {
    this.isActive1Day=true;
    this.isActive10Days=false;
    this.isActive5Days=false;
    this.chart.data.labels = this.oneDayGap;
    this.updateChart(this.oneDayGap);


  }

  active31Days() {
    if(this.fiveDayGap.length == 0)
        this.fiveDayGap=this.setFiveDayGap();
    this.chart.data.labels = this.fiveDayGap;

    this.isActive1Day=false;
    this.isActive10Days=false;
    this.isActive5Days=true;
    this.updateChart(this.fiveDayGap);
  }

  active365Days() {
    if(this.tenDayGap.length == 0)
      this.tenDayGap=this.setTenGapDays();
    this.chart.data.labels = this.tenDayGap;
    this.chart.update();
    this.isActive1Day=false;
    this.isActive10Days=true;
    this.isActive5Days=false;
    this.updateChart(this.tenDayGap);

  }

  private setFiveDayGap() {
    let arr:string[]=[];
    for (let i=25; i>-1; i=i-5){
      arr.push(this.getDate(i));
    }
    return arr;
  }

  private setTenGapDays() {
    let arr:string[]=[];
    for (let i=50; i>-1; i=i-10){
      arr.push(this.getDate(i));
    }
    return arr;
  }

  private updateChart(Gap: string[]) {
    const observables: Observable<number>[] = [];
    for(let i=0; i<Gap.length-1; i++){
      observables.push(this.statisticService.getRendimento(Gap[i], Gap[i+1]));
    }
    observables.push(this.statisticService.getRendimento(Gap[Gap.length-1], Gap[Gap.length-1]));
    for(let i=0; i<observables.length; i++){
        observables[i].subscribe(response => {
            this.chart.data.datasets[0].data[i] = response;
            this.chart.update();
        })
    }
  }
}

