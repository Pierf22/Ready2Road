import {Component, inject, OnInit} from '@angular/core';
import Swal from "sweetalert2";
import {Utente} from "../../model/Utente";
import {SessionService} from "../../services/session.service";
import {CaricaServiziService} from "../../services/carica-servizi.service";
import {Router} from "@angular/router";
import {TratteService} from "../../services/tratte.service";
import {Venditore} from "../../model/Venditore";
import {Admin} from "../../model/Admin";
import { NgModel } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import {CsvReaderService} from "../../services/csv-reader.service";

@Component({
  selector: 'app-caricaservizi',
  templateUrl: './caricaservizi.component.html',
  styleUrl: './caricaservizi.component.css'
})
export class CaricaserviziComponent implements OnInit{
  protected   utente:Admin|Utente|Venditore|undefined;

  protected name = "Login";
  protected check: boolean = false;
  constructor(private tratteService: TratteService,private sessionService: SessionService, private caricaServizi: CaricaServiziService, private router: Router, private csvReaderService : CsvReaderService) {}
  ngOnInit(): void {
    // Chiamo checkSession per inizializzare la sessione
    this.waitUser();
  }

  async waitUser(): Promise<void> {
    await this.sessionService.waitForUser();
    this.utente = this.sessionService.getUser();

    if(this.utente instanceof Venditore){
      this.name = this.utente.getNomeSocieta();
      this.check = true;
    }
    else{
      alert("Accesso negato");
      //routine di accesso negato
    }

  }

  varMezzo: string = "AEREO";
  setActiveButton(id: string) {
    var buttons = document.getElementsByClassName("scelta-mezzo");
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].classList.remove("active");
    }
    var buttonElement = document.getElementById(id);
    if (buttonElement) {
      buttonElement.classList.add("active");
      this.varMezzo = id;
    }
    if(id === "AEREO"){
      this.tappeIntermedie = [];
    }
  }

  capitalizeFirstLetter(str: string): string {
    return str.toLowerCase().replace(/\b\w+\b/g, (word) => {
      if (word.length > 3) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      } else {
        return word;
      }
    });
  }

  inviaForm(){
    var partenza = (<HTMLInputElement>document.getElementById("partenza")).value;
    var arrivo = (<HTMLInputElement>document.getElementById("destinazione")).value;
    var capienza = (<HTMLInputElement>document.getElementById("capienza")).value;
    var prezzo = (<HTMLInputElement>document.getElementById("prezzo")).value;
    const dataPartenzaString = (<HTMLInputElement>document.getElementById("dataPartenza")).value;
    const dataPartenza = new Date(dataPartenzaString);
    const now = new Date();




    if (partenza === "" || arrivo === "" || capienza === "" || dataPartenzaString === "") {
      alert("Compila tutti i campi prima di inviare il form");
      return;
    }
    if (this.varMezzo !== "AEREO" && this.tappeIntermedie.filter(tappa => tappa !== null && tappa !== '').length <= 4) {
      alert("Tappe insufficienti");
      return;
    }

    partenza = this.capitalizeFirstLetter(partenza);
    arrivo = this.capitalizeFirstLetter(arrivo);
    var controlloCapi = this.csvReaderService.controllaValiditaNomi(partenza, arrivo);
    if(controlloCapi == "partenza"){
      alert("La partenza non è stata trovata");
      return;
    }
    if(controlloCapi == "arrivo"){
      alert("L'arrivo non è stato trovato");
      return;
    }

    if (this.varMezzo !== "AEREO") {
      for (var i = 0; i < this.tappeIntermedie.length; i++) {
        this.tappeIntermedie[i] = this.capitalizeFirstLetter(this.tappeIntermedie[i]);
      }
      var controlloTappe = this.csvReaderService.controllaValiditaTappe(this.tappeIntermedie, partenza, arrivo);
      if(controlloTappe == "partenza"){
        alert("La partenza non è valida");
        return;
      }
      if(controlloTappe == "arrivo"){
        alert("L'arrivo non è valido");
        return;
      }
      if(controlloTappe == "tappa"){
        alert("Alcune tappe non sono valide");
        return;
      }
      if(controlloTappe == "tragitto"){
        alert("Il tragitto non è valido");
        return;
      }
    }

    if (isNaN(Number(capienza)) || Number(capienza) <= 0) {
      alert("La capienza deve essere un numero maggiore di 0");
      return;
    }
    if (dataPartenza <= now) {
      alert("La data di partenza non può essere precedente ad oggi");
      return;
    }


    if (!/^\d+$/.test(prezzo) || Number(prezzo) <= 0) {
      alert("Il prezzo deve essere un numero intero maggiore di 0");
      return;
    }


    //tutti i controlli superati
    this.invio(partenza, arrivo, capienza, prezzo, dataPartenzaString, '0', '0'); //sconto  e biglietti scontati da implementare
    alert("Form inviato");

  }

  tappeIntermedie: string[] = [];

  invio(partenza: string, arrivo: string, capienza: string, prezzo: string, dataPartenzaString: string,  sconto:string, bigliettiScontati:string){
      //l'aggiunta della tratta viene effettuata tramite il servizio TratteService
      this.tratteService.aggiungiTratta(partenza, arrivo, capienza,capienza,dataPartenzaString, this.varMezzo, this.name,  prezzo, sconto, bigliettiScontati,this.tappeIntermedie).subscribe((risposta) => {

      }, error => {
        console.error('Errore durante l\'invio dei dati:', error);}
      , () => {
            window.location.reload();
        });

  }
}
