import {Component,  OnInit} from '@angular/core';
import {StatisticService} from "../../services/statistic.service"
import {NgxSpinnerService} from "ngx-spinner";
import {Admin} from "../../model/Admin";
import {SessionService} from "../../services/session.service";
import {Venditore} from "../../model/Venditore";
import {Router} from "@angular/router";
@Component({
  selector: 'app-dash-board',
  templateUrl: './dash-board.component.html',
  styleUrl: './dash-board.component.css'
})
export class DashBoardComponent implements OnInit{
  utente: Venditore| Admin | undefined;
  nomeUtente: string="";
  utentiTotali?:number;
  venditoriTotali?:number;
  bigliettiVenduti?:number;
  transazioniEffettuate?:number;
  bigliettiChart:boolean=true;
   venditeChart: boolean=true;
  guadagniChart: boolean = true;
  constructor(protected router:Router, private sessionService:SessionService, private spinner: NgxSpinnerService, private statisticService: StatisticService) {
  }
  ngOnInit(): void {
    this.sessionService.waitForUser().then(()=>{ //aspetto che l'utente sia settato
      let user = this.sessionService.getUser();
      if(user instanceof Admin ) {
        this.utente = user;
        this.nomeUtente = this.utente.getUsername();
      }else if (user instanceof Venditore) {
        this.utente = user;
        this.nomeUtente = this.utente.getNomeSocieta();
      }else {
        this.router.navigate(['/home']).then();
        return;
      }
      this.spinner.show().then();
      if(this.utente instanceof Admin) { //se l'utente è un admin carica le statistiche per admin
        this.statisticService.getStatisticheAdmin().subscribe(numb => {
          this.caricaStatistichePrincipali(numb);
          this.spinner.hide().then();
        });
      }else { //se l'utente è un venditore carica le statistiche per venditore
        this.statisticService.getStatisticheVenditore(this.utente.getNomeSocieta()).subscribe(numb => {
          this.caricaStatistichePrincipali(numb);
          this.spinner.hide().then();
        });
      }
});}
  protected mostraBigliettiChart() { //mostra il grafico dei biglietti
    this.bigliettiChart=!this.bigliettiChart;
  }
  protected mostraVenditeChart() {
    this.venditeChart=!this.venditeChart;
  }
  protected mostraGuadagniChart() {
    this.guadagniChart=!this.guadagniChart;
  }
  protected eAdmin() { //controlla se l'utente è un admin
    return this.utente instanceof Admin;
  }
  protected eVenditore() {
    return this.utente instanceof Venditore;
  }
  private caricaStatistichePrincipali(numb: number[]) {
    this.utentiTotali = numb[0];
    this.venditoriTotali = numb[1];
    this.bigliettiVenduti = numb[2];
    this.transazioniEffettuate = numb[3];
  }
}
