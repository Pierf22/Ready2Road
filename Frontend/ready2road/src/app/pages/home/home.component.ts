import {Component, HostListener} from '@angular/core';
import { OnInit } from "@angular/core";
import { trigger, state, style, animate, transition } from '@angular/animations';
import { NgForm } from "@angular/forms";
import { Data } from "@angular/router";
import { RicercaService } from "../../services/ricerca.service";
import {Router} from "@angular/router";
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import {SessionService} from "../../services/session.service";
import {Venditore} from "../../model/Venditore";
import {Utente} from "../../model/Utente";
import {CookieService} from "ngx-cookie-service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  animations: [
    trigger('rotateAnimation', [
      state('initial', style({
        transform: 'rotate(0deg)'
      })),
      state('rotated', style({
        transform: 'rotate(360deg)'
      })),
      transition('initial => rotated', animate('500ms ease-out'))
    ])
  ]
})

export class HomeComponent {
  /* VARIABILI */
  protected bgimage: string[] = [
    "../../../assets/bgHome/sardinia.jpg",
    "../../../assets/bgHome/apulia.jpg",
    "../../../assets/bgHome/emilia-romagna.jpg",
    "../../../assets/bgHome/lombardy.jpg",
    "../../../assets/bgHome/calabria.jpg",
    "../../../assets/bgHome/campania.jpg",
    "../../../assets/bgHome/lazio.jpg",
    "../../../assets/bgHome/abbruzzo.jpg",
    "../../../assets/bgHome/aostaValley.jpg",
    "../../../assets/bgHome/basilicata.jpg",
    "../../../assets/bgHome/friuli.jpg",
    "../../../assets/bgHome/liguria.jpg",
    "../../../assets/bgHome/marche.jpg",
    "../../../assets/bgHome/piedmont.jpg",
    "../../../assets/bgHome/molise.jpg",
    "../../../assets/bgHome/sicily.jpg",
    "../../../assets/bgHome/tuscany.jpg",
    "../../../assets/bgHome/veneto.jpg",
    "../../../assets/bgHome/trentino.jpg",
    "../../../assets/bgHome/umbria.jpg"
  ];  //creo un array di stringhe che contiene tutte le immagini che si alterneranno come sfondo ogni volta che apro la pagina
  protected description: string = "";  //qua è contenuto il testo da visualizzare in base all'immagine
  protected currentImage: string | undefined;   //variabile che contiene l'immagine attuale da mettere come sfondo
  protected isActive: string | null = 'aereo'; //variabile per contenere il pulsante attualmente attivo
  protected rotateState = 'initial'; // variabile per verificare se il bottone è in rotazione o no
  protected testoPartenza = ""; //variabile per contenere il testo del primo input
  protected testoDestinazione = "";   //varibili utili per cambiare poi i testi nei due input
  protected isAndata: string | null = 'a/r';  //variabile che mi dice se è solo andata o andata e ritorno
  protected nPasseggeri: number = 1;  //variabile per contare i passeggeri (massimo 25)
  protected dataPartenza: string = 'ValoreDiDefault'; //valore di default della data di partenza
  protected dataRitorno: string = 'ValoreDiDefault';  //valore di default della data di ritorno
  protected testoBottone = "";  //variabile per contenere il testo del bottone
  protected opzioniSelectPartenza: string[] = []; //variabibile per mantenere le option della select
  protected opzioniSelectDestinazione: string[] = []; //variabibile per mantenere le option della select
  public datiRicerca: any; //variabile che contiene i dati della ricerca

  constructor(private ricercaService: RicercaService, private router: Router, private sessionService: SessionService, private cookie: CookieService) {}  //costruttore

  ngOnInit() {
    //all'avvio viene chiamata questa funzione che permette di estrarre lo sfondo da settare
    this.setRandomBackground();
    //viene chiamata la funzione per settare la descrizione in base alla località
    this.setDescription();
    //viene chiamata la funzione per ottenere tutte le città da cui ci sono tratte relative alla partenza
    this.getPartenze();
    this.sessionService.checkSession();
  //  this.sessionService.checkUser();
    this.waitUser();
  }  //funzione chiamata all'avvio

  protected user: any;
  protected name = "Login";
  protected email: string = "email";
  protected loggedUser: boolean = false;
  async waitUser(): Promise<void> {
    await this.sessionService.waitForUser();
    this.user = this.sessionService.getUser();
    if(this.user instanceof Utente) {
      this.name = this.user.getNome();
      this.loggedUser = true;
      this.email = this.user.getIndirizzoEmail();
    }
  }

