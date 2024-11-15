import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from "@angular/common/http";
import {Conversazione} from "../model/Conversazione";
import {Observable} from "rxjs";
import {Messaggio} from "../model/Messaggio";
import Pusher, {Channel} from "pusher-js";
import {Venditore} from "../model/Venditore";
import {Admin} from "../model/Admin";

@Injectable({
  providedIn: 'root'
})
export class ConversazioneService {

  private backendUrl = "http://localhost:8080";
  private pusher = new Pusher('YOUR PUSHER APP KEY', {
    cluster: 'YOUR CLUSTER'
  });
  constructor(private http:HttpClient) { }

  getConversazioniAdmin(username:string):Observable<Conversazione[]> {
    return this.http.get<Conversazione[]>(this.backendUrl + "/conversazioni/Admin?username="+username,
      {  responseType:  'json'})

  }

  getMessaggi(conversazione: string):Observable<Messaggio[]> {
    return this.http.get<Messaggio[]>(this.backendUrl + "/messaggi?conversazione="+conversazione,
      {  responseType:  'json'})

  }

  inviaMessaggio( mittente: string, conversazione: string, testo: string | null | undefined ):Observable<HttpResponse<any>> {
    // Ottieni la data corrente
    const data = new Date();

// Aggiungi un'ora
    data.setHours(data.getHours() + 1);

    return this.http.post(this.backendUrl + "/inviaMessaggio",{mittente, data, conversazione, testo}  , {observe: 'response'});

  }
  formatData(date:Date) {
    let dataString:string=date.toString();
    const dateObj = new Date(dataString);

    return `${dateObj.getDate().toString().padStart(2, '0')}/${
      (dateObj.getMonth() + 1).toString().padStart(2, '0')}/${
      dateObj.getFullYear()} ${dateObj.getHours().toString().padStart(2, '0')}:${
      dateObj.getMinutes().toString().padStart(2, '0')}`;

  }

  getConversazioniUtente(indirizzoEmail: any) {
    return this.http.get<Conversazione[]>(this.backendUrl + "/conversazioni/Utente?indirizzoEmail="+indirizzoEmail,
      {  responseType:  'json'})

  }

  creaConversazioneTraVenditoreUtente(nomeSocieta: string, indirizzoEmail: any):Observable<Conversazione> {
    return this.http.get<Conversazione>(this.backendUrl+"/creaConversazioneUtenteVenditore?nomeSocieta="+nomeSocieta+"&indirizzoEmail="+indirizzoEmail,
      {responseType:'json'});

  }
  connessioneAdUnCanale(nomeUtente:string){
    nomeUtente=nomeUtente.replace(/\s/g, ''); //i canali non possono contenere spazi
      this.pusher.unsubscribe(nomeUtente);
       return this.pusher.subscribe(nomeUtente);

  }

  disconessioneDaUnCanale(nomeUtente: string) {
    this.pusher.unsubscribe(nomeUtente);

  }


  creaConversazioneTraAdminUtente(username: string, indirizzoEmail: string) {
    return this.http.get<Conversazione>(this.backendUrl+"/creaConversazioneUtenteAdmin?username="+username+"&indirizzoEmail="+indirizzoEmail,
      {responseType:'json'});

  }

  creaConversazione(utenteSelezionato: any, indirizzoEmail: any) {
    if(utenteSelezionato instanceof Venditore){
      return this.creaConversazioneTraVenditoreUtente(utenteSelezionato.getNomeSocieta(), indirizzoEmail);
    }
    if(utenteSelezionato instanceof Admin){
      return this.creaConversazioneTraAdminUtente(utenteSelezionato.getUsername(), indirizzoEmail);
    }
    throw new Error();

  }

  eliminaConversazione(altroPartecipante:string, nome: string) {
    return this.http.get<HttpResponse<any>>(this.backendUrl+"/eliminaConversazione?nome="+nome+"&altroPartecipante="+altroPartecipante,
      {responseType:'json'});

  }

  getNomeAltroPartecipanteConv(username: string, nome: string) {
    var parti = nome.split('-');

    if(parti[0]==username){
      return parti[1];
    }else{
      return parti[0];
    }
  }

  getConversazioniVenditore(nomeUtente: string) {
    return this.http.get<Conversazione[]>(this.backendUrl + "/conversazioni/Venditore?nomeSocieta="+nomeUtente,
      {  responseType:  'json'})

  }
}
