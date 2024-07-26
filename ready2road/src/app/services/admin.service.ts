import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Admin} from "../model/Admin";

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private backendUrl = "http://localhost:8080";

  constructor(private http:HttpClient) { }

  getAdmins():Observable<Admin[]> {
    return this.http.get<Admin[]>(this.backendUrl + "/admins",
      {  responseType:  'json'})

  }
}
