import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Conversazione} from "../model/Conversazione";

@Injectable({
  providedIn: 'root'
})
export class AcquistoService {

  private backendUrl = "http://localhost:8080";

  constructor(private http:HttpClient) { }

  sendAcquisto(dati:any) {
    return this.http.get<any>(`${this.backendUrl}/generaBiglietto`, { params: dati, responseType: 'text' as 'json'});
  }

  scalaDenaro(dati:any) {
    return this.http.get<any>(`${this.backendUrl}/scalaDenaro`, { params: dati, responseType: 'text' as 'json'});
  }

  aggiungiDenaro(dati:any) {
    return this.http.get<any>(`${this.backendUrl}/aggiungiDenaro`, { params: dati, responseType: 'text' as 'json'})
  }

  eliminaBuono(dati:any) {
    return this.http.get<any>(`${this.backendUrl}/eliminaBuono`, { params: dati, responseType: 'text' as 'json'})
  }
  public getSaldo(email: string): any {
    let link: string = 'http://localhost:8080/areapersonale/getSaldo/' + email;

    return this.http.get<any>(link, { responseType: 'json' });
  }

  getSconto(codice: string) {
    return this.http.get<any>(this.backendUrl +"/getSconto?codice="+codice,{responseType: 'text' as 'json'});
  }
}
