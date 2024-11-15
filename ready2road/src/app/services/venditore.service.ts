import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from "@angular/common/http";
import {Observable} from "rxjs";
import {Utente} from "../model/Utente";
import {Venditore} from "../model/Venditore";
import {Wallet} from "../model/Wallet";

@Injectable({
  providedIn: 'root'
})
export class VenditoreService {
  private backendUrl = "http://localhost:8080";


  constructor(private http:HttpClient) { }
  bannaVenditore(nomeSocieta:string):Observable<HttpResponse<any>> {
    return this.http.post(this.backendUrl + "/BannaVenditore",{ nomeSocieta},  {observe: 'response'} );

  }
  eliminaVenditore(nomeSocieta: string) {
    return this.http.post(this.backendUrl + "/EliminaVenditore",{ nomeSocieta},  {observe: 'response'} );


  }
  getListaVenditori() {
    return this.http.get<Venditore[]>(this.backendUrl + "/venditori",
      {  responseType:  'json'})

  }


  modificaVenditore(venditore: Venditore, nomeSocieta: string) {
    return this.http.post(this.backendUrl + "/ModificaVenditore",{ nomeSocieta, venditore},  {observe: 'response'} );

  }

  checkVenditoreDisponibile(email: string, nomeSocieta: string) {
    return this.http.get<boolean>(this.backendUrl + `/venditore?email=${encodeURIComponent(email)}?nomeSocieta=${encodeURIComponent(nomeSocieta)}`,
      {  responseType:  'json'})

  }

  getWallet(indirizzoEmail: string):Observable<Wallet> {
    return this.http.get<Wallet>(this.backendUrl+`/getWalletVenditore?email=${encodeURIComponent(indirizzoEmail)}`, {responseType:'json'})

  }
}
