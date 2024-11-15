import {Component, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {DomSanitizer} from "@angular/platform-browser";
import * as L from 'leaflet';
import 'leaflet-routing-machine'
import {CookieService} from "ngx-cookie-service";

@Component({
  selector: 'app-ricerca',
  templateUrl: './ricerca.component.html',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    NgClass
  ],
  styleUrls: ['./ricerca.component.css']
})
export class RicercaComponent implements OnInit {
  protected datiRicerca:any;
  protected testoTitolo: string = "Andata";
  private tipoBiglietto: string | null = null;
  private durata:string | null |any = null;
  private partenza:string | null | any = null;
  private destinazione:string | null | any = null;
  private visualizzaSoloAndata: boolean = true;

  constructor(private route: ActivatedRoute, private router: Router, private cookieService:CookieService) {}
  ngOnInit(): void {
    // Recupera i datiRicerca dalla route
    this.route.paramMap.subscribe(params => {
      this.datiRicerca = history.state.datiRicerca;
    });

    //console.log(this.datiRicerca);
    if(this.datiRicerca[0].length==0){
      alert("Non sono disponibili tratte per la tua ricerca. Si prega di modificare i criteri di ricerca e riprovare.");
      this.router.navigate(['/home']);
    }else{
      if(this.datiRicerca.length==1){
        this.tipoBiglietto = "andata";
      } else{
        if(this.datiRicerca[1].length==0) {
          alert("Non sono disponibili tratte per la tua ricerca. Si prega di modificare i criteri di ricerca e riprovare.");
          this.router.navigate(['/home']);
        }
        this.tipoBiglietto = "a/r";
      }
      this.partenza = this.datiRicerca[0][0].partenza;
      this.destinazione = this.datiRicerca[0][0].destinazione;
      this.initMap();
    }

  }

  // Funzione per ottenere le coordinate geografiche da Nominatim
  geocode(city: string): Promise<{ lat: number, lon: number }> {
    const geocodeUrl = "https://nominatim.openstreetmap.org/search?format=json&q=";
    return fetch(geocodeUrl + encodeURIComponent(city))
      .then(response => response.json())
      .then(data => {
        if (data.length > 0) {
          const { lat, lon } = data[0];
          return { lat: parseFloat(lat), lon: parseFloat(lon) };
        } else {
          throw new Error("Coordinate non trovate per la città: " + city);
        }
      });
  }

 async initMap(){
    const map = L.map('map').setView([51.505, -0.09], 10);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    try {
      const partenzaCoords = await this.geocode(this.partenza);
      const destinazioneCoords = await this.geocode(this.destinazione);

      const iconPartenza = L.icon({
        iconUrl: '../assets/MapIcon/black.png',
        iconSize: [25, 30]
      });
      const iconDestinazione = L.icon({
        iconUrl: '../assets/MapIcon/red.png',
        iconSize: [25, 30]
      });
      const partenzaMarker = L.marker([partenzaCoords.lat, partenzaCoords.lon], {icon: iconPartenza}).addTo(map);
      const destinazioneMarker = L.marker([destinazioneCoords.lat, destinazioneCoords.lon],{icon: iconDestinazione}).addTo(map);
      partenzaMarker.bindPopup("Città di partenza: " + this.partenza);
      destinazioneMarker.bindPopup("Città di destinazione: " + this.destinazione);

      if(this.datiRicerca[0][0].tipoMezzo==="BUS"){
        const routingControl = L.Routing.control({
          waypoints: [
            L.latLng(partenzaCoords.lat, partenzaCoords.lon),
            L.latLng(destinazioneCoords.lat, destinazioneCoords.lon)
          ],
          routeWhileDragging: false,
          show: false,
        }).addTo(map);
        routingControl.on('routesfound', (event) => {
          const route = event.routes[0];
          this.durata = route.summary.totalTime;
        });
        routingControl.getPlan().remove();
        routingControl.getContainer()?.remove();

      } else if(this.datiRicerca[0][0].tipoMezzo==="TRENO"){
        const partenzalng = L.latLng(partenzaCoords.lat,partenzaCoords.lon);
        const destinazionelng = L.latLng(destinazioneCoords.lat,destinazioneCoords.lon);
        this.durata = ((partenzalng.distanceTo(destinazionelng)/1000)/120)*60+Math.floor(((partenzalng.distanceTo(destinazionelng)/1000)/100)*5);

        const polyline = L.polyline([partenzaMarker.getLatLng(), destinazioneMarker.getLatLng()], {color: 'red'}).addTo(map);

      }else if(this.datiRicerca[0][0].tipoMezzo==="AEREO"){
        const partenzalng = L.latLng(partenzaCoords.lat,partenzaCoords.lon);
        const destinazionelng = L.latLng(destinazioneCoords.lat,destinazioneCoords.lon);
        this.durata = Math.floor(((30/60)+(((partenzalng.distanceTo(destinazionelng))/1000)/800))*60);
        const polyline = L.polyline([partenzaMarker.getLatLng(), destinazioneMarker.getLatLng()], {color: 'red'}).addTo(map);
      }

      const bounds = L.latLngBounds([partenzaCoords.lat, partenzaCoords.lon], [destinazioneCoords.lat, destinazioneCoords.lon]);
      map.fitBounds(bounds);
    } catch (error) {
      console.error("Errore durante il geocoding:", error);
    }
  }