  public setRandomBackground() {
    const randomIndex = Math.floor(Math.random() * this.bgimage.length);
    this.currentImage = this.bgimage[randomIndex];
  }  //funzione che serve a decidere quale immagine, tra quelle disponibili, andare a settare come sfondo
  public setDescription() {
    if (this.currentImage === "../../../assets/bgHome/sardinia.jpg")
      this.description = "Benvenuto sulla Costa Smeralda, una gemma nascosta della splendida Sardegna. Qui, le acque cristalline del Mar Mediterraneo bagnano spiagge di sabbia bianca, mentre le colline circostanti offrono panorami mozzafiato. Esplora l'elegante Porto Cervo, con le sue boutique di lusso e i ristoranti gourmet, o rilassati su spiagge incontaminate immerse nella natura. La Costa Smeralda è un paradiso che ti invita a scoprire la bellezza senza tempo dell'isola.";
    if (this.currentImage === "../../../assets/bgHome/apulia.jpg")
      this.description = "Benvenuto a Gallipoli, una perla affacciata sullo splendido Mar Ionio. Con le sue strade lastricate, le antiche mura e le chiese storiche, Gallipoli è un incantevole mix di storia e bellezza costiera. Sito pittoresco, il centro storico offre scorci affascinanti sul mare, mentre le spiagge di sabbia bianca invitano a momenti di relax e divertimento. Gallipoli è un tesoro da esplorare, dove la cultura locale si fonde con il fascino del Mediterraneo.";
    if (this.currentImage === "../../../assets/bgHome/emilia-romagna.jpg")
      this.description = "Benvenuto a Riccione, la perla della Riviera Romagnola. Con le sue spiagge dorate, le acque cristalline dell'Adriatico e l'atmosfera vivace, Riccione è la destinazione perfetta per chi cerca divertimento e relax. Passeggia lungo il famoso Viale Ceccarini, esplora le attrazioni locali e immergiti nella cultura della Riviera. Riccione è la sintesi di eleganza, divertimento e sole, offrendo un mix perfetto per una vacanza indimenticabile.";
    if (this.currentImage === "../../../assets/bgHome/lombardy.jpg")
      this.description = "Benvenuto a Milano, la capitale della moda e dell'eleganza in Italia. Con la sua combinazione di storia ricca, architettura moderna e vibrante vita notturna, Milano è una destinazione cosmopolita che offre qualcosa per tutti. Ammira la magnificenza del Duomo, passeggiando per le strade dello shopping di classe, e immergiti nella cultura culinaria e artistica. Milano è una città dove il passato e il presente si fondono, offrendo un'esperienza unica.";
    if (this.currentImage === "../../../assets/bgHome/calabria.jpg")
      this.description = "Benvenuto a Le Castella, un incantevole borgo marinaro situato sulla costa ionica della Calabria. Con il suo antico castello aragonese che si erge maestoso sulla punta della penisola, Le Castella è una perla mediterranea che cattura l'immaginazione. Esplora le acque cristalline che circondano il castello, ammira la bellezza delle spiagge dorate e lasciati avvolgere dalla magia di un luogo ricco di storia e paesaggi mozzafiato.";
    if (this.currentImage === "../../../assets/bgHome/campania.jpg")
      this.description = "Benvenuto a Napoli, una città dai contrasti affascinanti, ricca di storia, cultura e autenticità. Con le sue strade animate, l'atmosfera vivace e la deliziosa cucina partenopea, Napoli ti accoglie con il suo carattere unico. Ammira il maestoso Vesuvio che sovrasta la città, esplora i vicoli della Napoli antica, e lasciati incantare dalle opere d'arte e dall'architettura grandiosa. Napoli è un viaggio nel passato con uno sguardo rivolto al futuro.";
    if (this.currentImage === "../../../assets/bgHome/lazio.jpg")
      this.description = "Benvenuto a Roma, la Città Eterna, un luogo che incarna millenni di storia, arte e cultura. Con i suoi iconici monumenti, come il Colosseo e il Pantheon, e le piazze affollate di vita, Roma è un viaggio nel passato che si fonde con la modernità. Perditi tra le strette stradine del centro storico, assapora la cucina italiana autentica e ammira la grandiosità dei musei e delle chiese. Roma è una città eterna, pronta a catturare il tuo cuore con la sua bellezza senza tempo.";
    if (this.currentImage === "../../../assets/bgHome/abbruzzo.jpg")
      this.description = "Benvenuto a Pescara, una splendida città costiera che abbraccia la bellezza dell'Adriatico. Con le sue lunghe spiagge di sabbia dorata, il lungomare vivace e la vibrante vita notturna, Pescara è il luogo ideale per un mix di relax e divertimento. Esplora il centro storico con le sue stradine accoglienti, assapora la cucina abruzzese autentica e goditi lo scenario di montagne che si affacciano sul mare. Pescara è una destinazione che offre una fuga perfetta dalla routine quotidiana.";
    if (this.currentImage === "../../../assets/bgHome/aostaValley.jpg")
      this.description = "Benvenuto ad Aosta, una città incantevole circondata dalle maestose vette delle Alpi. Con il suo ricco patrimonio storico e culturale, Aosta è un gioiello nel cuore delle montagne. Passeggia attraverso le antiche rovine romane, ammira i castelli medievali e goditi la vista panoramica sulle montagne circostanti. Aosta offre un mix affascinante di tradizione alpina e storia romana, creando un'atmosfera unica nel suo genere.";
    if (this.currentImage === "../../../assets/bgHome/basilicata.jpg")
      this.description = "Benvenuto a Matera, una città incantevole incastonata tra le suggestive colline della Basilicata. Con i suoi antichi sassi, le grotte scavate nella roccia e l'atmosfera magica, Matera è un viaggio nel tempo che ti trasporterà in un mondo unico. Esplora le stradine tortuose dei Sassi, ammira l'architettura rupestre millenaria e lasciati conquistare dal fascino di una città che ha conservato la sua autenticità nel corso dei secoli.";
    if (this.currentImage === "../../../assets/bgHome/friuli.jpg")
      this.description = "Benvenuto al Golfo di Trieste, un tratto di costa incantevole che unisce l'Italia e la Slovenia, cullato dalle acque azzurre dell'Adriatico. Con le sue spiagge nascoste, le scogliere panoramiche e le città costiere pittoresche, il Golfo di Trieste è una gemma nascosta di bellezza marittima. Passeggia lungo le rive, ammira il mare che si estende all'orizzonte e immergiti nell'atmosfera serena di questo angolo di paradiso costiero.";
    if (this.currentImage === "../../../assets/bgHome/liguria.jpg")
      this.description = "Benvenuto alle Cinque Terre, un paradiso costiero lungo la Riviera Ligure, dove le colline incontrano il mare in un'armonia di colori vivaci e paesaggi mozzafiato. Con i suoi pittoreschi villaggi di pescatori, le case colorate che si arrampicano sulle scogliere e le stradine tortuose, le Cinque Terre sono un tesoro da scoprire. Goditi il suono delle onde che si infrangono sulle spiagge di ciottoli, assapora il pesce fresco nei ristoranti sul mare e lasciati avvolgere dalla magia di questo tratto di costa incantevole.";
    if (this.currentImage === "../../../assets/bgHome/marche.jpg")
      this.description = "Benvenuto ad Ancona, una città portuale che si affaccia sul Mar Adriatico, con il suo mix affascinante di storia, cultura e bellezze naturali. Passeggia lungo il caratteristico porto, ammira l'architettura storica che si fonde con la modernità e immergiti nell'atmosfera autentica di questa destinazione marittima. Con le sue colline verdi, le spiagge accoglienti e la ricca scena culinaria, Ancona è una gemma dell'Adriatico pronta a sorprenderti ad ogni passo.";
    if (this.currentImage === "../../../assets/bgHome/piedmont.jpg")
      this.description = "Benvenuto a Torino, una città di eleganza e storia, incorniciata dalle maestose Alpi. Con la sua architettura raffinata, le ampie piazze e il ricco patrimonio culturale, Torino è una destinazione che fonde il classico e il contemporaneo. Passeggia lungo gli storici portici, ammira la Mole Antonelliana che svetta nel cielo e deliziati con la cucina piemontese rinomata in tutto il mondo. Torino è una città che ti invita a scoprire la sua bellezza senza tempo.";
    if (this.currentImage === "../../../assets/bgHome/molise.jpg")
      this.description = "Benvenuto a Campobasso, un gioiello nascosto nel cuore della regione Molise. Con le sue antiche stradine, i palazzi storici e il paesaggio collinare circostante, Campobasso è una destinazione che incanta con la sua autenticità e il suo fascino rustico. Goditi la tranquillità delle piazze accoglienti, assapora la cucina molisana genuina e immergiti nella cultura di questa città che custodisce segreti e tradizioni.";
    if (this.currentImage === "../../../assets/bgHome/sicily.jpg")
      this.description = "Benvenuto a Isola Bella, un autentico paradiso naturale nella splendida Sicilia. Con la sua spiaggia di ciottoli, le acque cristalline e la vegetazione lussureggiante, Isola Bella è un gioiello incastonato nel Mar Ionio. Passeggia lungo i sentieri panoramici, ammira la flora e fauna uniche e fatti catturare dalla magia di questa piccola isola, dichiarata Riserva Naturale. Un luogo dove la natura si fonde con la bellezza mediterranea, creando un'atmosfera di pace e serenità.";
    if (this.currentImage === "../../../assets/bgHome/tuscany.jpg")
      this.description = "Benvenuto a Firenze, il cuore dell'arte, della cultura e della storia in Italia. Con i suoi monumenti rinascimentali, i musei straordinari e i vicoli accoglienti, Firenze è una città che incanta i suoi visitatori ad ogni passo. Ammira la maestosità del Duomo, passeggiando sul famoso Ponte Vecchio e immergiti nelle opere d'arte dei grandi maestri nei musei. Firenze è un'esperienza senza tempo, dove il passato e il presente si incontrano in un abbraccio affascinante.";
    if (this.currentImage === "../../../assets/bgHome/veneto.jpg")
      this.description = "Benvenuto a Venezia, la città dei canali e dei sogni. Con i suoi canali romantici, i ponti storici e le piazze affollate, Venezia è un'opera d'arte vivente che ti cattura con la sua bellezza unica. Gondole che scivolano dolcemente sull'acqua, palazzi ornati che si specchiano nei canali e l'atmosfera magica di Piazza San Marco rendono Venezia una delle destinazioni più affascinanti al mondo. Lasciati trasportare dai canali serpeggianti e dai segreti delle calli, immergendoti in un mondo senza tempo.";
    if (this.currentImage === "../../../assets/bgHome/umbria.jpg")
      this.description = "Benvenuto a Perugia, una città incantevole situata tra le verdi colline dell'Umbria. Con i suoi vicoli medievali, le piazze storiche e la vista panoramica sulla campagna circostante, Perugia è un gioiello che conserva il suo fascino antico. Esplora il centro storico con i suoi tesori artistici, assapora la cucina umbra nei caratteristici ristoranti e respira l'atmosfera culturale che permea ogni angolo di questa città affascinante.";
    if (this.currentImage === "../../../assets/bgHome/trentino.jpg")
      this.description = "Benvenuto a Trento, una città incantevole incastonata tra le montagne delle Dolomiti. Con i suoi edifici storici, le piazze accoglienti e la vista panoramica sulle Alpi, Trento è una destinazione che ti regala un mix unico di cultura e bellezze naturali. Passeggia lungo le strade del centro storico, ammira i tesori artistici, e lasciati affascinare dalla tranquillità di questa città alpina, dove il passato e la natura si fondono in un'armonia affascinante.";
  }  //funzione che serve per settare la descrizione
  public setActiveButton(buttonType: string): void {
    //setto il nuovo pulsante attivo
    this.isActive = buttonType;
    //setto partenza e destinazione a vuoto
    this.testoPartenza = "";
    this.testoDestinazione = "";
    //prendo le nuove partenze in base al mezzo
    this.getPartenze();
  } // Metodo per impostare il pulsante attivo
  public setAndataRitorno(buttonType: string): void {
    this.isAndata = buttonType;
  } // Metodo per impostare il tipo di viaggio
  public handleButtonClick(): void {
    //funzione che si occupa di ruotare il bottone per lo scambio di partenza e destinazione
    if (this.rotateState === 'initial') {
      this.rotateState = 'rotated';

      //Aggiorno i testi dei due pulsanti
      this.testoDestinazione = "";
      //verifico se la località del secondo select è presente tra le partenze allora la metto come partenza sennò elimino tutti e due i campi
      if(this.opzioniSelectPartenza.includes((<HTMLInputElement>document.getElementById('destinazione')).value)) {
        this.testoPartenza = (<HTMLInputElement>document.getElementById('destinazione')).value;
        this.getDestinazioni();
      } else
        this.testoPartenza = "";
    }
  } //Funzione che effettua la rotazione
  public onAnimationEnd(): void {
    this.rotateState = 'initial';
  }   //Funzione che resetta lo stato dell'animazione
  public addPasseggero() {
    if (this.nPasseggeri < 25)
      this.nPasseggeri++;
  } //funzione che aggiunge un passeggero
  public removePasseggero() {
    if (this.nPasseggeri > 1)
      this.nPasseggeri--;
  } //funzione che rimuove un passeggero
  public checkPartenza() {
    //verifico che la data di partenza non sia precedente a quella attuale
    const selected = new Date(this.dataPartenza);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    selected.setHours(0, 0, 0, 0);

    if (selected < today) {
      this.dataPartenza = 'ValoreDiDefault';
      this.dataRitorno = 'ValoreDiDefault';
    }
  } //funzione che verifica la data di partenza
  public checkRitorno() {
    //verifico che la data di ritorno non sia precedente a quella di partenza
    const selected = new Date(this.dataRitorno);
    const partenza = new Date(this.dataPartenza);

    selected.setHours(0, 0, 0, 0);
    partenza.setHours(0, 0, 0, 0);

    if (this.dataRitorno < this.dataPartenza)
      this.dataRitorno = 'ValoreDiDefault';
  }  //funzione che verifica la data di ritorno
  public ricerca() {
    //verifico che tutti i campi siano stati compilati correttamente
    if((this.isAndata == "a/r" && this.testoPartenza != "" && this.testoDestinazione != "" && this.dataPartenza != "ValoreDiDefault" && this.dataRitorno != "ValoreDiDefault") ||
    this.isAndata != "a/r" && this.testoPartenza != "" && this.testoDestinazione != "" && this.dataPartenza != "ValoreDiDefault"){
      // Creo un oggetto con i dati della ricerca
      const datiRicerca = {
        mezzo: this.isActive,
        andataRitorno: this.isAndata,
        partenza: this.testoPartenza,
        destinazione: this.testoDestinazione,
        dataPartenza: this.dataPartenza,
        dataRitorno: this.dataRitorno,
        numeroPasseggeri: this.nPasseggeri,
      };
      this.cookie.set('numBiglietti', this.nPasseggeri.toString()); //aggiungo il numero di biglietti che si vuole acquistare ai cookie
      // invia i dati al backend e gli chiede di fare la ricerca delle tratte disponibili con i dati inseriti
      const observer = {
        next: (response: any) => {
          this.datiRicerca = response;
        },
        error: (error: any) => {
          console.error('Errore durante l\'invio dei dati:', error);
        },
        complete: () => {
          //una volta completato mando i dati alla pagina che visualizza la ricerca
          this.router.navigate(['/ricerca'], { state: { datiRicerca: this.datiRicerca } });
        },
      };
      this.ricercaService.getRicerca(datiRicerca).subscribe(observer);
    }
    else
      //se non sono stati compilati correttamente i campi, mostro un messaggio di errore
      Swal.fire({
        title: 'Attenzione!',
        text: 'Alcuni campi non sono stati compilati correttamente!',
        confirmButtonText: 'Ok',
        icon: 'error',
        background: '#4d4d4d',
        color: 'white',
        confirmButtonColor: 'var(--primary-color)',
      });
  } //Funzione che si occupa di chiamare il backend per la ricerca

