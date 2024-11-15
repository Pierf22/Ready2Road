import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})

export class TracciamentoService {

  constructor(private httpClient: HttpClient) {}

  //restituisce informazioni sulla tratta
  public getTratta(idTratta: string): any{
    let link: string = 'http://localhost:8080/tracciamento/' + idTratta;

    return this.httpClient.get<any>(link, { responseType: 'json' });
  }

  public getCoordinate(citta: string): any {
    let link: string = 'https://nominatim.openstreetmap.org/search';
    const params = { q: citta, format: 'json', limit: '1' };

    return this.httpClient.get<any>(link, { params, responseType: 'json' });
  }

  public getDistanza(latPartenza: number, lonPartenza: number, latDestinazione: number, lonDestinazione: number): any {
    let link: string = 'https://router.project-osrm.org/route/v1/driving/' + lonPartenza + ',' + latPartenza + ';' + lonDestinazione + ',' + latDestinazione;
    const param = { overview: false };

    return this.httpClient.get<any>(link, { params: param, responseType: 'json' });
  }

  public getTappe(idTratta: string): any{
    let link: string = 'http://localhost:8080/tappe/' + idTratta;

    return this.httpClient.get<any>(link, { responseType: 'json' });
  }

  public getMeteo(lat: any, lon: any): any{
    let link: string = 'https://api.openweathermap.org/data/2.5/weather';
    const params = { lat: lat, lon: lon, appid: 'bbd8c80c72efe9afd9de6a9bb6280ad1', units: 'metric' };

    return this.httpClient.get<any>(link, { params, responseType: 'json' });
  }

}
