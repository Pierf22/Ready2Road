import {Wallet} from "./Wallet";
import {Inject} from "@angular/core";
import {UtenteService} from "../services/utente.service";
import {VenditoreService} from "../services/venditore.service";

export class Venditore{
    protected nomeSocieta:string;
    protected indirizzoEmail:string;
    protected password:string;
    protected ban:boolean;
    protected wallet:Wallet|undefined;

    constructor(json:any,  @Inject(VenditoreService) private service: VenditoreService){
        this.nomeSocieta=json.nomeSocieta;
        this.indirizzoEmail=json.indirizzoEmail;
        this.password=json.password;
        this.ban=json.ban;

    }
    getNomeSocieta= (): string =>{
        return this.nomeSocieta;

    }
    getIndirizzoEmail= (): string =>{
        return this.indirizzoEmail;

    }
    getPassword= (): string =>{
        return this.password;

    }

    setNomeSocieta= (nomeSocieta:string): void =>{
        this.nomeSocieta=nomeSocieta;


    }
    setIndirizzoEmail= (indirizzoEmail:string): void =>{
        this.indirizzoEmail=indirizzoEmail;


    }
    setPassword= (password:string): void =>{
        this.password=password;


    }
    getBan= (): boolean =>{
        return this.ban;
    }
    setBan= (ban:boolean): void =>{
        this.ban=ban;
    }

}
