import {Utente} from "./Utente";
import {Admin} from "./Admin";
import {Venditore} from "./Venditore";
import {Inject} from "@angular/core";
import {ConversazioneService} from "../services/conversazione.service";

export class Conversazione{
  private nome: string;
  private utente:Utente;
  private admin:Admin;
  private venditore:Venditore;

  constructor(json:any,@Inject(ConversazioneService) private service: ConversazioneService) {
    this.nome=json.nome;
    this.utente=json.utente;
    this.admin=json.admin;
    this.venditore=json.venditore;
  }
  getNome= (): string =>{
    return this.nome;
  }
  getUtente= (): Utente =>{
    return this.utente;
  }
  getAdmin= (): Admin =>{
    return this.admin;
  }
  getVenditore= (): Venditore =>{
    return this.venditore;
  }
  setNome= (nome:string): void =>{
    this.nome=nome;

  }
  setUtente= (utente:Utente): void =>{
    this.utente=utente;

  }
  setAdmin= (admin:Admin): void =>{
    this.admin=admin;

  }


}
