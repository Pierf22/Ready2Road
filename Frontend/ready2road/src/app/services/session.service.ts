import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Utente} from "../model/Utente";
import {Venditore} from "../model/Venditore";
import {Admin} from "../model/Admin";
import {UtenteService} from "./utente.service";
import {VenditoreService} from "./venditore.service";
import {Router} from "@angular/router";
import {NgxSpinnerService} from "ngx-spinner";

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private sessionID: any;
  private loggedUser: Utente | Venditore | Admin | undefined;

  constructor(private router:Router, private cookieService: CookieService, private httpClient: HttpClient, private userService:UtenteService, private venditoreService:VenditoreService, private spinner: NgxSpinnerService) {}

  checkSession(): void {
    // Verifica se la variabile globale è già inizializzata
    if (!this.sessionID) {
      // Se la variabile globale non è inizializzata, verifica l'ID dalla URL
      const sessionIDFromURL = this.getSessionIDFromURL();

      if (sessionIDFromURL) {
        // Se l'ID della sessione è presente nell'URL, inizializzalo
        this.setSessionID(sessionIDFromURL);
        this.saveSessionIDToCookies(sessionIDFromURL);
      } else {
        // Se l'ID della sessione non è presente nell'URL, controlla nei cookie
        const sessionIDFromCookies = this.getSessionIDFromCookies();

        if (sessionIDFromCookies) {
          // Se l'ID della sessione è presente nei cookie, inizializzalo
          this.setSessionID(sessionIDFromCookies);
        } else {
          // Se l'ID della sessione non è presente nei cookie, termina
          return;
        }
      }
    }
  } //verifica la validità della sessione
  checkUser(response:any): void {
    // Riceve i dati dal backend
      if(response != null){
        switch (response.tipo) {
          case 'utente':
            //creo l'oggetto utente
            this.loggedUser = new Utente(response, this.userService);
            break;
          case 'admin':
            //creo l'oggetto admin
            this.loggedUser = new Admin(response);
            break;
          case 'venditore':
            //creo l'oggetto venditore
            this.loggedUser = new Venditore(response, this.venditoreService);
            break;
        }
      }

  } //salva l'utente loggato

  private getSessionIDFromURL(): any {
    // Ottieni l'ID della sessione dalla tua URL o da dove lo stai memorizzando
    return window.location.search.split('=')[1];
  }

  private getSessionIDFromCookies(): any {
    // Ottieni l'ID della sessione dai cookie
    return this.cookieService.get('sessionID');
  }

  private setSessionID(id: any): void {
    // Imposta l'ID della sessione nelle variabili globali
    this.sessionID = id;
  }

  getSessionID(): any {
    // Restituisci l'ID della sessione
    return this.sessionID;
  }

  private saveSessionIDToCookies(id: any): void {
    // Salva l'ID della sessione nei cookie
    this.cookieService.set('sessionID', id);
  }

  logout(): void {
    // Rimuovi il cookie
    this.cookieService.delete('sessionID');

    // Pulisco le variabili globali
    this.sessionID = undefined;
    this.loggedUser = undefined;
  }

  setLoggedUser(user: Utente | Admin | Venditore | undefined): void {
    // Salva l'utente nelle variabili globali
    this.loggedUser = user;
  }

  getUser(): Utente | Admin | Venditore | undefined {
    // Restituisci l'utente
    return this.loggedUser;
  }

  getLoggedUser(): Observable<any> {
    // Aggiungi il tuo URL del backend appropriato
    const apiUrl = 'http://localhost:8080/getUser';

    // Costruisci la tua richiesta con il parametro jsessionid
    const params = { jsessionid: this.sessionID };

    // Effettua la richiesta GET
    return this.httpClient.get<any>(apiUrl, { params: params, responseType: 'json' });
  }

  //metodo per aspettare finchè l'utente non è disponibile
  waitForUser(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        this.getLoggedUser().subscribe(
          (data) => {
            this.checkUser(data);
          },
          (error) => {
            console.error('Errore durante il recupero dell\'utente:', error);
            reject(error); // Rigetta la promessa in caso di errore
          }, () => {
            resolve(); // Risolve la promessa quando l'utente è disponibile
          }
        );


      // Inizia a controllare l'utente
    });}
}