  setCollapse(tratta:any){
    // modifica il campo collapse della tratta cliccata in modo da mostrare i dettagli della tratta
    tratta.collapse = !tratta.collapse;
  }

  ordinaTratte(event: any){
    if(this.datiRicerca.length==1){
      if(event.target.value === 'ora partenza') {
        this.datiRicerca[0].sort((a:any, b:any) => a.dataOra.localeCompare(b.dataOra));
      } else if (event.target.value === 'prezzo') {
        this.datiRicerca[0].sort((a:any, b:any) => a.prezzo - b.prezzo);
      } else if (event.target.value === 'posti disponibili') {
        this.datiRicerca[0].sort((a:any, b:any) => a.postiDisponibili - b.postiDisponibili);
      } else if(event.target.value === 'posti totali'){
        this.datiRicerca[0].sort((a:any, b:any) => a.capienza - b.capienza);
      }
    } else if(this.datiRicerca.length==2){
      if (event.target.value === 'ora partenza') {
        this.datiRicerca[0].sort((a:any, b:any) => a.dataOra.localeCompare(b.dataOra));
        this.datiRicerca[1].sort((a:any, b:any) => a.dataOra.localeCompare(b.dataOra));
     } else if (event.target.value === 'prezzo') {
        this.datiRicerca[0].sort((a:any, b:any) => a.prezzo - b.prezzo);
        this.datiRicerca[1].sort((a:any, b:any) => a.prezzo - b.prezzo);
      } else if (event.target.value === 'posti disponibili') {
        this.datiRicerca[0].sort((a:any, b:any) => a.postiDisponibili - b.postiDisponibili);
        this.datiRicerca[1].sort((a:any, b:any) => a.postiDisponibili - b.postiDisponibili);
      } else if(event.target.value === 'posti totali'){
        this.datiRicerca[0].sort((a:any, b:any) => a.capienza - b.capienza);
        this.datiRicerca[1].sort((a:any, b:any) => a.capienza - b.capienza);
      }
    }

  }

  getIconName(tipoMezzo: string): string {
    switch (tipoMezzo.toLowerCase()) {
      case 'aereo':
        return 'plane';
      case 'bus':
        return 'bus';
      case 'treno':
        return 'train';
      default:
        return '';
    }
  }

  getOraArrivo(oraPartenza:string) {
    if(this.datiRicerca[0][0].tipoMezzo==="BUS"){
      const ora = new Date(oraPartenza);
      const durata = new Date(this.durata*1000);

      const oreToAdd = durata.getHours();
      const minutiToAdd = durata.getMinutes();
      const secondiToAdd = durata.getSeconds();

      ora.setHours(ora.getHours() + oreToAdd);
      ora.setMinutes(ora.getMinutes() + minutiToAdd);
      ora.setSeconds(ora.getSeconds() + secondiToAdd);
      const ore = ora.getHours().toString().padStart(2, '0');
      const minuti = ora.getMinutes().toString().padStart(2, '0');

      return `${ore}:${minuti}`;
    } else {
      const ora = new Date(oraPartenza);
      ora.setMinutes(ora.getMinutes() + this.durata);
      const ore = ora.getHours().toString().padStart(2, '0');
      const minuti = ora.getMinutes().toString().padStart(2, '0');

      return `${ore}:${minuti}`;
    }
  }

  getDurata(){
    if(this.datiRicerca[0][0].tipoMezzo==="BUS"){
      const time = new Date(this.durata*1000);
      return time.toLocaleTimeString('it-IT');
    } else {
      const ore = Math.floor(this.durata/60);
      const minuti = this.durata % 60;
      return ore.toString().padStart(2,'0')+":"+minuti.toString().padStart(2,'0');
    }
  }

  getOraPartenza(dataOra:string){
    let ora = dataOra.split("T");
    let oreMinuti = ora[1].split(":");
    return oreMinuti[0]+":"+oreMinuti[1];
  }

  getData(dataOra:string){
    let data = dataOra.split("T");
    let revers = data[0].split("-");
    return revers[2]+"-"+revers[1]+"-"+revers[0];
  }

  acquista(tratta:any){
    if(this.tipoBiglietto=="andata"){
      this.cookieService.set("IdAndata",tratta.idTratta);
      this.cookieService.set("IdRitorno",'');
      this.cookieService.set("scontato","false");

      this.router.navigate(['/checkout']);

    }else if(this.tipoBiglietto=="a/r"){
      /*
          una volta selezionato il biglietto di andata salva l'id di andata
          e cambia la visualizzazione mostrando i biglietti i ritorno
      */
      this.testoTitolo = "Ritorno";
      if(this.visualizzaSoloAndata) {
        this.cookieService.set("IdAndata", tratta.idTratta);

        this.visualizzaSoloAndata = false;
        this.datiRicerca = [this.datiRicerca[1]];

      } else {
        this.cookieService.set("IdRitorno", tratta.idTratta);

        this.router.navigate(['/checkout']);
      }

    }
  }

}
