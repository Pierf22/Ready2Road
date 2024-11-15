import {Conversazione} from "./Conversazione";
import {ConversazioneService} from "../services/conversazione.service";
import {Inject} from "@angular/core";

export class Messaggio{
  private testo:string;
  private mittente:string;
  private id:number;
  private data:Date;
  private conversazione:Conversazione;

  constructor(json:any, @Inject(ConversazioneService) private service: ConversazioneService) {
    this.testo=json.testo;
    this.mittente=json.mittente;
    this.id=json.id;
    this.data=json.data;
    this.conversazione=new Conversazione(json.conversazione, service);
  }
  getTesto= (): string =>{
    return this.testo;
  }
  getMittente= (): string =>{
    return this.mittente;
  }
  getId= (): number =>{
    return this.id;
  }
  getData= (): Date =>{
    return this.data;
  }
  getConversazione= (): Conversazione=>{
    return this.conversazione;
  }
  setTesto= (testo:string): void =>{
    this.testo=testo;
  }
  setMittente= (mittente:string): void =>{
    this.mittente=mittente;
  }
  setId= (id:number): void =>{
    this.id=id;
  }
  setData= (data:Date): void =>{
    this.data=data;
  }
  setConversazione= (conversazione:Conversazione): void =>{
    this.conversazione=conversazione;
  }

}
