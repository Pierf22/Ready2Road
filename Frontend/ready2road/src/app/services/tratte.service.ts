import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {mezzi, Tratta} from "../model/Tratta";
import {Venditore} from "../model/Venditore";

@Injectable({
  providedIn: 'root'
})
export class TratteService {
  private backendUrl = "http://localhost:8080";


  constructor(private http:HttpClient) { }

    getPartenzeDestinazioni():Observable<Map<string, string[]>> {
      return this.http.get<Map<string, string[]>>(this.backendUrl + "/partenzeDestinazioni",
          {  responseType:  'json'})


    }

  getTratte(partenza: string, destinazione: string):Observable<Tratta[]> {
    return this.http.get<Tratta[]>(this.backendUrl + "/tratte?partenza=" + partenza + "&destinazione=" + destinazione,
        {  responseType:  'json'})

  }

  getVenditore(id: string):Observable<Venditore> {
    return this.http.get<Venditore>(this.backendUrl + "/tratte/" + id +"/venditore",
      {  responseType:  'json'})


  }

  getTratteDiUnVenditore(nomeSocieta: string, arrivo: string, partenza: string):Observable<Tratta[]> {
    return this.http.get<Tratta[]>(this.backendUrl + "/tratte?partenza=" + partenza + "&destinazione=" + arrivo + "&nomeSocieta=" + nomeSocieta,
      {  responseType:  'json'})

  }

  modificaTratta(id:string, tratta: Tratta):Observable<HttpResponse<any>> {

    return this.http.post(this.backendUrl + "/ModificaTratta",{id, tratta}  , {observe: 'response'});


  }

  eliminaTratta(id: string) {
    return this.http.post(this.backendUrl + "/EliminaTratta",{id}  , {observe: 'response'});


  }

  aggiungiTratta(partenza: string, destinazione: string, capienza: string, posti_disponibili: string, data_ora: string, varMezzo: string, nomeVenditore: string, prezzo:string, sconto:string,biglietti_scontati:string, tappeIntermedie: string[]) {
     let tipo_mezzo=Tratta.converti(varMezzo);
    return this.http.post(this.backendUrl + "/AggiungiTratta",{tipo_mezzo, partenza, destinazione, data_ora, capienza, posti_disponibili, nomeVenditore, tappeIntermedie, prezzo, sconto, biglietti_scontati}  , {observe: 'response'});
  }

  getTratteDiVenditoreAttive(venditore: String):Observable<Tratta[]> {
    return this.http.get<Tratta[]>(this.backendUrl + "/tratteAttive?nomeVenditore=" + venditore,
      {  responseType:  'json'})

  }
}
