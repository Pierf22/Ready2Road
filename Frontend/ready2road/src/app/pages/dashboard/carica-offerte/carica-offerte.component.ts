import {Component, OnInit} from '@angular/core';
import {Venditore} from "../../../model/Venditore";
import {Router} from "@angular/router";
import {SessionService} from "../../../services/session.service";
import {NgxSpinnerService} from "ngx-spinner";
import {StatisticService} from "../../../services/statistic.service";
import {TratteService} from "../../../services/tratte.service";
import {Admin} from "../../../model/Admin";
import {Tratta} from "../../../model/Tratta";

@Component({
  selector: 'app-carica-offerte',
  templateUrl: './carica-offerte.component.html',
  styleUrl: './carica-offerte.component.css'
})
export class CaricaOfferteComponent implements OnInit{
  utente: Venditore| undefined;
  nomeUtente: string = "";
  tratte: any;

  constructor(private sessionService:SessionService, private tratteservice: TratteService, private router: Router) {}

  ngOnInit(): void {
    this.sessionService.waitForUser().then(()=>{
      let user = this.sessionService.getUser();
      if (user instanceof Venditore) {
        this.utente = user;
        this.nomeUtente = this.utente.getNomeSocieta();
        this.getTratte();
      }else {
        this.router.navigate(['/home']);
        return;
      }
      });
  }

  getTratte() {
    if (this.utente instanceof Venditore) {
      this.tratteservice.getTratteDiVenditoreAttive(this.utente.getNomeSocieta()).subscribe(tratte => {
        this.tratte = tratte;
      });
    }
  }

  inviaModifica(tratta: Tratta, id: string) {
    this.tratteservice.modificaTratta(id, tratta).subscribe();
    alert("Modifica inviata");
    window.location.reload();
  }
}
