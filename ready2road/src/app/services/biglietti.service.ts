import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Utente} from "../model/Utente";

export interface BigliettoData {
  id: number;
  idTratta: number;
  scadenza: string;
  dataAcquisto: string;
  partenza: string;
  destinazione: string;
  venditore: string;
  posto: string;

  tipoMezzo: string;
  nome: string;
  cognome: string;
  codiceFiscale: string;
  collapse: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class BigliettiService {
  private backendUrl = "http://localhost:8080";
  constructor(private http:HttpClient) {}

  getBiglietti(dati: any): Observable<any>{
    //return this.http.get<any>(`${this.backendUrl}/biglietti`, {responseType: 'json'});
    return this.http.get<any>(`${this.backendUrl}/biglietti`, {params: dati , responseType: 'json'});
  }

  getBigliettoData(dati: any): Observable<BigliettoData>{
    return this.http.get<BigliettoData>(`${this.backendUrl}/biglietti`, {params: dati, responseType: 'json'});
  }
}
