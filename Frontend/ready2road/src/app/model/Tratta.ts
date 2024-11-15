import {Venditore} from "./Venditore";
import {TratteService} from "../services/tratte.service";
import {Inject, inject, Injectable} from "@angular/core";
import {async} from "rxjs";
import {VenditoreService} from "../services/venditore.service";
import bigDecimal from "js-big-decimal";

export enum mezzi{
AEREO='AEREO',
    BUS='BUS',
    TRENO='TRENO'}

export class Tratta{
    private id: string;
    private partenza: string;
    private destinazione: string;
    private tipo_mezzo: mezzi;
    private capienza: number;
    private data_ora:Date;
  private biglietti_scontati:number;
    private posti_disponibili:number;
  private sconto:number;
  private  prezzo:number;
  private nome_venditore:Venditore|undefined;
    constructor(json:any, @Inject(TratteService) private service: TratteService, @Inject(VenditoreService) private venditoreService: VenditoreService) {
        this.id=json.id;
        this.partenza=json.partenza;
        this.destinazione=json.destinazione;
        this.tipo_mezzo=json.tipo_mezzo;
        this.capienza=json.capienza;
        this.data_ora=json.data_ora;
        this.posti_disponibili=json.posti_disponibili;
        this.prezzo=json.prezzo;
        this.sconto=json.sconto;
        this.biglietti_scontati=json.biglietti_scontati;
    }
    getId= (): string =>{
        return this.id;
    }
    getSconto= (): number =>{
        return this.sconto;
    }
    getBiglietti_scontati= (): number =>{
        return this.biglietti_scontati;
    }
    setBiglietti_scontati= (biglietti_scontati: number): void =>{
        this.biglietti_scontati=biglietti_scontati;
    }
    setSconto= (sconto: number): void =>{
        this.sconto=sconto;
    }
    getPrezzo= (): number =>{
        return this.prezzo;
    }
    setPrezzo= (prezzo: number): void =>{
        this.prezzo=prezzo;
    }
    getPartenza= (): string =>{
        return this.partenza;
    }
    getDestinazione= (): string =>{
        return this.destinazione;
    }
    getTipo_mezzo= (): mezzi =>{
        return this.tipo_mezzo;
    }
    getCapienza= (): number =>{
        return this.capienza;
    }
    getData_ora= (): Date =>{
        return this.data_ora;
    }
    getPosti_disponibili= (): number =>{
        return this.posti_disponibili;
    }
    getNome_venditore= ():  Venditore| undefined =>{
        if(this.nome_venditore === undefined){
          this.service.getVenditore(this.id).subscribe((data)=>{
            this.nome_venditore=new Venditore(data, this.venditoreService);

          });
        }

        return this.nome_venditore;
    }
    setId= (id: string): void =>{
        this.id=id;
    }
    setPartenza= (partenza: string): void =>{
        this.partenza=partenza;
    }
    setDestinazione= (destinazione: string): void =>{
        this.destinazione=destinazione;
    }
    setTipo_mezzo= (tipo_mezzo: mezzi): void =>{
        this.tipo_mezzo=tipo_mezzo;
    }

    setCapienza= (capienza: number): void =>{
        this.capienza=capienza;
    }
    setData_ora= (data_ora: Date): void =>{
        this.data_ora=data_ora;
    }
    setPosti_disponibili= (posti_disponibili: number): void =>{
        this.posti_disponibili=posti_disponibili;
    }
    setNome_venditore= (nome_venditore: Venditore): void =>{
        this.nome_venditore=nome_venditore;
    }

  toJson():any {
    return {
      id: this.id,
      partenza: this.partenza,
      destinazione: this.destinazione,
      tipoMezzo: this.tipo_mezzo,
      capienza: this.capienza,
      dataOra: this.data_ora,
      postiDisponibili: this.posti_disponibili,
    };
  }

  static converti(value1: string) {

      switch (value1.toUpperCase()) {
        case 'AEREO':
          return mezzi.AEREO;
        case 'BUS':
          return mezzi.BUS;
        case 'TRENO':
          return mezzi.TRENO;
        default:
          return undefined;
      }

  }

  copy() {
  return new Tratta(this.toJson(), this.service, this.venditoreService);
}}
