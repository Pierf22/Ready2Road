import {Component, OnInit} from '@angular/core';
import {SessionService} from '../../services/session.service';
import {AreapersonaleService} from '../../services/areapersonale.service';
import {Utente} from "../../model/Utente";
import {Location} from "@angular/common";
import {Venditore} from "../../model/Venditore";
import Swal from "sweetalert2";
import {NgxSpinnerService} from "ngx-spinner";
import {Router} from "@angular/router";
import {RicercaService} from "../../services/ricerca.service";
import {CookieService} from "ngx-cookie-service";

@Component({
  selector: 'app-area-personale',
  templateUrl: './area-personale.component.html',
  styleUrls: ['./area-personale.component.css']
})

export class AreaPersonaleComponent implements OnInit {
  /* VARIABILI */
  protected user: any;  //oggetto che contiene i dati dell'utente
  protected nome: any;  //nome dell'utente
  protected cognome: any;  //cognome dell'utente
  protected email: any;  //email dell'utente
  protected dataDiNascita: any;  //data di nascita dell'utente
  protected telefono: any;  //numero di telefono dell'utente
  protected color: any;  //colore pastello
  protected iniziali: any;  //iniziali dell'utente
  protected saluto: any; //saluto in base all'ora
  protected numeroBiglietti: any = undefined;  //numero di biglietti acquistati dall'utente
  protected saldo: any = 0;  //saldo dell'utente
  protected numeroTransazioni: any = 0;  //numero di transazioni effettuate dall'utente
  protected puntiAcquisto: any = 0; //contiene i punti acquisto
  protected scrittaTransazione: string = 'transazioni';  //contiene la scritta "transazioni" o "transazione"
  protected scrittaBiglietti: string = 'biglietti';  //contiene la scritta "biglietti" o "biglietto"

  /* COSTRUTTORE */
  constructor(private cookieService: CookieService, private ricercaService: RicercaService, private sessionService: SessionService, private profile: AreapersonaleService, private locate: Location, private spinner: NgxSpinnerService, private router: Router) {}

  /* INIZIALIZZAZIONE */
  ngOnInit(): any {
    // Utilizza l'operatore await per aspettare che l'utente diventi disponibile
    this.sessionService.waitForUser().then(async () => {
      // Ora l'utente è disponibile, puoi ottenere i suoi dati
      this.user = this.sessionService.getUser();
      if (this.user instanceof Utente) {
        this.nome = this.user.getNome();
        this.cognome = this.user.getCognome();
        this.email = this.user.getIndirizzoEmail();
        this.dataDiNascita = this.user.getDataNascita();
        this.telefono = this.user.getNumeroTelefono();
        this.trovaOfferte();
      } else if (this.user instanceof Venditore) {
        this.nome = this.user.getNomeSocieta();
        this.cognome = '';
        this.email = this.user.getIndirizzoEmail();
        this.dataDiNascita = '';
        this.telefono = '';
      }

      if (this.user instanceof Utente)
        this.iniziali = this.user.getNome().charAt(0) + this.user.getCognome().charAt(0);  //estrae le iniziali dell'utente
      else
        this.iniziali = this.user.getNomeSocieta().charAt(0) + this.user.getNomeSocieta().charAt(1);  //estrae le iniziali del venditore
      this.saluto = this.getSaluto();  //genera il saluto
      this.color = this.getInitialsColor(this.iniziali);  //genera un colore di sfondo

      if (!this.seVenditore())
        await this.getNumeroBiglietti();  //ottieni il numero di biglietti acquistati dall'utente
      else
        await this.getNumeroBigliettiVenditore();  //ottieni il numero di biglietti offerti dal venditore

      await this.getSaldo();  //ottieni il saldo dell'utente
      await this.getNumeroTransazioni();  //ottieni il numero di transazioni effettuate dall'utente
    });
  }

  /* GENERAZIONE DI UN COLORE DI SFONDO (SCURO) */
  private getInitialsColor(initials: string): string {
    // Genera un colore pastello in base alle iniziali dell'utente
    const hue = this.hashString(initials) % 360;
    const saturation = 50 + Math.random() * 50;
    const lightness = 50 + Math.random() * 10;

    // Restituisce il colore in formato HSL
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }
  private hashString(str: string): number {
    // Genera un hash univoco a partire da una stringa
    let hash = 0;

    for (let i = 0; i < str.length; i++) {
      const charCode = str.charCodeAt(i);
      hash = (hash << 5) - hash + charCode;
    }

    return hash;
  }

  /* GENERAZIONE DEL SALUTO */
  private getSaluto(): string {
    // Genera un saluto in base all'ora corrente
    let saluto = '';
    const ora = new Date().getHours();
    if (ora >= 6 && ora < 12) {
      saluto = 'Buongiorno';
    } else if (ora >= 12 && ora < 18) {
      saluto = 'Buon pomeriggio';
    } else {
      saluto = 'Buonasera';
    }
    return saluto;
  }

  /* OTTENIMENTO DEL NUMERO DI BIGLIETTI ACQUISTATI */
  async getNumeroBiglietti(): Promise<void> {
    // Ottiene il numero di biglietti acquistati dall'utente
    await new Promise<void>((resolve) => {
      this.profile.getNumeroBiglietti(this.email).subscribe((response: any) => {
          if(response != null)
            this.numeroBiglietti = response.size;

          // Se l'utente ha acquistato un solo biglietto, cambia la scritta da "biglietti" a "biglietto"
          if(this.numeroBiglietti == 1)
            this.scrittaBiglietti = 'biglietto';

          resolve();
        });
    });
  }

