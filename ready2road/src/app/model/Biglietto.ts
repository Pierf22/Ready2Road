import bigDecimal from "js-big-decimal";
import {Utente} from "./Utente";
import {Tratta} from "./Tratta";

export class Biglietto{
  private tratta:Tratta;
  private numero:string;
  private posto:number;
  private data_ora_acquisto: Date;
  private scadenza: Date;
  private nome:string;
  private cognome:string;
  private cf:string;

  constructor(json:any) {
    this.numero=json.numero;
    this.posto=json.posto;
    this.data_ora_acquisto=json.data_ora_acquisto;
    this.scadenza=json.scadenza;
    this.nome=json.nome;
    this.cognome=json.cognome;
    this.cf=json.cf;
    this.tratta=json.tratta;

  }
  getNumero= (): string =>{
    return this.numero;

  }

  getPosto= (): number =>{
    return this.posto;

  }

  getData_ora_acquisto= (): Date =>{
    return this.data_ora_acquisto;
  }
  getScadenza= (): Date =>{
    return this.scadenza;
  }
  getNome= (): string =>{
    return this.nome;
  }
  getCognome= (): string =>{
    return this.cognome;
  }
  getCf= (): string =>{
    return this.cf;
  }

  setNumero= (numero: string): void =>{
    this.numero=numero;
  }

  setPosto= (posto: number): void =>{
    this.posto=posto;
  }

  setData_ora_acquisto= (data_ora_acquisto: Date): void =>{
    this.data_ora_acquisto=data_ora_acquisto;
  }
  setScadenza= (scadenza: Date): void =>{
    this.scadenza=scadenza;
  }
  setNome= (nome: string): void =>{
    this.nome=nome;
  }
  setCognome= (cognome: string): void =>{
    this.cognome=cognome;
  }
  setCf= (cf: string): void =>{
    this.cf=cf;
  }
  setTratta= (tratta: Tratta): void =>{
    this.tratta=tratta;
  }

}
