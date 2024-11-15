import {Component, OnInit} from '@angular/core';
import {SessionService} from "../../services/session.service";
import {ConversazioneService} from "../../services/conversazione.service";
import {Conversazione} from "../../model/Conversazione";
import {Messaggio} from "../../model/Messaggio";
import {FormControl, FormGroup} from "@angular/forms";
import {Admin} from "../../model/Admin";
import {Router} from "@angular/router";
import {Venditore} from "../../model/Venditore";
import {NgxSpinnerService} from "ngx-spinner";
@Component({
  selector: 'app-chat-dashboard',
  templateUrl: './chat-dashboard.component.html',
  styleUrl: './chat-dashboard.component.css'
})
export class ChatDashboardComponent implements OnInit{
  utente:any;
  nomeUtente:string="";
  conversazioni:Conversazione[]=[];
  stato: string ="";
  conNotifica:boolean[]=[];
  messaggi:Messaggio[][]=[];
  caricamentoMessaggi:boolean[]=[];
  convSelezionata:number=-1;
  invioMessaggio=new FormGroup({
    testoMessaggio: new FormControl('')
  });
  constructor(private spinner: NgxSpinnerService, private router: Router, private sessionService: SessionService, protected conversazioneService: ConversazioneService) {
  }
  ngOnInit() {
    this.sessionService.waitForUser().then(()=>{ //aspetta che l'utente sia loggato
      if(!(this.sessionService.getUser() instanceof Admin || this.sessionService.getUser() instanceof Venditore)) {
        this.router.navigate(["/home"]).then();
        return;
      }else if(this.sessionService.getUser() instanceof Admin){
        this.utente = this.sessionService.getUser();
        this.nomeUtente=this.utente.getUsername();
        this.spinner.show().then();
        this.connessioneRicezioneNuoveConversazioni(); //connessione per ricevere nuove conversazioni
        this.conversazioneService.getConversazioniAdmin(this.nomeUtente).subscribe((data)=>{
          this.salvaConversazioni(data);
        });}else if(this.sessionService.getUser() instanceof Venditore){
        this.utente = this.sessionService.getUser();
        this.nomeUtente=this.utente.getNomeSocieta();
        this.spinner.show().then();
        this.connessioneRicezioneNuoveConversazioni();
        this.conversazioneService.getConversazioniVenditore(this.nomeUtente).subscribe((data)=>{
          this.salvaConversazioni(data);
        });
      }
    });
  }
  get testoMessaggio(){
    return this.invioMessaggio.get('testoMessaggio');
  }
  selezionaConversazione(index:number){ //seleziona una conversazione
    if(this.convSelezionata==index)
      return;
    this.spinner.show("caricamentoMessaggi",{
      fullScreen:false
    }).then();
      this.conNotifica[index]=false;
      this.convSelezionata=index;
      if(!this.caricamentoMessaggi[index]){
      this.conversazioneService.getMessaggi(this.conversazioni[index].getNome()).subscribe((data) => {
        for (let i = 0; i < data.length; i++) {
          this.messaggi[index].push(new Messaggio(data[i], this.conversazioneService));
        }
        this.spinner.hide("caricamentoMessaggi").then();
      });
      this.caricamentoMessaggi[index]=true;
      }else this.spinner.hide("caricamentoMessaggi").then();

      this.controllaLoStatoDellUtente(this.conversazioneService.getNomeAltroPartecipanteConv(this.nomeUtente, this.conversazioni[index].getNome()));
  }
  connessioneRicezioneMessaggi(i: number) {
    const channel = this.conversazioneService.connessioneAdUnCanale(this.conversazioni[i].getNome());
    channel.bind('messaggio', (data: any) => { //connessione per ricevere nuovi messaggi
      const messaggio: Messaggio = new Messaggio(data, this.conversazioneService);
      if(this.caricamentoMessaggi[i] && this.convSelezionata==i)
        this.messaggi[this.convSelezionata].push(messaggio);
  if(this.convSelezionata!=i){
    this.conNotifica[i]=true;
    }
  });
  }

  messaggioMio(messaggio:Messaggio){
    return messaggio.getMittente()==this.nomeUtente;
  }
  inviaMessaggio(){
    if(this.testoMessaggio?.value=="")
      return;

    this.conversazioneService.inviaMessaggio(this.nomeUtente, this.conversazioni[this.convSelezionata].getNome(), this.testoMessaggio?.value).subscribe((_)=> {
    this.testoMessaggio?.setValue("");

    });
  }

  private controllaLoStatoDellUtente(s: string) { //ricevo una notifica quando il numero di utenti su un canale cambia
    const channel = this.conversazioneService.connessioneAdUnCanale(s);
    channel.bind('pusher:subscription_count',  (data: any) =>{
      if(data.subscription_count<2)
        this.stato="offline";
      else
        this.stato="online";
    });

  }
  getNomeConvSelezionata() {
    return this.conversazioneService.getNomeAltroPartecipanteConv(this.nomeUtente, this.conversazioni[this.convSelezionata].getNome());
  }

  private connessioneRicezioneNuoveConversazioni() {
    const channel = this.conversazioneService.connessioneAdUnCanale(this.nomeUtente);
    channel.bind('nuovaConversazione',  (data: any) =>{ //evento quando qualcun'altro crea una conversazione con me partecipante
      let conv:Conversazione=new Conversazione(data, this.conversazioneService);
      this.conversazioni.push(conv);
      this.conNotifica.push(true);
      this.messaggi.push([]);
      this.caricamentoMessaggi.push(false);
      this.connessioneRicezioneMessaggi(this.conversazioni.length-1);

    });
    channel.bind('eliminaConversazione',  (data: any) =>{ //evento quando qualcun'altro elimina una conversaizone a cui sono partecipante
      let nomeConv:string=data;
      let index:number=-1;
for(let i=0;i<this.conversazioni.length;i++){
        if(this.conversazioni[i].getNome()==nomeConv){
          index=i;
          break;
        }
      }
      if(index!=-1){
        this.conversazioni.splice(index, 1);
        this.conNotifica.splice(index, 1);
        this.messaggi.splice(index, 1);
        this.caricamentoMessaggi.splice(index, 1);
        this.convSelezionata=-1;
      }
      this.conversazioneService.disconessioneDaUnCanale(nomeConv);
      this.conversazioneService.disconessioneDaUnCanale(this.conversazioneService.getNomeAltroPartecipanteConv(this.nomeUtente, nomeConv));

    });
  }

  private salvaConversazioni(data: Conversazione[]) {
    for(let i=0;i<data.length;i++){
      let conv:Conversazione=new Conversazione(data[i], this.conversazioneService);
      this.conversazioni.push(conv);
      this.connessioneRicezioneMessaggi(i);
      this.conNotifica.push(false);
      this.messaggi.push([]);

    }this.spinner.hide().then();

  }
}
