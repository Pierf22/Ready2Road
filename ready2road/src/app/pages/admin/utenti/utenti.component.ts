import {Component, inject, OnInit} from '@angular/core';
import {Utente} from "../../../model/Utente";
import {Venditore} from "../../../model/Venditore";
import { NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ModifyAUserByAdminComponent} from "./modify-a-user-by-admin/modify-a-user-by-admin.component";
import {ToastrService} from "ngx-toastr";
import {
  ModificaUnVenditoreDaAdminComponent
} from "./modifica-un-venditore-da-admin/modifica-un-venditore-da-admin.component";
import {UtenteService} from "../../../services/utente.service";
import {VenditoreService} from "../../../services/venditore.service";
import {SessionService} from "../../../services/session.service";
import {Admin} from "../../../model/Admin";
import {Router} from "@angular/router";
@Component({
  selector: 'app-utenti',
  templateUrl: './utenti.component.html',
  styleUrls:[ './utenti.component.css', '../../../../assets/toastStyle.css']
})
export class UtentiComponent implements OnInit {
  private utenteService:UtenteService=inject(UtenteService);
  private venditoreService:VenditoreService=inject(VenditoreService);
  eVenditore:string="Utente";
  mapUtentiChecked:Map<Utente, boolean>=new Map<Utente, boolean>();
  utenti:Utente[]=[];
  ordinamentoNome:boolean|null=null;
  ordinamentoCognome:boolean|null=null;
  ordinamentoNascita:boolean|null=null;
  mapVenditoreChecked:Map<Venditore, boolean>=new Map<Venditore, boolean>();
  venditori:Venditore[]=[];
  ordinamentoNomeSocieta:boolean|null=null;
  caricamentoVenditori:boolean=false;
  ordinamentoBan:boolean|null=null;
  utentiCaricati:number=20;
  private modalService=inject(NgbModal); //utilizzato per creare finestre modali
  utentiVisualizzati:Utente[]=[];
   venditoriVisualizzati: Venditore[]=[];
  showOptions: boolean = false;
  constructor( private sessionService:SessionService,private router:Router,  private toastr: ToastrService) {
  }
  ngOnInit(): void {
    this.sessionService.waitForUser().then(()=>{ //aspetta che l'utente sia settato
      if(!(this.sessionService.getUser() instanceof Admin)){
        this.router.navigate(['/home']).then();
        return;}
      this.utenteService.getListaUtenti().subscribe(value =>{
          this.utenti = value.map(utenteJson => new Utente(utenteJson, this.utenteService));
          this.utenti.forEach(utente => this.mapUtentiChecked.set(utente, false));
          if(this.utenti.length>=20) { //se ci sono più di 20 utenti ne visualizzo solo 20
            this.utenti.slice(0, 20).forEach(utente => this.utentiVisualizzati.push(utente));
          }else{
            this.utenti.forEach(utente => this.utentiVisualizzati.push(utente));
          }
        }
      )
    })
  }
  cambiaOrdinamentoNome() { //cambia l'ordinamento in base al nome
    this.ordinamentoNascita=null;
    this.ordinamentoCognome=null;
    this.ordinamentoBan=null;
    switch (this.ordinamentoNome){
      case true: this.ordinamentoNome=false;
        this.utentiVisualizzati=this.utentiVisualizzati.sort((a, b)=>{
          if(a.getNome()>b.getNome())
            return -1;
          if(a.getNome()<b.getNome())
            return 1;
          return 0;
        });
        break;
      case false: this.ordinamentoNome=null;break;
      default: this.ordinamentoNome=true;
        this.utentiVisualizzati=this.utentiVisualizzati.sort((a, b)=>{
          if(a.getNome()>b.getNome())
            return 1;
          if(a.getNome()<b.getNome())
            return -1;
          return 0;
        });
        break;
    }
  }
  cambiaOrdinamentoCognome() { //cambia l'ordinamento in base al cognome
    this.ordinamentoBan=null;
    this.ordinamentoNascita=null;
    this.ordinamentoNome=null;
    switch (this.ordinamentoCognome){
      case true: this.ordinamentoCognome=false;
        this.utentiVisualizzati=this.utentiVisualizzati.sort((a, b)=>{
          if(a.getCognome()>b.getCognome())
            return -1;
          if(a.getCognome()<b.getCognome())
            return 1;
          return 0;
        });
        break;
      case false: this.ordinamentoCognome=null;break;
      default: this.ordinamentoCognome=true;
        this.utentiVisualizzati=this.utentiVisualizzati.sort((a, b)=>{
          if(a.getCognome()>b.getCognome())
            return 1;
          if(a.getCognome()<b.getCognome())
            return -1;
          return 0;
        });
        break;
    }
  }

