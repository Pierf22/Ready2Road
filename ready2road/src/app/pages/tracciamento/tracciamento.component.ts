import {AfterViewInit, Component} from '@angular/core';
import {TracciamentoService} from '../../services/tracciamento.service';
import {NgxSpinnerService} from "ngx-spinner";
import * as mappa from 'leaflet';
import {DatePipe} from '@angular/common';
import * as tween from '@tweenjs/tween.js';
import Swal from 'sweetalert2';
import 'leaflet-rotatedmarker';

declare const L: any; //costante che mi serve per creare i marker

@Component({
  selector: 'app-tracciamento',
  templateUrl: './tracciamento.component.html',
  styleUrls: ['./tracciamento.component.css']
})

export class TracciamentoComponent implements AfterViewInit {
  /* VARIABILI */
  protected stringaOrario: string = ''; //contiene l'orario di partenza
  protected idTratta: string = ''; // contiene il codice della Tratta
  protected cittaPartenza = '';   //contiene il nome della città di partenza
  protected cittaDestinazione ='';    //contiene il nome della città di destinazione
  protected nomeVenditore = '';       //contiene il nome della società di trasporto
  protected dataPartenza: string | null = ''; //contiene l'ora di partenza
  protected dataArrivo: string | null = '';   //contiene l'ora di arrivo
  protected markerTween: any; //variabile utile per l'animazione
  protected coordinatePartenza: any;  //contiene le coordinate della città di partenza per la visualizzazione del mezzo
  protected cordP: any; //contiene le coordinate della città di partenza
  protected coordinateDestinazione: any;  //contiene le coordinate della città di destinazione
  protected tipo_mezzo: string = ''; //contiene il tipo di mezzo
  protected data_ora: string = ''; //data di partenza che viene dal DB
  protected moveInterval: number = 0; // Durata animazione in millisecondi
  protected dataArrivoEstesa: any; //contiene l'ora di arrivo estesa
  protected durataTratta: any;  //contiene la durata della tratta
  protected distanzaTotale: any; //contiene la distanza totale
  protected customPopUp: any = null; //contiene il popup
  protected marker: any;  //contiene il marker della mappa
  private map: any; // contiene la mappa
  private weatherPartenza: any; //contiene il meteo della città di partenza
  private weatherDestinazione: any; //contiene il meteo della città di destinazione
  private temperaturePartenza: any; //contiene la temperatura della città di partenza
  private temperatureDestinazione: any; //contiene la temperatura della città di destinazione
  private umiditaPartenza: any; //contiene l'umidità della città di partenza
  private umiditaDestinazione: any; //contiene l'umidità della città di destinazione

  /* COSTRUTTORE */
  constructor(private tracciamentoService: TracciamentoService, private datePipe: DatePipe, private spinner: NgxSpinnerService) {}

  /* GESTIONE AVVIO */
  ngAfterViewInit(): void {
    this.initMap(); //inizializza la mappa
  }