  @HostListener('window:resize', ['$event'])
  public onResize(event: any): void {
    this.setButtonText();
  } //funzione che viene chiamata quando la finestra viene ridimensionata

  private setButtonText(): void {
    const screenWidth = window.innerWidth;

    if (screenWidth <= 1200 && screenWidth > 380) {
      this.testoBottone = 'Cerca';
    } else {
      this.testoBottone = "";
    }
  } //funzione che setta il testo del bottone in base alla grandezza della finestra
  public getPartenze(){
    const datiRicerca = {
      mezzo: this.isActive
    }

    //chiede al backend le città di partenza
    this.ricercaService.getPartenze(datiRicerca).subscribe((response: any) => {
      if(response != null)
        this.opzioniSelectPartenza = response.map((item: { partenza: any; }) => item.partenza);
    });
  } //metodo per ottenere le partenze
  public getDestinazioni(){
    this.testoDestinazione = "";
    const datiRicerca = {
      mezzo: this.isActive,
      partenza: this.testoPartenza
    };

    // chiede al backend le città di destinazione
    const observer = {
      next: (response: any) => {
        this.opzioniSelectDestinazione = response.map((item: { destinazione: any; }) => item.destinazione);
      },
      error: (error: any) => {
        console.error('Errore durante l\'invio dei dati:', error);
      },
      complete: () => {},
    };

    this.ricercaService.getDestinazioni(datiRicerca).subscribe(observer);
  } //metodo per ottenere le destinazioni

  protected readonly style = style; //variabile per animazione
}
