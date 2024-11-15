import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CaricaServiziService {
  private backendUrl = "http://localhost:8080";
  constructor(private http:HttpClient) {}

  putTratta(dati: any): Observable<any>{
    return this.http.get<any>(`${this.backendUrl}/AggiungiTratta`, {params: dati , responseType: 'json'});
  }
}
