import {Component, OnInit} from '@angular/core';
import {SessionService} from "../../services/session.service";
import {Utente} from "../../model/Utente";
import {Venditore} from "../../model/Venditore";
import {Conversazione} from "../../model/Conversazione";
import {ConversazioneService} from "../../services/conversazione.service";
import {VenditoreService} from "../../services/venditore.service";
import {AdminService} from "../../services/admin.service";
import {Admin} from "../../model/Admin";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {Messaggio} from "../../model/Messaggio";
import {NgxSpinnerService} from "ngx-spinner";
@Component({
  selector: 'app-chat-widget',
  templateUrl: './chat-widget.component.html',
  styleUrls: ['./chat-widget.component.css', "../chat-dashboard/chat-dashboard.component.css"]
})
export class ChatWidgetComponent implements OnInit{
   mostaWidget:boolean = false;  //utilizzato per mostrare il widget solo se l'utente è un utente
   utente:any;
  mosta: boolean=false; //utilizzato per mostrare la schermata
  stato:string="";
   invioMessaggio=new FormGroup({ //form per leggere il testo del messaggio
    testoMessaggio: new FormControl('')
  });
  conversazioni: Conversazione[] = [];
  messaggi:Messaggio[][]=[];
  private caricamentoMessaggi:boolean[]=[]; //utilizzato per sapere se i messaggi sono stati caricati
  conNotifica:boolean[]=[]; //utilizzato per sapere se ci sono nuovi messaggi
  admins:Admin[]=[]; //lista degli admin con cui aprire una nuova conversazione
  venditori:Venditore[]=[]; //lista dei venditori con cui aprire una nuova conversazione
  aggiungiConversazione: boolean=false;  //schermata per aggiungere una nuova conversazione
  mostaSingolaConversazione: boolean=false; //schermata per mostrare una singola conversazione
  conversazioneSelezionata: number=-1; //indice della conversazione selezionata
  selezionaUtente: FormGroup<{utenteSelezionato:FormControl<any>}> = this.formBuilder.group({ //form per selezionare un utente con cui aprire una nuova conversazione (admin o venditore)
    utenteSelezionato: this.venditori[0]
  });
  constructor(private spinner: NgxSpinnerService, private formBuilder:FormBuilder, private venditoreService:VenditoreService, private adminService:AdminService, private sessionService: SessionService, protected conversazioneService: ConversazioneService) {}
  ngOnInit() {
    this.sessionService.waitForUser().then(_ =>{
      this.utente = this.sessionService.getUser(); //ottengo l'utente loggato
    if((this.utente instanceof Utente) ) {
      this.mostaWidget = true; //se l'utente è un utente mostro il widget
    this.conversazioneService.connessioneAdUnCanale(this.utente.getIndirizzoEmail()); //mi connetto al canale pusher dell'utente
      this.conversazioneService.getConversazioniUtente(this.utente.getIndirizzoEmail()).subscribe(conversazioni => {
        for(let i=0; i<conversazioni.length; i++){ //carico le conversazioni dal backend
          let conversazione=new Conversazione(conversazioni[i], this.conversazioneService);
          this.conversazioni.push(conversazione);
          this.conNotifica.push(false);
          this.messaggi.push([]);
          this.caricamentoMessaggi.push(false);
          this.connettitiAConversazione(conversazione); //mi connetto al canale pusher della conversazione
        }
      });
      this.adminService.getAdmins().subscribe(listaAdmin=>{ //carico la lista degli admin per in futuro poter creare una nuova conversazione
        for(let i=0; i<listaAdmin.length; i++){
          let admin=new Admin(listaAdmin[i]);
          this.admins.push(admin);
        }
      });
      this.venditoreService.getListaVenditori().subscribe(listaVenditori=>{ //carico la lista dei venditori per in futuro poter creare una nuova conversazione
        for(let i=0; i<listaVenditori.length; i++){
          this.venditori.push(new Venditore(listaVenditori[i], this.venditoreService));
        }
        this.selezionaUtente=this.formBuilder.group({
          utenteSelezionato:this.venditori[0] //inizializzo il form per avviare una nuova conversazione
        });
      });
    }});
  }
  protected mostraChat(){
    this.mosta = !this.mosta;
    if(this.mosta && this.conversazioneSelezionata!=-1){ //permette di mantenere una notifica anche se si apre e chiude la schermata
      this.conNotifica[this.conversazioneSelezionata]=false;
    }
  }

private get utenteSelezionato(){ //prende il dato dal form
    return this.selezionaUtente.get("utenteSelezionato")?.value;
}
  protected avviaChat() { //avvia una nuova conversazione
    let conversazione;
    if(this.utenteSelezionato instanceof Venditore) {
       conversazione = this.conversazioni.find(conversazione => this.utenteSelezionato?.getNomeSocieta() == this.conversazioneService.getNomeAltroPartecipanteConv(this.utente.getIndirizzoEmail(), conversazione.getNome()));
    }else if(this.utenteSelezionato instanceof Admin){
      conversazione=this.conversazioni.find(conversazione =>  this.utenteSelezionato?.getUsername()==this.conversazioneService.getNomeAltroPartecipanteConv(this.utente.getIndirizzoEmail(), conversazione.getNome()))
    }
    if(conversazione!=undefined){ //se la conversazione esiste già, la mostro non essendo possibili duplicati
      this.mostraConversazione(this.conversazioni.indexOf(conversazione));
    }else {
    this.aggiungiConversazione=false; //carico la conversazione dal backend
    this.conversazioneService.creaConversazione(this.utenteSelezionato, this.utente.getIndirizzoEmail()).subscribe(conversazione =>{
      let conv=new Conversazione(conversazione, this.conversazioneService);
      this.conversazioni.push(conv);
      this.conNotifica.push(false);
      this.messaggi.push([]);
      this.caricamentoMessaggi.push(false);
      this.connettitiAConversazione(conv); //mi connetto al canale pusher della conversazione
    });}
  }
  protected mostaAggiungiConversazione() { //mostra la schermata per aggiungere una nuova conversazione
    this.aggiungiConversazione=true;
  }
  protected mostraConversazione(i:number) { //mostra una singola conversazione
    this.stato="";
    this.mostaSingolaConversazione=true;
    this.conversazioneSelezionata=i;
    this.conNotifica[i]=false;
    this.spinner.show("caricamentoMessaggi",{
      fullScreen:false
    }).then(); //mostro lo spinner per il caricamento dei messaggi
    if(!this.caricamentoMessaggi[i]){ //carico i messaggi dal backend solo la prima volta
    this.conversazioneService.getMessaggi(this.conversazioni[i].getNome()).subscribe(m =>{
      for(let j=0; j<m.length; j++){
        this.messaggi[i].push(new Messaggio(m[j], this.conversazioneService));
      }
      this.spinner.hide("caricamentoMessaggi").then();
    }); this.caricamentoMessaggi[i]=true;
    }else this.spinner.hide("caricamentoMessaggi").then();
    this.controllaLoStatoDellUtente(this.conversazioneService.getNomeAltroPartecipanteConv(this.utente.getIndirizzoEmail(), this.conversazioni[i].getNome()));
  }
   private connettitiAConversazione(conversazione: Conversazione) {
    //mi connetto al canale pusher della conversazione
     const channel = this.conversazioneService.connessioneAdUnCanale(conversazione.getNome());
     channel.bind('messaggio', (data: any) => { //quando arriva un messaggio
       const messaggio: Messaggio = new Messaggio(data, this.conversazioneService);
       if ( ( !this.mosta || this.conversazioneSelezionata==-1 || this.conversazioni[this.conversazioneSelezionata].getNome() != data.conversazione.nome) && messaggio.getMittente()!=this.utente.getIndirizzoEmail()){
        this.conNotifica[this.conversazioni.indexOf(conversazione)] = true; //se la schermata non è aperta e il mittente non è l'utente, mostro una notifica
      } if(this.caricamentoMessaggi[this.conversazioni.indexOf(conversazione)]){ //se i messaggi sono stati caricati, aggiungo il messaggio
        this.messaggi[this.conversazioni.indexOf(conversazione)].push(messaggio);}
    });
  }
  private  controllaLoStatoDellUtente(s: string) {
    const channel = this.conversazioneService.connessioneAdUnCanale(s);
    channel.bind('pusher:subscription_count', (data: any) => { //ricevo una notifica se il numero di utenti connessi al canale cambia
      if (data.subscription_count >= 2)  //e immediatamente ricevo il numero di utenti connessi
        this.stato = "online";
      else
        this.stato="offline";
    });
  }
private get testoMessaggio(){ //prende il testo del messaggio dal form
  return this.invioMessaggio.get('testoMessaggio');
}
  protected inviaMessaggio(){ //invia un messaggio contattando il backend
    if(this.testoMessaggio?.value=="")
      return;
    this.conversazioneService.inviaMessaggio(this.utente.getIndirizzoEmail(), this.conversazioni[this.conversazioneSelezionata].getNome(), this.testoMessaggio?.value).subscribe((_)=> {
      this.testoMessaggio?.setValue("");

    });
  }
  protected tornaAListaConversazione() { //torna alla lista delle conversazioni
    this.mostaSingolaConversazione=false;
    this.aggiungiConversazione=false;
    this.conversazioneService.disconessioneDaUnCanale(this.conversazioneService.getNomeAltroPartecipanteConv(this.utente.getIndirizzoEmail(), this.conversazioni[this.conversazioneSelezionata].getNome()));
    this.conversazioneSelezionata=-1;
  }
  protected eliminaConversazione(conversazione: Conversazione, i:number) {
    this.spinner.show("eliminazioneConversazione",{
      fullScreen:false
    }).then();
    this.conversazioni.splice(i, 1);
    this.conNotifica.splice(i, 1);
    this.messaggi.splice(i, 1);
    this.caricamentoMessaggi.splice(i, 1);
    this.conversazioneService.eliminaConversazione(this.conversazioneService.getNomeAltroPartecipanteConv(this.utente.getIndirizzoEmail(), conversazione.getNome()), conversazione.getNome()).subscribe((_)=>{
      this.conversazioneService.disconessioneDaUnCanale(conversazione.getNome()); //mi disconnetto dal canale pusher della conversazione
      this.conversazioneService.disconessioneDaUnCanale(this.conversazioneService.getNomeAltroPartecipanteConv(this.utente.getIndirizzoEmail(), conversazione.getNome())); //mi disconnetto dal canale pusher dell'altro partecipante
      this.spinner.hide("eliminazioneConversazione").then();
    });
  }
}

