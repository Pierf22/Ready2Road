import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {SessionService} from "../../services/session.service";
import {Utente} from "../../model/Utente";
import {AcquistoService} from "../../services/acquisto.service";
import {RicercaService} from "../../services/ricerca.service";
import {WalletService} from "../../services/wallet.service";
import {CookieService} from "ngx-cookie-service";

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit{
  constructor(private router: Router, private cookieService: CookieService, private walletService: WalletService, private ricercaService: RicercaService, private sessionService: SessionService, private acquistoService: AcquistoService) { }

  protected idAndata = '';
  protected idRitorno = '';
  protected scontato = false;
  protected numBiglietti = 0;
  bigliettoData: any;

  async ngOnInit(): Promise<void> {

    this.idAndata = this.cookieService.get('IdAndata');
    this.idRitorno = this.cookieService.get('IdRitorno');
    this.numBiglietti = Number(this.cookieService.get('numBiglietti'));
    this.scontato = this.cookieService.get('scontato') === 'true';



    this.sessionService.checkSession();
    this.waitUser();
    this.generateBigliettiFields();

    // Utilizza l'operatore await per aspettare che l'utente diventi disponibile
    await this.sessionService.waitForUser().then(async () => {
      // Ora l'utente è disponibile, puoi ottenere i suoi dati
      this.user = this.sessionService.getUser();
      await this.getSaldo();  //ottieni il saldo dell'utente
      this.prendiCostoAndata(this.idAndata);
      if(this.idRitorno != ''){
        this.prendiCostoRitorno(this.idRitorno);
      }
    });
  }

  saldo: any;

  async getSaldo(): Promise<void> {
    // Ottiene il saldo dell'utente
    await new Promise<void>((resolve) => {
      this.acquistoService.getSaldo(this.email).subscribe((response: any) => {
        if(response != null) {
          this.saldo = response.saldo;
        }

        resolve();
      });
    });
  }

  generateBigliettiFields() {
    this.bigliettoData = [];
    for (let i = 0; i < this.numBiglietti; i++) {
      this.bigliettoData.push({
        id: i,
        nome: '',
        cognome: '',
        CF: ''
      });
    }
  }


  protected user: any;
  protected email: string = "null";
  protected loggedUser: boolean = false;
  async waitUser(): Promise<void> {
    await this.sessionService.waitForUser();
    this.user = this.sessionService.getUser();
    if(this.user instanceof Utente) {
      this.loggedUser = true;
      this.email = this.user.getIndirizzoEmail();
      this.walletService.getWallet(this.email);
      this.wallet = this.walletService.wallet;
    }
    else{
      alert("Effettua il login per completare l'acquisto");
      window.location.href = 'http://localhost:8080/login';
    }
  }

  prezzoAndata: number = 0;
  prezzoRitorno: number = 0;
  sconto: number = 0;

  async prendiCostoAndata(IdTratta: string): Promise<void> {
    //trova la tratta più comune per l'utente
    //chiama il backend con l'email utente
    const datiRicerca = {
      IdTratta: IdTratta
    };
    this.ricercaService.getTratta(datiRicerca).subscribe(data => {
      if(data != null) {
        this.prezzoAndata += data.prezzo;
        this.prezzoAndata - ((this.prezzoAndata) * data.sconto);
        if(this.scontato){
          this.prezzoAndata = this.prezzoAndata - ((this.prezzoAndata/100) * 10);
        }
      }
    });
  }

  async prendiCostoRitorno(IdTratta: string): Promise<void> {
    //trova la tratta più comune per l'utente
    //chiama il backend con l'email utente
    const datiRicerca = {
      IdTratta: IdTratta
    };
    this.ricercaService.getTratta(datiRicerca).subscribe(data => {
      if(data != null) {
        this.prezzoRitorno += data.prezzo;
        this.prezzoRitorno - ((this.prezzoRitorno) * data.sconto);
        if(this.scontato){
          this.prezzoRitorno = this.prezzoRitorno - ((this.prezzoRitorno/100) * 10);
        }
      }
    });
  }

  async prendiCodiceSconto(): Promise<void> {
    const CodiceSconto = (<HTMLInputElement>document.getElementById('sconto')).value;
    if(CodiceSconto !== '') {
      this.acquistoService.getSconto(CodiceSconto).subscribe(data => {
        const obj = JSON.parse(data);
        const valore: number = obj.valore;
        if (valore != null) {
          this.sconto = valore;
        } else {
          alert('Codice sconto non valido');
        }
      });
    }
  }

  async inviaBiglietto(i: number): Promise<void> {
    const nome = (<HTMLInputElement>document.getElementById('nome' + i)).value;
    const cognome = (<HTMLInputElement>document.getElementById('cognome' + i)).value;
    const CF = (<HTMLInputElement>document.getElementById('CF' + i)).value;
    const datiRicerca = {
      andata: this.idAndata,
      ritorno: this.idRitorno,
      nome: nome,
      cognome: cognome,
      email: this.email,
      CF: CF
    }
    await new Promise<void>((resolve) => {
      this.acquistoService.sendAcquisto(datiRicerca).subscribe((data: any) => {

        resolve();
      });
    });
  }


  async scalaDenaro(prezzo: number, tratta: String): Promise<void> {
    const datiRicerca = {
      email: this.email,
      prezzo: prezzo,
      tratta: tratta
    }
    await new Promise<void>((resolve) => {
      this.acquistoService.scalaDenaro(datiRicerca).subscribe((data: any) => {

        resolve();
      });
    });
  }

  async aggiungiDenaro(sconto: number): Promise<void> {
    const datiRicerca = {
      email: this.email,
      prezzo: sconto
    }
    await new Promise<void>((resolve) => {
      this.acquistoService.aggiungiDenaro(datiRicerca).subscribe((data: any) => {
        resolve();
      });
    });
  }


  async eliminaBuono() {
    const datiRicerca = {
      buono: (<HTMLInputElement>document.getElementById('sconto')).value
    }
    await new Promise<void>((resolve) => {
      this.acquistoService.eliminaBuono(datiRicerca).subscribe(data => {
        resolve();
      });
    });
  }

  wallet: any;

  async inviaDati() {
    this.prezzoAndata = this.prezzoAndata * this.numBiglietti;
    this.prezzoRitorno = this.prezzoRitorno * this.numBiglietti;
    for (let i = 0; i < this.numBiglietti; i++) {
      const nome = (<HTMLInputElement>document.getElementById('nome' + i)).value;
      const cognome = (<HTMLInputElement>document.getElementById('cognome' + i)).value;
      const CF = (<HTMLInputElement>document.getElementById('CF' + i)).value;
      //controlla che tutti i campi siano stati compilati
      if (nome === '' || cognome === '' || CF === '') {
        alert('Compila tutti i campi');
        return;
      }
      //controlla regex CF
        if (!/^[A-Za-z]{6}[0-9]{2}[ABCDEHLMPRSTabcdehlmprst]{1}[0-9]{2}[A-Za-z]{1}[0-9]{3}[A-Za-z]{1}$/.test(CF)) {
            alert('Codice fiscale non valido');
            return;
        }
    }

    //controlli superati, invia i dati e controlla che l'utente abbia saldo sufficiente
    //controlla se c'è un codice sconto
    this.wallet = this.walletService.wallet;

    //controlla che il saldo sia sufficiente
    if (this.wallet.saldo < this.prezzoAndata+this.prezzoRitorno-this.sconto) {
      alert('Saldo insufficiente');
      return;
    }

    if(this.prezzoAndata+this.prezzoRitorno-this.sconto < 0){
      //se lo sconto è maggiore del costo totale, lo sconto diventa il costo totale e il buono viene utilizzato ugualmente per intero
      this.sconto = this.prezzoAndata+this.prezzoRitorno;
      this.eliminaBuono();
    }

    await this.scalaDenaro(this.prezzoAndata, this.idAndata);
    if(this.idRitorno != ''){
      await this.scalaDenaro(this.prezzoRitorno, this.idRitorno);
    }

    //restituisce il denaro coperto dallo sconto
    if(this.sconto > 0) {
      this.aggiungiDenaro(this.sconto);
    }
    //controlla che il saldo sia sufficiente + eventuali buoni
    for (let i = 0; i < this.numBiglietti; i++) {
      this.inviaBiglietto(i);
    }

    this.cookieService.delete('IdAndata');
    this.cookieService.delete('IdRitorno');
    this.cookieService.delete('numBiglietti');
    this.cookieService.delete('scontato');

    alert("Acquisto effettuato con successo");
    this.router.navigate(['/home'], {});
  }

}