  cambiaOrdinamentoNascita() { //cambia l'ordinamento in base alla data di nascita
    this.ordinamentoBan=null;
    this.ordinamentoNome=null;
    this.ordinamentoCognome=null;
    switch (this.ordinamentoNascita){
      case true: this.ordinamentoNascita=false;
        this.utentiVisualizzati=this.utentiVisualizzati.sort((a, b)=>{
          if(a.getDataNascita()>b.getDataNascita())
            return -1;
          if(a.getDataNascita()<b.getDataNascita())
            return 1;
          return 0;
        });
        break;
      case false: this.ordinamentoNascita=null;break;
      default: this.ordinamentoNascita=true;
        this.utentiVisualizzati=this.utentiVisualizzati.sort((a, b)=>{
          if(a.getDataNascita()>b.getDataNascita())
            return 1;
          if(a.getDataNascita()<b.getDataNascita())
            return -1;
          return 0;
        });
        break;
    }
  }
  modificaUtente(utente: Utente) { //avvia la finestra modale e ne aspetta il risultato
    const modalRef=this.modalService.open(ModifyAUserByAdminComponent);
    modalRef.componentInstance.utente=utente;
    modalRef.dismissed.subscribe(value => {
      if(value!=null)
        this.toastr.success(`${value.getNome()} ${value.getCognome()} modificato correttamente`, 'Modifica effettuata');
      else
        this.toastr.error(`Impossibile modificare ${utente.getNome()} ${utente.getCognome()}`, 'Errore');
    });
  }
  updateTabella(tipo: string) {
    this.eVenditore=tipo;
    this.utentiCaricati=20;
    this.venditoriVisualizzati.slice(20);
    this.utentiVisualizzati.slice(20);
    if(this.eVenditore == "Venditore" && !this.caricamentoVenditori){ //se non ho ancora caricato i venditori li carico
      this.caricamentoVenditori=true;
      this.venditoreService.getListaVenditori().subscribe(value =>{
          this.venditori = value.map(venditoreJson => new Venditore(venditoreJson, this.venditoreService));
          this.venditori.forEach(utente => this.mapVenditoreChecked.set(utente, false));
          if(this.venditori.length>=20) {
            this.venditori.slice(0, 20).forEach(venditore => this.venditoriVisualizzati.push(venditore));
}else {
            this.venditori.forEach(venditore => this.venditoriVisualizzati.push(venditore));
          }
        }
      )
    }
  }
  cambiaOrdinamentoNomeSocieta() { //cambia l'ordinamento in base al nome della società
    this.ordinamentoBan=null;
    switch (this.ordinamentoNomeSocieta){
      case true: this.ordinamentoNomeSocieta=false;
        this.venditoriVisualizzati=this.venditoriVisualizzati.sort((a, b)=>{
          if(a.getNomeSocieta()>b.getNomeSocieta())
            return -1;
          if(a.getNomeSocieta()<b.getNomeSocieta())
            return 1;
          return 0;
        });
        break;
      case false: this.ordinamentoNomeSocieta=null;break;
      default: this.ordinamentoNomeSocieta=true;
        this.venditoriVisualizzati=this.venditoriVisualizzati.sort((a, b)=>{
          if(a.getNomeSocieta()>b.getNomeSocieta())
            return 1;
          if(a.getNomeSocieta()<b.getNomeSocieta())
            return -1;
          return 0;
        });
        break;
    }
  }
  modificaVenditore(venditore: Venditore) { //avvia la finestra modale e ne aspetta il risultato
    const modalRef=this.modalService.open(ModificaUnVenditoreDaAdminComponent);
    modalRef.componentInstance.venditore=venditore;
    modalRef.dismissed.subscribe(value => {
      this.toastr.success(` ${value.getNomeSocieta()} modificato correttamente`, 'Modifica effettuata');
    });
  }
  caricaUtenti() { //carica altri utenti tramite il bottone carica altro
    if(this.eVenditore=="Utente"){
    if(this.utentiCaricati+20>=this.utenti.length){
      this.utenti.slice(this.utentiCaricati, this.utenti.length).forEach(utente => this.utentiVisualizzati.push(utente));
      this.utentiCaricati=this.utenti.length;
    }else{
      this.utenti.slice(this.utentiCaricati, this.utentiCaricati+20).forEach(utente => this.utentiVisualizzati.push(utente));
      this.utentiCaricati+=20;
    }}else{
      if(this.utentiCaricati+20>=this.venditori.length){
        this.utentiCaricati=this.venditori.length;
        this.venditori.slice(this.utentiCaricati, this.venditori.length).forEach(venditore => this.venditoriVisualizzati.push(venditore));
      }else{
        this.venditori.slice(this.utentiCaricati, this.utentiCaricati+20).forEach(venditore => this.venditoriVisualizzati.push(venditore));
        this.utentiCaricati+=20;
      }
    }
  }
  disabilitaButtoneCaricaAltro():boolean { //disabilita il bottone carica altro se non ci sono più utenti da caricare
    if(this.eVenditore=="Utente"){
      return this.utentiCaricati>=this.utenti.length;
    }else{
      return this.utentiCaricati>=this.venditori.length;
    }
  }
  eliminaUtenti() { //elimina gli utenti selezionati
    if(this.eVenditore=="Utente"){
      this.mapUtentiChecked.forEach((value, key) => {
        if(value){
          this.utenteService.eliminaUtente(key.getIndirizzoEmail()).subscribe(_ => {
            this.utenti=this.utenti.filter(utente => utente.getIndirizzoEmail()!=key.getIndirizzoEmail());
            this.utentiVisualizzati=this.utentiVisualizzati.filter(utente => utente.getIndirizzoEmail()!=key.getIndirizzoEmail());
            this.mapUtentiChecked.delete(key);
            this.utentiCaricati-=1;
            this.toastr.success(`${key.getNome()} ${key.getCognome()} eliminato correttamente`, 'Eliminazione effettuata');
            },_ => {
              this.toastr.error(`Impossibile eliminare ${key.getNome()} ${key.getCognome()}`, 'Errore');
            }
          );
        }
      });
    }else {
      this.mapVenditoreChecked.forEach((value, key) => {
        if(value){
          this.venditoreService.eliminaVenditore(key.getNomeSocieta()).subscribe(_ => {
            this.venditori = this.venditori.filter(venditore => venditore.getIndirizzoEmail() != key.getIndirizzoEmail());
            this.venditoriVisualizzati = this.venditoriVisualizzati.filter(venditore => venditore.getIndirizzoEmail() != key.getIndirizzoEmail());
            this.mapVenditoreChecked.delete(key);
            this.utentiCaricati -= 1;
            this.toastr.success(`${key.getNomeSocieta()} eliminato correttamente`, 'Eliminazione effettuata');
          }, _ => {
              this.toastr.error(`Impossibile eliminare ${key.getNomeSocieta()}`, 'Errore');
            });
        }
      });
    }
  }
  cambiaOrdinamentoBan() { //cambia l'ordinamento in base allo stato di ban
    if(this.eVenditore=="Venditore"){
      this.ordinamentoNomeSocieta=null;
      switch (this.ordinamentoBan){
        case true: this.ordinamentoBan=false;
          this.venditoriVisualizzati=this.venditoriVisualizzati.sort((a, b)=>{
            if(a.getBan()>b.getBan())
              return -1;
            if(a.getBan()<b.getBan())
              return 1;
            return 0;
          });
          break;
        case false: this.ordinamentoBan=null;break;
        default: this.ordinamentoBan=true;
          this.venditoriVisualizzati=this.venditoriVisualizzati.sort((a, b)=>{
            if(a.getBan()>b.getBan())
              return 1;
            if(a.getBan()<b.getBan())
              return -1;
            return 0;
          });
          break;

      }
    }else{
      this.ordinamentoNome=null;
      this.ordinamentoCognome=null;
      this.ordinamentoNascita=null;
      switch (this.ordinamentoBan){
        case true: this.ordinamentoBan=false;
          this.utentiVisualizzati=this.utentiVisualizzati.sort((a, b)=>{
            if(a.getBan()>b.getBan())
              return -1;
            if(a.getBan()<b.getBan())
              return 1;
            return 0;
          });
          break;
        case false: this.ordinamentoBan=null;break;
        default: this.ordinamentoBan=true;
          this.utentiVisualizzati=this.utentiVisualizzati.sort((a, b)=>{
            if(a.getBan()>b.getBan())
              return 1;
            if(a.getBan()<b.getBan())
              return -1;
            return 0;
          });
          break;
      }
    }
  }
  bannaUtenti() { //banna o sbanna gli utenti selezionati
    if(this.eVenditore=="Utente"){
      this.mapUtentiChecked.forEach((value, key) => {
        if(value){
          this.utenteService.bannaUtente(key.getIndirizzoEmail()).subscribe(_ => {
            key.setBan(!key.getBan());
              // Find the index of the user in this.utenti
              const indexUtenti = this.utenti.findIndex(utente => utente.getIndirizzoEmail() === key.getIndirizzoEmail());
              // Find the index of the user in this.utentiVisualizzati
              const indexUtentiVisualizzati = this.utentiVisualizzati.findIndex(utente => utente.getIndirizzoEmail() === key.getIndirizzoEmail());
              // Update the user in this.utenti
              this.mapUtentiChecked.set(key, !this.mapUtentiChecked.get(key));
              this.utenti[indexUtenti].setBan(!this.utenti[indexUtenti].getBan());
              if (indexUtentiVisualizzati !== -1) {
                // Update the user in this.utentiVisualizzati
                this.utentiVisualizzati[indexUtentiVisualizzati].setBan(!this.utentiVisualizzati[indexUtentiVisualizzati].getBan());
              }
              if (key.getBan())
                this.toastr.success(`${key.getNome()} ${key.getCognome()} Bannato correttamente`, 'Ban effettuato');
              else
                this.toastr.success(`${key.getNome()} ${key.getCognome()} Sbannato correttamente`, 'Sban effettuato');
            },_ => {
            if(key.getBan())
              this.toastr.error(`${key.getNome()} ${key.getCognome()} Impossibile bannare`, 'Errore');

            else
              this.toastr.error(`${key.getNome()} ${key.getCognome()} Impossibile sbannare`, 'Errore');
              }
          );
        }
      });
    }else {
      this.mapVenditoreChecked.forEach((value, key) => {
        if(value){
          this.venditoreService.bannaVenditore(key.getNomeSocieta()).subscribe(_ => {
            key.setBan(!key.getBan());
            // Find the index of the user in this.utenti
            const indexVenditori = this.venditori.findIndex(venditore => venditore.getIndirizzoEmail() === key.getIndirizzoEmail());
            // Find the index of the user in this.utentiVisualizzati
            const indexVenditoriVisualizzati = this.venditoriVisualizzati.findIndex(venditore => venditore.getIndirizzoEmail() === key.getIndirizzoEmail());
            // Update the user in this.utenti
            this.venditori[indexVenditori].setBan(!this.venditori[indexVenditori].getBan());
            this.mapVenditoreChecked.set(key, !this.mapVenditoreChecked.get(key));
            if (indexVenditoriVisualizzati !== -1) {
              // Update the user in this.utentiVisualizzati
              this.venditoriVisualizzati[indexVenditoriVisualizzati].setBan(!this.venditoriVisualizzati[indexVenditoriVisualizzati].getBan());
              if (key.getBan())
                this.toastr.success(`${key.getNomeSocieta()} Bannato correttamente`, 'Ban effettuato');

            } else
              this.toastr.success(`${key.getNomeSocieta()} Sbannato correttamente`, 'Sban effettuato');

          },_ => { //eseguito se il backend ritorna un errore
              if(key.getBan())
                this.toastr.error(`${key.getNomeSocieta()} Impossibile bannare`, 'Errore');

              else
              this.toastr.error(`${key.getNomeSocieta()} Impossibile sbannare`, 'Errore');

            });
        }
      });
    }

  }
}

