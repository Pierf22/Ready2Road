import {Wallet} from "./Wallet";
import {Inject} from "@angular/core";
import {TratteService} from "../services/tratte.service";
import {UtenteService} from "../services/utente.service";


export class Utente{
  private  nome: string;
  private  cognome: string;
  private  indirizzoEmail: string;
  private  numeroTelefono: string;
  private  dataNascita: Date;
  private  password: string;
  private ban: boolean;
  private  wallet: Wallet|undefined;
    getNome= (): string =>{
        return this.nome;

    }
    getCognome= (): string =>{
        return this.cognome;

    }
    getIndirizzoEmail= (): string =>{
        return this.indirizzoEmail;

    }
    getNumeroTelefono= (): string =>{
        return this.numeroTelefono;

    }
    getDataNascita= (): Date =>{
        return this.dataNascita;

    }
    getPassword= (): string =>{
        return this.password;

    }


    constructor(json:any, @Inject(UtenteService) private service: UtenteService) {
        this.nome = json.nome;
        this.cognome = json.cognome;
        this.indirizzoEmail = json.indirizzoEmail;
        this.numeroTelefono = json.numeroTelefono;
        this.dataNascita = json.dataNascita;
        this.password = json.password;
        this.ban = json.ban;
    }
    setNome= (nome: string): void =>{
        this.nome=nome;

    }

    setCognome= (cognome: string): void =>{
        this.cognome=cognome;

    }
    setIndirizzoEmail= (indirizzoEmail: string): void =>{
        this.indirizzoEmail=indirizzoEmail;

    }
    setNumeroTelefono= (numeroTelefono: string): void =>{
        this.numeroTelefono=numeroTelefono;

    }
    setDataNascita= (dataNascita: Date): void =>{
        this.dataNascita=dataNascita;

    }
    setPassword= (password: string): void =>{
        this.password=password;

    }
    setWallet= (wallet: Wallet): void =>{
        this.wallet=wallet;

    }
    getBan= (): boolean =>{
        return this.ban;

    }
    setBan= (ban: boolean): void =>{
        this.ban=ban;

    }

}