  /* OTTENIMENTO DEL NUMERO DI BIGLIETTI OFFERTI DAL VENDITORE */
  async getNumeroBigliettiVenditore(): Promise<void> {
    // Ottiene il numero di biglietti offerti dal venditore
    await new Promise<void>((resolve) => {
      this.profile.getNumeroBigliettiVenditore(this.nome).subscribe((response: any) => {
          if(response != null)
            this.numeroBiglietti = response;

          // Se il venditore ha offerto un solo biglietto, cambia la scritta da "biglietti" a "biglietto"
          if(this.numeroBiglietti == 1)
            this.scrittaBiglietti = 'biglietto';

          resolve();
        });
    });
  }

  /* OTTENIMENTO DEL SALDO */
  async getSaldo(): Promise<void> {
    // Ottiene il saldo dell'utente
    await new Promise<void>((resolve) => {
      this.profile.getSaldo(this.email).subscribe((response: any) => {
          if(response != null) {
            this.saldo = response.saldo;
            this.puntiAcquisto = response.puntiAcquisto;
          }

          resolve();
        });
    });
  }

  /* OTTENIMENTO DEL NUMERO DI TRANSAZIONI EFFETTUATE */
  async getNumeroTransazioni(): Promise<void> {
    // Ottiene il numero di transazioni effettuate dall'utente
    await new Promise<void>((resolve) => {
      this.profile.getNumeroTransazioni(this.email).subscribe((response: any) => {
          if(response != null)
            this.numeroTransazioni = response.transazioni;

          // Se l'utente ha effettuato una sola transazione, cambia la scritta da "transazioni" a "transazione"
          if(this.numeroTransazioni == 1)
            this.scrittaTransazione = 'transazione';

          resolve();
        });
    });
  }

  /* METODO PER RICHIEDERE I BUONI */
  public async getBuono() {
    // metodo per richiedere un buono se i punti acquisto sono maggiori di 100
    if(this.puntiAcquisto >= 100){
      Swal.fire({
        text: 'Vuoi davvero convertire 100 punti acquisto in un buono?',
        icon: 'warning',
        confirmButtonText: 'Ok',
        showCancelButton: true,
        cancelButtonColor: 'var(--primary-color)',
        confirmButtonColor: 'var(--primary-color)',
        background: '#4d4d4d',
        color: 'white'
      }).then(async (result) => {
        // se l'utente conferma, viene generato un buono, i punti acquisto vengono sottratti e la pagina viene ricaricata
        if (result.isConfirmed) {
          this.spinner.show();
          await new Promise<void>((resolve) => {
            this.profile.generateGiftCard(this.email).subscribe((response: any) => {
              resolve();
            });
          });

          this.locate.replaceState('/areapersonale');
          window.location.reload();
        }
      });
    }
    else{
      Swal.fire({
        title: 'Punti Insufficienti',
        text: 'Devi avere almeno 100 punti acquisto per ottenere un buono!',
        icon: 'error',
        confirmButtonText: 'Ok',
        confirmButtonColor: 'var(--primary-color)',
        background: '#4d4d4d',
        color: 'white'
      });
    }
  }

  seVenditore(): boolean {
    return this.user instanceof Venditore;
  } //metodo per verificare se l'utente è un venditore

  protected mostraOfferte: boolean = false;
  protected datiOfferte: any; //variabile che contiene i dati delle offerte
  protected PartenzaScontata: boolean = false; //variabile che indica se l'utente ha diritto allo sconto ulteriore
  protected DestinazioneScontata: boolean = false; //variabile che indica se l'utente ha diritto allo sconto ulteriore
  trovaOfferte(): void {
    //trova la tratta più comune per l'utente
    //chiama il backend con l'email utente
    const datiRicerca = {
      email: this.email
    };
    this.ricercaService.getOfferte(datiRicerca).subscribe(data => {
      if(data != null) {
        this.datiOfferte = data;
        this.mostraOfferte = true;
        if(this.datiOfferte.scontoPartenza > 0)
            this.PartenzaScontata = true;
        else
            this.PartenzaScontata = false;
        if(this.datiOfferte.scontoDestinazione > 0)
          this.DestinazioneScontata = true;
        else
          this.DestinazioneScontata = false;
      }
      else {
        this.mostraOfferte = false;
      }
    });
  }

  compraBiglietto(idPartenza: string, idDestinazione: string): void {
    if (idPartenza == null && idDestinazione == null) {
      // Gestisci il caso in cui entrambi gli ID sono null
      alert('Errore: gli id dei biglietti non sono validi')
      // Puoi mostrare un avviso all'utente o gestire la situazione come preferisci
    } else {
      // Naviga alla nuova pagina e passa gli ID dell'andata e dell'ritorno come parametri
      this.cookieService.set('IdAndata', idPartenza);
      this.cookieService.set('IdRitorno', idDestinazione);
      this.cookieService.set('numBiglietti', '1');
      this.cookieService.set('scontato', 'true');
      this.router.navigate(['/checkout'], {});
    }
  }
}
