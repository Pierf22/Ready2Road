import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {Utente} from "../model/Utente";
import {Wallet} from "../model/Wallet";

@Injectable({
  providedIn: 'root'
})
export class UtenteService {
  private backendUrl = "http://localhost:8080";


  constructor(private http:HttpClient ) { }
  bannaUtente(indirizzoEmail:string):Observable<HttpResponse<any>> {
    return this.http.post(this.backendUrl + "/BannaUtente",{ indirizzoEmail},  {observe: 'response'} );

  }
  eliminaUtente(indirizzoEmail: string) {
    return this.http.post(this.backendUrl + "/EliminaUtente",{ indirizzoEmail},  {observe: 'response'} );


  }
  getListaUtenti():Observable<Utente[]>{
    return this.http.get<Utente[]>(this.backendUrl + "/utenti",
      {  responseType:  'json'})

  }
  checkEmailLibera(value: string):Observable<boolean> {
    return this.http.get<boolean>(this.backendUrl + `/utente?email=${encodeURIComponent(value)}`,
      {  responseType:  'json'})
  }

  modificaUtente(utente: Utente, indirizzoEmail: string) {
    return this.http.post(this.backendUrl + "/ModificaUtente",{ indirizzoEmail, utente},  {observe: 'response'} );


  }

  getWallet(email:string):Observable<Wallet> {
    return this.http.get<Wallet>(this.backendUrl+`/getWalletUtente?email=${encodeURIComponent(email)}`, {responseType:'json'})


  }
}
