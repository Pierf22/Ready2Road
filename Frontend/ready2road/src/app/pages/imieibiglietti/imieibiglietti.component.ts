import {Component, OnInit} from '@angular/core';
import {RicercaService} from "../../services/ricerca.service";
import {Router} from "@angular/router";
import {BigliettiService} from "../../services/biglietti.service";
import {Observable} from "rxjs";
import {Utente} from "../../model/Utente";
import {Admin} from "../../model/Admin";
import {Venditore} from "../../model/Venditore";
import {SessionService} from "../../services/session.service";
import {UtenteService} from "../../services/utente.service";
import jsPDF from 'jspdf';


@Component({
  selector: 'app-imieibiglietti',
  templateUrl: './imieibiglietti.component.html',
  styleUrl: './imieibiglietti.component.css'
})
export class ImieibigliettiComponent implements OnInit{
  protected email = "";
  constructor(private bigliettiService: BigliettiService, private sessionService: SessionService, private utenteService:UtenteService) {}

  bigliettoData: any;
  ngOnInit(): void {


    this.sessionService.checkSession();

    // Riceve i dati dal backend
    this.sessionService.getLoggedUser().subscribe(response => {
      switch (response.tipo) {
        case 'utente':
          //creo l'oggetto utente
          let utente = new Utente(response, this.utenteService);
          this.email = utente.getIndirizzoEmail();
          break;
      }
      const datiRicerca = {
        //utente: PRENDI EMAIL DALLA SESSION
        utente: this.email
      };
      this.bigliettiService.getBigliettoData(datiRicerca).subscribe(data => {
        this.bigliettoData = data;
      });
    });
  }

  // Funzione per generare il PDF del biglietto
  generatePDF(tratta:any){
    const timestamp = new Date().getTime(); // Ottieni il timestamp corrente
    const nomePDF = `Biglietto_${timestamp}.pdf`; // Genera il nome del PDF con il timestamp

    //creazione documento
    const doc = new jsPDF();

    //gestione intestazione e piè di pagina
    doc.setFillColor('#ED2647');
    doc.setDrawColor('#ED2647');
    doc.rect(0, 0, doc.internal.pageSize.getWidth(), 30, 'FD'); //Intestazione
    doc.addImage('/assets/img/logoPDF.png', 'PNG', (doc.internal.pageSize.getWidth() - 40) / 2 , 3, 40, 24);
    doc.rect(0, doc.internal.pageSize.getHeight() - 30, doc.internal.pageSize.getWidth(), 30, 'FD');  //Piè di pagina

    //gestione scritta nel piè di pagina
    doc.setTextColor('white');
    doc.setFontSize(25);
    doc.text('Grazie per aver scelto di viaggiare con noi!', 22, doc.internal.pageSize.getHeight() - 10);

    //gestione titolo
    doc.setFontSize(25);
    doc.setTextColor('black');
    doc.text('Informazioni Biglietto', 10, 50);
    if(tratta.tipoMezzo == 'AEREO')
      doc.addImage('/assets/icons/planeIcon.png', 'PNG', 95, 44, 6, 6);
    else if(tratta.tipoMezzo == 'AUTOBUS')
      doc.addImage('/assets/icons/busIcon.png', 'PNG', 95, 44, 6, 6);
    else if(tratta.tipoMezzo == 'TRENO')
      doc.addImage('/assets/icons/trainIcon.png', 'PNG', 95, 44, 6, 6);
    // Aggiungi testo al documento PDF, dettagli del biglietto e dell'utente
    doc.setFontSize(22);
    doc.text(tratta.partenza + ' - ' + tratta.destinazione + ' | ' + tratta.id, 10, 65);
    doc.setFontSize(14);
    doc.text('• Nome Completo: ' + tratta.nome + ' ' + tratta.cognome, 10, 75);
    doc.text('• Codice Fiscale: ' + tratta.codiceFiscale, 10, 85);
    doc.text('• Data di Acquisto: ' + tratta.dataAcquisto, 10, 95);
    doc.text('• Data di Scadenza: ' + tratta.scadenza, 10, 105);
    doc.text('• Venditore Biglietto: ' + tratta.venditore, 10, 115);
    doc.addImage('/assets/pdfImage/imgBiglietto.jpg', 'JPG', 10, 125, doc.internal.pageSize.getWidth()-20, 130);
    doc.save(nomePDF); // Salva il documento PDF una volta completato
  }

  setCollapse(tratta:any){
    tratta.collapse = !tratta.collapse;
  }

  isScaduto(scadenza: string): boolean {
    const dataScadenza = new Date(scadenza);
    const dataCorrente = new Date();
    return dataScadenza < dataCorrente;
  }

  getIconName(tipoMezzo: string): string {
    switch (tipoMezzo.toLowerCase()) {
      case 'aereo':
        return 'plane';
      case 'autobus':
        return 'bus';
      case 'treno':
        return 'train';
      default:
        return '';
    }
  }
}
