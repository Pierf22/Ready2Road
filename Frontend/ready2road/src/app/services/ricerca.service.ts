import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class RicercaService {
  private backendUrl = "http://localhost:8080";
  constructor(private http:HttpClient) {}

  //mi serve per la ricerca utente
  getRicerca(dati: any): Observable<any>{
    return this.http.get<any>(`${this.backendUrl}/ricerca`, {params: dati , responseType: 'json'});
  }
  //mi serve per la ricerca delle sole partenze
  getPartenze(dati: any): Observable<any>{
    return this.http.get<any>(`${this.backendUrl}/partenze`, { params: dati, responseType: 'json'});
  }
  //mi serve per la ricerca delle sole destinazioni
  getDestinazioni(dati: any): Observable<any>{
    return this.http.get<any>(`${this.backendUrl}/destinazioni`, { params: dati, responseType: 'json'});
  }
  //viene usato per cercare le offerte ad hoc per l'utente
  getOfferte(dati: any): Observable<any>{
    return this.http.get<any>(`${this.backendUrl}/trovaOfferte`, { params: dati, responseType: 'json'});
  }
  getTratta(dati: any): Observable<any>{
    return this.http.get<any>(`${this.backendUrl}/trattaDaID`, { params: dati, responseType: 'json'});
  }
}
