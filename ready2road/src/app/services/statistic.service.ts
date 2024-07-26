import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class StatisticService {
  private backendUrl = "http://localhost:8080";

  constructor(private http:HttpClient) { }

    getStatisticheAdmin():Observable<number[]>{
    return this.http.get<number[]>(this.backendUrl + "/statistichePrincipaliAdmin",
      {  responseType:  'json'})

  }

   getStatistichePieChartMetodiDiPagamento():Observable<Record<string, number>> {
     return this.http.get<Record<string, number>>(this.backendUrl + "/statistichePieChartMetodiPagamento",
       {  responseType:  'json'})

  }

  getVenditePerAnno(selectedYear: number):Observable<Record<string, number[]>[]> {
    return this.http.get<Record<string, number[]>[]>(this.backendUrl + "/statisticheVenditePerAnno/"+selectedYear,
      {  responseType:  'json'})

  }


  getRendimento(dataInizio: string, dataFine:string):Observable<number> {
      return this.http.get<number >(this.backendUrl + "/rendimenti?dataInizio="+dataInizio+"&dataFine="+dataFine,
          {  responseType:  'json'})


  }

  getStatisticheVenditore(nomeSocieta:string):Observable<number[]> {
    return this.http.get<number[]>(this.backendUrl + "/statistichePrincipaliVenditore?nomeSocieta="+nomeSocieta,
      {  responseType:  'json'})

  }

  getStatistichePieChartBiglietti(nomeVenditore:string):Observable<Record<string, number>> {
    return this.http.get<Record<string, number>>(this.backendUrl + "/statistichePieChartBiglietti?nomeSocieta="+nomeVenditore,
      {  responseType:  'json'});

  }

  getVenditePerAnnoVenditore(selectedYear: number, nomeVenditore: string) {
    return this.http.get<Record<string, number[]>[]>(this.backendUrl + "/statisticheVendite?nomeSocieta="+nomeVenditore+"&anno="+selectedYear,
      {  responseType:  'json'})

  }

  getRendimentoVenditore(nomeVenditore: string, dataInizio: string, dataFine: string) {
    return this.http.get<number >(this.backendUrl + "/rendimentiVenditore?dataInizio="+dataInizio+"&dataFine="+dataFine+"&nomeSocieta="+nomeVenditore,
      {  responseType:  'json'})
  }
}