  /* GESTIONE DELLA MAPPA E DEI MARKER */
  private initMap(): void {
    //inizializzo la mappa settando le coordinate di avvio e lo zoom, inoltre disabilito il controllo a video dello zoom
    this.map = mappa.map('map', { zoomControl: false }).setView([41.9, 12.5], 8);
    //aggiungo il tileLayer della mappa
    mappa.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);
  } //inizializza la mappa
  private async addMarker(): Promise<void> {
    //marker
    let iconMarker: any = null;
    let cittaPartenza: any = null;
    let cittaDestinazione: any = null;

    //creo l'icona del marker
    if (this.tipo_mezzo === 'AEREO')
      //se il mezzo è un aereo allora gli assegno l'icona dell'aereo di colore nero e dimensione 32x32
      iconMarker = L.icon({
        iconUrl: '/assets/icons/planeIcon.png',
        iconSize: [32, 32]
      });
    else if (this.tipo_mezzo === 'TRENO')
      //se il mezzo è un treno allora gli assegno l'icona del treno di colore nero e dimensione 32x32
      iconMarker = L.icon({
        iconUrl: '/assets/icons/trainIcon.png',
        iconSize: [32, 32]
      });
    else if (this.tipo_mezzo === 'BUS')
      //se il mezzo è un bus allora gli assegno l'icona del bus di colore nero e dimensione 32x32
      iconMarker = L.icon({
        iconUrl: '/assets/icons/busIcon.png',
        iconSize: [32, 32]
      });

    await this.getWeather();  //prendo i dati sul meteo

    //pin per città di partenza e destinazione
    cittaPartenza = L.icon({
      iconUrl: '/assets/icons/pinCity.png',
      iconSize: [32, 32]
    });
    cittaDestinazione = L.icon({
      iconUrl: '/assets/icons/pinCity.png',
      iconSize: [32, 32]
    });
    //creo il pop up per la città di partenza con i dati meteo
    (L.marker(this.cordP, {icon: cittaPartenza}).bindPopup("<div><i class='fa-solid fa-plane-departure'></i> " + this.cittaPartenza + "<br>" + this.weatherPartenza + "<br><i class='fa-solid fa-temperature-three-quarters'></i> Temperatura: " + this.temperaturePartenza + "°<br><i class='fa-solid fa-droplet'></i> Umidità: " + this.umiditaPartenza + "%</div>").openPopup()).addTo(this.map);
    //creo il pop up per la città destinazione con i dati meteo
    (L.marker(this.coordinateDestinazione, {icon: cittaDestinazione}).bindPopup("<div><i class='fa-solid fa-plane-arrival'></i> " + this.cittaDestinazione + "<br>" + this.weatherDestinazione + "<br><i class='fa-solid fa-temperature-three-quarters'></i> Temperatura: " + this.temperatureDestinazione + "°<br><i class='fa-solid fa-droplet'></i> Umidità: " + this.umiditaDestinazione + "%</div>").openPopup()).addTo(this.map);

    //creo il marker e lo aggiungo alla mappa
    this.marker = L.marker(this.coordinatePartenza, {icon: iconMarker});
    if (this.tipo_mezzo === 'AEREO')
      this.marker.setRotationAngle(this.getAngle(this.coordinatePartenza, this.coordinateDestinazione));

    if (this.customPopUp != null)
      this.marker.bindPopup(this.customPopUp).openPopup();

    this.marker.addTo(this.map);
  } //aggiunge il mezzo alla mappa
  private stopTween(): void {
    if(this.markerTween != undefined)
      this.markerTween.stop();
  } //serve per stoppare l'animazione del marker aereo
  private removeAllMarkers(): void {
    this.map.eachLayer((layer: any) => {
      if (layer instanceof L.Marker) {
        this.map.removeLayer(layer);
      }
    });
  } //rimuove tutti i marker dalla mappa

  /* CALCOLO ANGOLO */
  private getAngle(source: any, destination: any): number {
    const startLat = this.toRadians(source[0]);
    const startLng = this.toRadians(source[1]);
    const endLat = this.toRadians(destination[0]);
    const endLng = this.toRadians(destination[1]);

    const dLng = endLng - startLng;

    const x = Math.sin(dLng) * Math.cos(endLat);
    const y = Math.cos(startLat) * Math.sin(endLat) - Math.sin(startLat) * Math.cos(endLat) * Math.cos(dLng);

    let angle = Math.atan2(x, y);
    angle = this.toDegrees(angle);

    return (angle + 360) % 360;
  } //funzione utile per calcolare l'angolo di movimento del marker aereo
  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  } // Funzione di utilità per convertire gradi in radianti
  private toDegrees(radians: number): number {
    return radians * (180 / Math.PI);
  } // Funzione di utilità per convertire radianti in gradi

  /* FUNZIONI PER L'ANIMAZIONE */
  private async pinSettings(): Promise<void> {
    //in base al tipo di mezzo scelto, chiamo la funzione corrispondente per la stima della posizione di partenza
    if (this.tipo_mezzo === 'AEREO')
      await this.positionEstimatePlane();
    else if (this.tipo_mezzo === 'BUS')
      await this.positionEstimateBus();
    else if (this.tipo_mezzo === 'TRENO')
      await this.positionEstimateTrain();

    if (this.tipo_mezzo === 'AEREO')
      this.animateMarker();  //fa partire l'animazione
  } // gestisce la posizione inziale del marker e fa partire l'animazione
  private animateMarker(): void {
    //creo l'animazione del marker
    const start = { lat: this.coordinatePartenza[0], lng: this.coordinatePartenza[1] }; //coordinate di partenza
    const end = { lat: this.coordinateDestinazione[0], lng: this.coordinateDestinazione[1] }; //coordinate di arrivo
    //fa partire l'animazione del marker che deve arrivare fino alla destinazione indicata da 'end' in un tempo di 'this.moveInterval' millisecondi, ad ogni ciclo di animazione aggiorna la posizione del marker
    this.markerTween = new tween.Tween(start)
      .to(end, this.moveInterval)
      .onUpdate(() => {
        this.marker.setLatLng([start.lat, start.lng]);
        this.map.panTo([start.lat, start.lng]);
      })
      .start();
    function animate(time: number) {
      requestAnimationFrame(animate);
      tween.update(time);
    }
    animate(0);
  }  //funzione che sposta il marker

  /* GESTIONE DELLA TRATTA */
  public async getTratta(){
    this.spinner.show();    //animazione di caricamento

    (<HTMLButtonElement>document.getElementById('btnRicerca')).disabled = true;
    this.stopTween();
    this.removeAllMarkers();

    //verifico se la tratta inserita esiste
    await new Promise<void>((resolve) => {
      this.tracciamentoService.getTratta(this.idTratta).subscribe((response: any) => {
        if(response != null) {
          //devo prendere le coordinate delle due città
          this.cittaPartenza = response.partenza;
          this.cittaDestinazione = response.destinazione;
          this.nomeVenditore = response.venditore;
          this.dataPartenza = this.datePipe.transform(new Date(response.data_ora), 'HH:mm');
          this.tipo_mezzo = response.tipo_mezzo;
          this.data_ora = response.data_ora;
        }
        else {
          this.errorAlert('La tratta inserita non esiste, si prega di riprovare!');
          return;
        }

        resolve();
      },
        (error: any)=>{
          this.errorAlert('Si è verificato un errore interno, si prega di riprovare!');
          return;
        });
    });

    //prende le coordinate della città di partenza per il pin del mezzo
    await new Promise<void>((resolve) => {
      this.tracciamentoService.getCoordinate(this.cittaPartenza).subscribe((response1: any) => {
        if(response1 != null)
          this.coordinatePartenza = [response1[0].lat, response1[0].lon];

        this.cordP = [response1[0].lat, response1[0].lon];

        resolve();
      },
        (error: any)=>{
          this.errorAlert('Si è verificato un errore interno, si prega di riprovare!');
          return;
        });
    });

    //prende le coordinate della città di destinazione
    await new Promise<void>((resolve) => {
      this.tracciamentoService.getCoordinate(this.cittaDestinazione).subscribe((response2: any) => {
        if(response2 != null)
          this.coordinateDestinazione = [response2[0].lat, response2[0].lon];

        resolve();
      },
        (error: any)=>{
          this.errorAlert('Si è verificato un errore interno, si prega di riprovare!');
          return;
        });
    });

    this.calcTime();  //calcola il tempo di percorrenza in base al mezzo
  } //funzione chiamata alla pressione del button
  public async calcTime() {
    let durataBus: number = 0;
    let data: any = '';
    let tempo: any;

    //mi prendo la distanza tra le due città
    const distanza = await new Promise<number>((resolve) => {
      this.tracciamentoService.getDistanza(this.coordinatePartenza[0], this.coordinatePartenza[1], this.coordinateDestinazione[0], this.coordinateDestinazione[1]).subscribe(
        (response: any) => {
          if (response != null) {
            durataBus = response.routes[0].duration;
            resolve(response.routes[0].distance);
          }
        }
      );
    });

    //calcolo il tempo di percorrenza in base al mezzo scelto
    if (this.tipo_mezzo === 'AEREO') {
      let tempoAtterraggioDecollo = 30;
      let velocita = 800;
      //calcolo il tempo che ci metto a percorrere la tratta ipotizzando che l'aereo voli a 800 km/h costanti e che ci metta 30 minuti per decollare e atterrare
      tempo = Math.floor(((tempoAtterraggioDecollo/60) + (((distanza)/1000) / velocita)) * 60);
      //ora aggiungo il tempo che ci metto alla data di partenza per ottenere la data di arrivo
      data = new Date(this.data_ora);
      data.setMinutes(data.getMinutes() + tempo);
      this.dataArrivo = this.datePipe.transform(data, 'HH:mm');
    } else if (this.tipo_mezzo === 'TRENO') {
        let velocita = 120;
        //calcolo il tempo che ci metto a percorrere la tratta ipotizzando che il treno viaggi a 120 km/h costanti e che ci metta 5 minuti per ogni 100 km per fermarsi e ripartire
        tempo = ((distanza/1000) / velocita) * 60 + Math.floor(((distanza/1000)/100)*5);
        //ora aggiungo il tempo che ci metto alla data di partenza per ottenere la data di arrivo
        data = new Date(this.data_ora);
        data.setMinutes(data.getMinutes() + tempo);
        this.dataArrivo = this.datePipe.transform(data, 'HH:mm');
    } else if (this.tipo_mezzo === 'BUS') {
      //il tempo che ci mette il bus lo prendo direttamente da openstreetmap (ipotizzo sia uguale a quello della macchina)
      tempo = Math.floor(durataBus/60);
      data = new Date(this.data_ora);
      data.setMinutes(data.getMinutes() + tempo);
      this.dataArrivo = this.datePipe.transform(data, 'HH:mm');
    }

    this.distanzaTotale = Math.floor(distanza); //salvo la distanza totale
    this.durataTratta = tempo;  //salvo la durata della tratta
    this.stringaOrario = this.formatTime(this.durataTratta);  //salvo la durata della tratta in formato stringa
    this.dataArrivoEstesa = data; //salvo la data di arrivo estesa

    //verifico se la tratta è futura o passata ed eventualmente faccio partire un errore
    if(this.validateDate(data)){
      this.pinSettings();
    }
  } //calcola il tempo di percorrenza
   public formatTime(minutes: number): string {
    //controllo se il tempo è valido
    if (isNaN(minutes) || minutes < 0) {
      return 'Invalid time';
    }

    //calcolo le ore e i minuti
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = Math.floor(minutes % 60);

    if (hours > 0 && remainingMinutes > 0) {
      //se ci sono ore e minuti
      return (hours + ' h ' + remainingMinutes + ' m');
    } else if (hours > 0) {
      //se ci sono solo ore
      return (hours + ' h');
    } else {
      //se ci sono solo minuti
      return (remainingMinutes + ' m');
    }
  } //formatta il tempo di percorrenza
  public validateDate(data: Date): boolean {
    //controllo se la tratta è futura o passata
    let dataPartenza = new Date(this.data_ora);
    let dataOdierna = new Date();

    //controllo se la tratta è futura, questo controllando se la data di partenza è maggiore della data odierna
    if(dataPartenza > dataOdierna){
      this.errorAlert('Il mezzo relativo alla tratta inserito non è ancora partito, si prega di riprovare!');
      return false;
    }

    //controllo se la data è passata, questo controllando se la data di arrivo è minore della data odierna
    let dataArrivo = new Date(data);
    if(dataArrivo < dataOdierna){
      this.errorAlert('La tratta inserita è terminata, si prega di riprovare!');
      return false;
    }

    return true;
  } //controlla se la tratta è futura o passata
  public closeTratta(): void {
    //codice che viene eseguito quando si preme il tasto per chiudere le informazioni sulla tratta
    this.stopTween();
    this.removeAllMarkers();
    (<HTMLInputElement>document.getElementById('inputTratte')).value = '';
    (<HTMLCanvasElement>document.getElementById('contTratta')).style.display = 'none';
    (<HTMLButtonElement>document.getElementById('btnRicerca')).disabled = false;
  } //chiude la tratta

  /* GESTIONE ERRORI */
  public errorAlert(description: string){
    this.spinner.hide();  //ferma l'animazione di caricamento

    //alert per gli errori con testo personalizzato
    Swal.fire({
      title: 'Attenzione!',
      text: description,
      confirmButtonText: 'Ok',
      icon: 'error',
      background: '#4d4d4d',
      color: 'white',
      confirmButtonColor: 'var(--primary-color)',
    });

    (<HTMLInputElement>document.getElementById('inputTratte')).value = '';
    (<HTMLCanvasElement>document.getElementById('contTratta')).style.display = 'none';
    (<HTMLButtonElement>document.getElementById('btnRicerca')).disabled = false;
  } //alert per gli errori

  /* STIMA POSIZIONE MEZZI */
  public async positionEstimatePlane(): Promise<void> {
    //stimo la posizione dell'aereo in base all'ora attuale
    let posizione = this.calcPosition();

    //setto le nuove coordinate
    this.coordinatePartenza[0] = posizione[0];
    this.coordinatePartenza[1] = posizione[1];

    this.map.setView([this.coordinatePartenza[0], this.coordinatePartenza[1]], 8);  //centro la mappa sulla città più vicina
    this.spinner.hide();  //ferma l'animazione di caricamento
    await this.addMarker(); //aggiungo il marker alla mappa
    (<HTMLCanvasElement>document.getElementById('contTratta')).style.display = 'block';
    (<HTMLButtonElement>document.getElementById('btnRicerca')).disabled = false;
  } //stima la posizione dell'aereo appena si carica la tratta
  public async positionEstimateBus(): Promise<void> {
    //prendo le tappe della tratta del bus
    let tappe = await this.getTappe();

    //prendo le coordinate di tutte le città
    let coordinate = await this.getCoordinate(tappe);

    //stimo la posizione attuale
    let posizione = this.calcPosition();

    //ora verifico quale coordinata è più vicina a quella calcolata
    let closestCoordinate = this.findClosestCoordinate(posizione, coordinate);
    this.coordinatePartenza[0] = closestCoordinate[0];
    this.coordinatePartenza[1] = closestCoordinate[1];

    let times = this.findTimes(coordinate, 120);  //calcolo i tempi di percorrenza tra le varie tappe

    this.createPopup(tappe, coordinate, closestCoordinate, times); //creo il popup
    this.map.setView([closestCoordinate[0], closestCoordinate[1]], 8);  //centro la mappa sulla città più vicina
    this.spinner.hide();  //ferma l'animazione di caricamento
    await this.addMarker(); //aggiungo il marker alla mappa
    (<HTMLCanvasElement>document.getElementById('contTratta')).style.display = 'block';
    (<HTMLButtonElement>document.getElementById('btnRicerca')).disabled = false;
  }  //stima la posizione del bus appena si carica la tratta
  public async positionEstimateTrain(): Promise<void> {
    //prendo le tappe della tratta del treno
    let tappe = await this.getTappe();

    //prendo le coordinate di tutte le città
    let coordinate = await this.getCoordinate(tappe);

    //stimo la posizione attuale
    let posizione = this.calcPosition();

    //ora verifico quale coordinata è più vicina a quella calcolata
    let closestCoordinate = this.findClosestCoordinate(posizione, coordinate);
    this.coordinatePartenza[0] = closestCoordinate[0];
    this.coordinatePartenza[1] = closestCoordinate[1];

    let times = this.findTimes(coordinate, 120);  //calcolo i tempi di percorrenza tra le varie tappe

    this.createPopup(tappe, coordinate, closestCoordinate, times); //creo il popup
    this.spinner.hide();  //ferma l'animazione di caricamento
    await this.addMarker(); //aggiungo il marker alla mappa
    this.map.setView([closestCoordinate[0], closestCoordinate[1]], 8);  //centro la mappa sulla città più vicina
    (<HTMLCanvasElement>document.getElementById('contTratta')).style.display = 'block';
    (<HTMLButtonElement>document.getElementById('btnRicerca')).disabled = false;
  }   //stima la posizione del treno appena si carica la tratta
  public async getTappe(): Promise<any[]> {
    let tappe: any[] = [];  //array che conterrà le tappe

    tappe.push(this.cittaPartenza); //aggiungo la città di partenza all'array

    //prendo le tappe di una tratta dal db e creo un array con le tappe
    await new Promise<void>((resolve) => {
      this.tracciamentoService.getTappe(this.idTratta).subscribe((response: any) => {
        if (response != null) {
          for (let i = 1; i <= 10; i++) {
            let key = "citta" + i;
            let value = response[key];

            // Verifica se il valore non è nullo prima di aggiungerlo all'array tappe
            if (value !== null && value != "") {
              tappe.push(value);
            }
          }
        }
        resolve();
      },
        (error: any)=>{
          this.errorAlert('Si è verificato un errore interno, si prega di riprovare!');
          this.closeTratta();
          return;
        }
      );
    });

    tappe.push(this.cittaDestinazione);

    return tappe;
  } //prende le tappe di una tratta dal db
  public async getCoordinate(tappe: any): Promise<any[]> {
    //array che conterrà le coordinate
    let coordinate: any[] = [];

    //per ogni tappa della tratta ne prendo le coordinate con l'api di openstreetmap
    for(let i = 0; i < tappe.length; i++){
      await new Promise<void>((resolve) => {
        this.tracciamentoService.getCoordinate(tappe[i]).subscribe((response: any) => {
          coordinate.push([response[0].lat, response[0].lon]);
          resolve();
        },
          (error: any)=>{
            this.errorAlert('Si è verificato un errore interno, si prega di riprovare!');
            this.closeTratta();
            return;
          });
      });
    }

    return coordinate;
  } //prende le coordinate delle tappe
  public calcPosition(){
    //prendo l'ora attuale e di arrivo
    let oraAttuale: Date = new Date();
    let oraArrivo: Date = this.dataArrivoEstesa;

    //calcolo la differenza tra le due ore e la converto in minuti
    let tempoRimasto: number = oraArrivo.getTime() - oraAttuale.getTime();
    this.moveInterval = tempoRimasto;   //setto il tempo che ci mette l'aereo a percorrere la tratta
    tempoRimasto = Math.floor(tempoRimasto/60000);  //converto il tempo in minuti
    let tempoTrascorso = this.durataTratta - tempoRimasto;  //calcolo il tempo trascorso

    //calcolo la distanza percorsa
    let distanzaPercorsa = Math.floor((tempoTrascorso * this.distanzaTotale) / this.durataTratta) / 1000;

    //calcolo le nuove coordinate
    let dx = Number(this.coordinateDestinazione[0]) - Number(this.coordinatePartenza[0]);
    let dy = Number(this.coordinateDestinazione[1]) - Number(this.coordinatePartenza[1]);
    let dxt = dx / (this.durataTratta/1000);
    let dyt = dy / (this.durataTratta/1000);
    let nuovaLat = Number(this.coordinatePartenza[0]) + (dxt * (tempoTrascorso/1000));
    let nuovaLon = Number(this.coordinatePartenza[1]) + (dyt * (tempoTrascorso/1000));

    return [nuovaLat, nuovaLon];  //ritorno le nuove coordinate
  } //calcola la posizione del mezzo in base all'ora attuale appena si carica la tratta

  /* FUNZIONI DI UTILITA' */
  private findClosestCoordinate(currentCoordinate: number[], coordinatesArray: number[][]): number[] {
    let closestCoordinate: number[] = coordinatesArray[0];  //inizializzo la coordinata più vicina
    let minDistance = this.calculateDistance(currentCoordinate, coordinatesArray[0]); //inizializzo la distanza minima con la distanza tra la coordinata attuale e la prima coordinata

    //ciclo per trovare la coordinata più vicina
    for (let i = 1; i < coordinatesArray.length; i++) {
      const distance = this.calculateDistance(currentCoordinate, coordinatesArray[i]);

      if (distance < minDistance) {
        minDistance = distance;
        closestCoordinate = coordinatesArray[i];
      }
    }

    return closestCoordinate;
  } //trova la coordinata più vicina
  private calculateDistance(coord1: number[], coord2: number[]): number {
    // Calcola la differenza tra le coordinate
    const deltaX = coord1[0] - coord2[0];
    const deltaY = coord1[1] - coord2[1];

    // Calcola la distanza euclidea
    return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  } //calcola la distanza tra due coordinate
  private createPopup(tappe: any, coordinate: any, cittaAttuale: any, times: any): void {
    let citta: any = '';
    let orario: any = '';
    let content: any = '';
    let contOrario = new Date('2021-01-01T' + this.dataPartenza + ':00');
    let currentTime = this.datePipe.transform(new Date(), 'HH:mm');

    citta = '<div style="min-width: 80px;">'
    for(let i = 0; i < tappe.length; i++) {
      if (i == 0){
        if(cittaAttuale[0] === coordinate[i][0] && cittaAttuale[1] === coordinate[i][1])
          citta += '<b style="color: var(--primary-color);"><i class="fa-solid fa-map-pin"></i> ' + this.cittaPartenza + '</b><br>';
        else
          citta += '<i class="fa-solid fa-map-pin"></i> ' + this.cittaPartenza + '<br>';
      }else if (i == tappe.length-1) {
        if(cittaAttuale[0] === coordinate[i][0] && cittaAttuale[1] === coordinate[i][1])
          citta += '<b style="color: var(--primary-color);"><i class="fa-solid fa-map-pin"></i> ' + this.cittaDestinazione + '</b><br>';
        else
          citta += '<i class="fa-solid fa-map-pin"></i> ' + this.cittaDestinazione + '<br>';
      } else{
        if(cittaAttuale[0] === coordinate[i][0] && cittaAttuale[1] === coordinate[i][1])
          citta += '<b style="color: var(--primary-color);"><i class="fa-solid fa-map-pin"></i> ' + tappe[i] + '</b><br>';
        else
          citta += '<i class="fa-solid fa-map-pin"></i> ' + tappe[i] + '<br>';
      }
    }
    citta += '</div>';

    orario = '<div style="min-width: 80px;">'
    for(let i = 0; i < times.length+1; i++) {
      if (i == 0){
        if(cittaAttuale[0] === coordinate[i][0] && cittaAttuale[1] === coordinate[i][1]) {
          orario += '<b style="color: var(--primary-color);"><i class="fa-solid fa-clock"></i> ' + currentTime + '</b><br>';
          contOrario = new Date();
        } else
          orario += '<i class="fa-solid fa-clock"></i> ' + this.dataPartenza + '<br>';
      }else if (i == times.length) {
        if(cittaAttuale[0] === coordinate[i][0] && cittaAttuale[1] === coordinate[i][1]) {
          orario += '<b style="color: var(--primary-color);"><i class="fa-solid fa-clock"></i> ' + currentTime + '</b><br>';
          contOrario = new Date();
        } else
          orario += '<i class="fa-solid fa-clock"></i> ' + this.dataArrivo + '<br>';
      } else{
        contOrario.setMinutes(contOrario.getMinutes() + times[i-1]);
        if(cittaAttuale[0] === coordinate[i][0] && cittaAttuale[1] === coordinate[i][1])
          orario += '<b style="color: var(--primary-color);"><i class="fa-solid fa-clock"></i> ' + contOrario.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + '</b><br>';
        else
          orario += '<i class="fa-solid fa-clock"></i> ' + contOrario.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + '<br>';

      }
    }
    orario += '</div>';

    content = '<div style="display: flex;">' + citta + orario + '</div>';
    this.customPopUp = L.popup().setContent(content);
  } //crea il popup
  private findTimes(coordinate: any, velocita: number){
    //array che conterrà i tempi di percorrenza
    let times: any[] = [];
    //calcolo i tempi di percorrenza tra le varie tappe
    for(let i = 0; i < coordinate.length-1; i++){
      const travelTime = Math.floor((this.twoCityDistance(coordinate[i], coordinate[i+1]) / velocita) * 60) + 5;
      times.push(travelTime);
    }
    return times;
  } //calcola e stima i tempi di percorrenza tra le varie tappe
  private twoCityDistance(coord1: any, coord2: any): number {
    const earthRadius = 6371; // Raggio medio della Terra in km

    //calcolo le coordinate in radianti
    const lat1 = this.toRadians(coord1[0]);
    const lon1 = this.toRadians(coord1[1]);
    const lat2 = this.toRadians(coord2[0]);
    const lon2 = this.toRadians(coord2[1]);

    //calcolo la differenza tra le coordinate
    const dlat = lat2 - lat1;
    const dlon = lon2 - lon1;

    //calcolo la distanza
    const a = Math.sin(dlat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return (earthRadius * c); //ritorno la distanza
  } //calcola la distanza tra due tappe

  private async getWeather(){
    //richiedo le informazioni relative al meteo della città di partenza a openweather
    await new Promise<void>((resolve) => {
      this.tracciamentoService.getMeteo(this.cordP[0], this.cordP[1]).subscribe((response: any) => {
          //se la risposta non è nulla allora prendo i dati
          if(response != null){
             this.umiditaPartenza = response.main.humidity; //prendo l'umidità
             this.temperaturePartenza = response.main.temp; //prendo la temperatura
              //in base al meteo attuale, assegno un'icona diversa
             if(response.weather[0].main == 'Clear')
                this.weatherPartenza = '<i class="fa-solid fa-sun"></i> Sereno';
              else if(response.weather[0].main == 'Clouds')
                this.weatherPartenza = '<i class="fa-solid fa-cloud"></i> Nuvoloso';
              else if(response.weather[0].main == 'Rain' || response.weather[0].description == 'Drizzle')
                this.weatherPartenza = '<i class="fa-solid fa-cloud-rain"></i> Piovoso';
              else if(response.weather[0].main == 'Thunderstorm')
                this.weatherPartenza = '<i class="fa-solid fa-cloud-bolt"></i> Temporale';
              else if(response.weather[0].main == 'Snow')
                this.weatherPartenza = '<i class="fa-solid fa-snowflake"></i>Neve';
              else if(response.weather[0].main == 'Mist' || response.weather[0].main == 'Smoke' || response.weather[0].main == 'Haze' || response.weather[0].main == 'Dust' || response.weather[0].main == 'Fog' || response.weather[0].main == 'Sand' || response.weather[0].main == 'Ash')
                this.weatherPartenza = '<i class="fa-solid fa-smog"></i> Nebbia';
              else if(response.weather[0].main == 'Tornado')
                this.weatherPartenza = '<i class="fa-solid fa-tornado"></i> Tornado';
              else if(response.weather[0].main == 'Squall')
                this.weatherPartenza = '<i class="fa-solid fa-wind"></i> Vento';
          }

          resolve();
        },
        (error: any)=>{
          this.errorAlert('Si è verificato un errore interno, si prega di riprovare!');
          return;
        });
    });

    //richiedo le informazioni relative al meteo della città di destinazione a openweather
    await new Promise<void>((resolve) => {
      this.tracciamentoService.getMeteo(this.coordinateDestinazione[0], this.coordinateDestinazione[1]).subscribe((response: any) => {
        //se la risposta non è nulla allora prendo i dati
        if(response != null){
            this.umiditaDestinazione = response.main.humidity;  //prendo l'umidità
            this.temperatureDestinazione = response.main.temp;  //prendo la temperatura
            //in base al meteo attuale, assegno un'icona diversa
            if(response.weather[0].main == 'Clear')
              this.weatherDestinazione = '<i class="fa-solid fa-sun"></i> Sereno';
            else if(response.weather[0].main == 'Clouds')
              this.weatherDestinazione = '<i class="fa-solid fa-cloud"></i> Nuvoloso';
            else if(response.weather[0].main == 'Rain' || response.weather[0].description == 'Drizzle')
              this.weatherDestinazione = '<i class="fa-solid fa-cloud-rain"></i> Piovoso';
            else if(response.weather[0].main == 'Thunderstorm')
              this.weatherDestinazione = '<i class="fa-solid fa-cloud-bolt"></i> Temporale';
            else if(response.weather[0].main == 'Snow')
              this.weatherDestinazione = '<i class="fa-solid fa-snowflake"></i> Neve';
            else if(response.weather[0].main == 'Mist' || response.weather[0].main == 'Smoke' || response.weather[0].main == 'Haze' || response.weather[0].main == 'Dust' || response.weather[0].main == 'Fog' || response.weather[0].main == 'Sand' || response.weather[0].main == 'Ash')
              this.weatherDestinazione = '<i class="fa-solid fa-smog"></i> Nebbia';
            else if(response.weather[0].main == 'Tornado')
              this.weatherDestinazione = '<i class="fa-solid fa-tornado"></i> Tornado';
            else if(response.weather[0].main == 'Squall')
              this.weatherDestinazione = '<i class="fa-solid fa-wind"></i> Vento';
          }

          resolve();
        },
        (error: any)=>{
          this.errorAlert('Si è verificato un errore interno, si prega di riprovare!');
          return;
        });
    });
  }

}
