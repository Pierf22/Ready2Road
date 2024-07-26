import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import * as http from "http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AreapersonaleService {
  constructor(private httpClient: HttpClient) {}

  public getNumeroBiglietti(email: string): any {
    let link: string = 'http://localhost:8080/areapersonale/getNumeroTicket/' + email;

    return this.httpClient.get<any>(link, { responseType: 'json' });
  }

  public getNumeroBigliettiVenditore(nome: string): any {
    let link: string = 'http://localhost:8080/areapersonale/getTratteVenditore/' + nome;

    return this.httpClient.get<any>(link, { responseType: 'json' });
  }

  public getSaldo(email: string): any {
    let link: string = 'http://localhost:8080/areapersonale/getSaldo/' + email;

    return this.httpClient.get<any>(link, { responseType: 'json' });
  }

  public getNumeroTransazioni(email: string): any {
    let link: string = 'http://localhost:8080/areapersonale/getNumeroTransazioni/' + email;

    return this.httpClient.get<any>(link, { responseType: 'json' });
  }

  public generateGiftCard(email: string): any {
    let link: string = 'http://localhost:8080/areapersonale/generateGiftCard/' + email;

    return this.httpClient.get<any>(link, { responseType: 'json' });
  }

  public logout(): any {
    let link: string = 'http://localhost:8080/areapersonale/logout';

    return this.httpClient.get<any>(link, { responseType: 'json' });
  }
}
