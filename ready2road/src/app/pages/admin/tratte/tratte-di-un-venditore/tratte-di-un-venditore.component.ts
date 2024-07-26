import {Component, inject, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {TratteService} from "../../../../services/tratte.service";
import {mezzi, Tratta} from "../../../../model/Tratta";
import {AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators} from "@angular/forms";
import {NgxSpinnerService} from "ngx-spinner";
import {ToastrService} from "ngx-toastr";
import {VenditoreService} from "../../../../services/venditore.service";
@Component({
  selector: 'app-tratte-di-un-venditore',
  templateUrl: './tratte-di-un-venditore.component.html',
  styleUrl: './tratte-di-un-venditore.component.css'
})
export class TratteDiUnVenditoreComponent implements OnInit{
  activeModal=inject(NgbActiveModal);//finesta modale
  @Input() partenza!:string; //dati in input
  @Input() arrivo!:string;
  @Input() nomeSocieta!:string;
  mostraVecchieTratte: boolean=true;
  service:TratteService=inject(TratteService);
  tratte:Tratta[]=[];
  tratteFiltrate:Tratta[]=[];
  venditoreService=inject(VenditoreService);
  trattaInModifica:boolean[]=[];

  ricercaForm=new FormGroup({ //form di ricerca
    dataInizio: new FormControl('', Validators.required),
    dataFine: new FormControl('', Validators.required)
  });
  private necessitaReload:boolean=false ;
  get dataInizio() {
    return this.ricercaForm.get('dataInizio');
  }
  get dataFine() {
    return this.ricercaForm.get('dataFine');
  }

  trattaModificaForm=new FormGroup({ //form di modifica
    id: new FormControl('',[ Validators.required,  Validators.pattern(/^[a-zA-Z0-9]+$/)]),
    partenza: new FormControl('',[ Validators.required, Validators.pattern(/^[a-zA-Z() ]+$/)]),
    destinazione: new FormControl('', [ Validators.required, Validators.pattern(/^[a-zA-Z() ]+$/)]),
    dataPartenza: new FormControl('', Validators.required),
    oraPartenza: new FormControl('', Validators.required),
    capienza: new FormControl('', [Validators.required]),
    postiDisponibili: new FormControl('', [Validators.required]),
    tipoMezzo: new FormControl('', Validators.required),
    prezzo: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]+(\.[0-9]{1,2})?$/)]),
    sconto: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]+(\.[0-9]{1,2})?$/)]),
    numero_biglietti_scontati: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]+$/)]),

  });
  today:Date = new Date();

  constructor(private spinner: NgxSpinnerService, private toast:ToastrService) {
  }
  chiudiFinestra(){ //chiude la finestra modale e comunica se bisogna ricaricare la lista delle tratte
    this.activeModal.dismiss(this.necessitaReload);
  }
  ngOnInit(): void {
    this.spinner.show().then();
    this.postiDisponibili?.addValidators([this.seCapienzaMinoreDiPosti()]);
    this.numero_biglietti_scontati?.addValidators(this.numeroBigliettiControllo());
    this.dataPartenza?.addValidators(this.eDataOrdiena());
    this.ricercaForm.valueChanges.subscribe((_) => {
      this.ricercaPerData(); //ogni volta che cambia il valore del form di ricerca, si aggiornano le tratte filtrate

    });
    this.service.getTratteDiUnVenditore(this.nomeSocieta, this.arrivo, this.partenza).subscribe(
      response=>{
        for(let i=0;i<response.length;i++){
          this.tratte[i]=new Tratta(response[i], this.service, this.venditoreService);
        }
        this.tratteFiltrate=this.tratte;
        this.trattaInModifica.fill(false, 0, this.tratte.length);
        this.spinner.hide().then();
      });
  }

  modificaTratta(index: number) {
    // Abilita la modalità di modifica per la tratta corrente
    this.trattaInModifica.fill(false, 0, this.tratteFiltrate.length);
    this.trattaInModifica[index] = true;

    // Otteni la data e l'orario dalla tratta
    const dataOraTratta = new Date(this.tratteFiltrate[index].getData_ora());

    // Formatta la data nel formato 'YYYY-MM-DD'
    const dataFormattata = this.formatDate(dataOraTratta);

    // Formatta l'orario nel formato 'HH:mm:ss'
    const oraFormattata = this.formatTime(dataOraTratta);

    // Imposta i valori nel form
    this.trattaModificaForm.patchValue({
      id: this.tratteFiltrate[index].getId(),
      partenza: this.tratteFiltrate[index].getPartenza(),
      destinazione: this.tratteFiltrate[index].getDestinazione(),
      dataPartenza: dataFormattata,
      oraPartenza: oraFormattata,
      capienza: this.tratteFiltrate[index].getCapienza().toString(),
      postiDisponibili: this.tratteFiltrate[index].getPosti_disponibili().toString(),
      tipoMezzo: this.tratteFiltrate[index].getTipo_mezzo().toString(),
      prezzo: this.tratteFiltrate[index].getPrezzo().toString(),
      sconto: this.tratteFiltrate[index].getSconto().toString(),
      numero_biglietti_scontati: this.tratteFiltrate[index].getBiglietti_scontati().toString()
    });
  }

  eliminaTratta(index:number) {
    if (!window.confirm("Sei sicuro di voler eliminare la tratta?")) {
      return;
    }
    this.spinner.show().then();
    this.service.eliminaTratta(this.tratteFiltrate[index].getId()).subscribe(
      _=>{
        for(let j=0;j<this.tratte.length;j++){
          if(this.tratte[j].getId()==this.tratteFiltrate[index].getId()){
            this.tratte.splice(j,1);
            break;
          }
        }
        this.tratteFiltrate.splice(index,1);
        this.trattaInModifica.splice(index,1);
        if(this.tratte.length==0)
          this.necessitaReload=true; //se non ci sono più tratte da visualizzare
        this.toast.success("Tratta eliminata con successo");

      }, _ => { //errore http
        this.toast.error("Errore nell'eliminazione della tratta");
      });
    this.spinner.hide().then();

  }

  isDataOraPassata(dataOra: Date) {
    const dataOraTratta = new Date(dataOra);
    const dataOraAttuale = new Date();
    return dataOraTratta < dataOraAttuale;
  }
  escidallaModifica(i: number) {
    this.trattaInModifica[i]=false;
  }
// Metodo per formattare la data
  private formatDate(data: Date): string {
    const giorno = data.getDate();
    const mese = data.getMonth() + 1;
    const anno = data.getFullYear();

    return `${anno}-${mese.toString().padStart(2, '0')}-${giorno.toString().padStart(2, '0')}`;
  }
  minimoOrario(){
    const orarioAttualePiuUnOra = new Date(this.today);
    //la modifica può essere effettuata con un preavviso di almeno due ore
    orarioAttualePiuUnOra.setHours(orarioAttualePiuUnOra.getHours() + 2, 0, 0, 0);

    if(this.dataPartenza?.value!=null && this.dataPartenza?.value!=''){
      if(this.dataPartenza?.value==this.formatDate(orarioAttualePiuUnOra)) {
        if(this.oraPartenza?.value!=null && this.oraPartenza?.value!='' && this.oraPartenza?.value<this.formatTime(orarioAttualePiuUnOra))
          this.oraPartenza.setValue(this.formatTime(orarioAttualePiuUnOra));
        return this.formatTime(orarioAttualePiuUnOra);
      }
    } return null;}
  eDataOrdiena(){
    return (_: AbstractControl): ValidationErrors | null => {
      if(this.dataPartenza?.value!=null && this.dataPartenza?.value!=''){
        let dataPartenza=new Date(this.dataPartenza?.value);
        if(dataPartenza<this.today){
          return { 'dataOrdinata': true };
        }
      }  return { 'dataOrdinata': false };
    }
  }

  seCapienzaMinoreDiPosti():ValidatorFn{ //validator personalizzato per il form
    return (_: AbstractControl): ValidationErrors | null => {
      if(this.capienza?.value!=null && this.capienza?.value!='' && this.postiDisponibili?.value!=null && this.postiDisponibili?.value!=''){
        let capienza=parseInt(this.capienza?.value);
        let postiDisponibili=parseInt(this.postiDisponibili?.value);
        if(capienza<postiDisponibili){
          return { 'capienzaMinorePosti': true };
        }
      }  return null;
    }}
// Metodo per formattare l'orario
  private formatTime(data: Date): string {
    const ore = data.getHours();
    const minuti = data.getMinutes();
    const secondi = data.getSeconds();

    return `${ore.toString().padStart(2, '0')}:${minuti.toString().padStart(2, '0')}:${secondi.toString().padStart(2, '0')}`;
  }
  formDisabilitato(index:number){
    const formValues = this.trattaModificaForm.value;
    const isFieldEmpty = Object.values(formValues).some(value => value === '');
    const hasValidationError = Object.keys(this.trattaModificaForm.controls).some(controlName => {


      const control = this.trattaModificaForm.get(controlName);
      return control && (control.hasError('required') || control.hasError('pattern') ||  control.hasError('capienzaMinorePosti') || control.hasError("bigliettiScontatiNonValidi"));
    });

    // Otteni la data e l'orario dalla tratta
    const dataOraTratta = new Date(this.tratteFiltrate[index].getData_ora());

    // Formatta la data nel formato 'YYYY-MM-DD'
    const dataFormattata = this.formatDate(dataOraTratta);

    // Formatta l'orario nel formato 'HH:mm:ss'
    const oraFormattata = this.formatTime(dataOraTratta);
    // Compare form values with utente values
    const isDisabled = (
      formValues.id === this.tratteFiltrate[index].getId() &&
      formValues.dataPartenza === dataFormattata &&
      formValues.oraPartenza ===oraFormattata&&
      formValues.capienza === this.tratteFiltrate[index].getCapienza().toString() &&
      formValues.postiDisponibili === this.tratteFiltrate[index].getPosti_disponibili().toString() &&
      formValues.tipoMezzo === this.tratteFiltrate[index].getTipo_mezzo().toString() &&
      formValues.partenza === this.tratteFiltrate[index].getPartenza() &&
      formValues.destinazione === this.tratteFiltrate[index].getDestinazione() &&
      formValues.prezzo === this.tratteFiltrate[index].getPrezzo().toString() &&
      formValues.sconto === this.tratteFiltrate[index].getSconto().toString() &&
      formValues.numero_biglietti_scontati === this.tratteFiltrate[index].getBiglietti_scontati().toString()
    );

    return isDisabled || isFieldEmpty || hasValidationError;

  }
  get id() {
    return this.trattaModificaForm.get('id');
  }
  get dataPartenza() {
    return this.trattaModificaForm.get('dataPartenza');
  }
  get oraPartenza() {
    return this.trattaModificaForm.get('oraPartenza');
  }
  get capienza() {
    return this.trattaModificaForm.get('capienza');
  }
  get postiDisponibili() {
    return this.trattaModificaForm.get('postiDisponibili');
  }
  get tipoMezzo() {
    return this.trattaModificaForm.get('tipoMezzo');
  }
  get partenzaTratta() {
    return this.trattaModificaForm.get('partenza');
  }
  get destinazioneTratta() {
    return this.trattaModificaForm.get('destinazione');
  }
  get prezzo() {
    return this.trattaModificaForm.get('prezzo');
  }
  get sconto() {
    return this.trattaModificaForm.get('sconto');
  }
  get numero_biglietti_scontati() {
    return this.trattaModificaForm.get('numero_biglietti_scontati');
  }
  private ricercaPerData() {
    let dataInizioVar:Date|null=null;
    let dataFineVar:Date|null=null;
    if(this.dataInizio?.value!=null && this.dataInizio?.value!='')
      dataInizioVar=new Date(this.dataInizio?.value);
    if (this.dataFine?.value!=null && this.dataFine?.value!='')
      dataFineVar=new Date(this.dataFine?.value);

    this.tratteFiltrate=this.tratte.filter(tratta=>{
      const dataOraTratta = new Date(tratta.getData_ora());
      if(dataInizioVar!=null&&dataFineVar!=null){
        return dataOraTratta>=dataInizioVar&&dataOraTratta<=dataFineVar;}
      else if(dataInizioVar!=null){
        return dataOraTratta>=dataInizioVar;
      }
      else if(dataFineVar!=null){
        return dataOraTratta<=dataFineVar;
      }
      else return true;
    });
    this.trattaInModifica.fill(false, 0, this.tratteFiltrate.length);
  }
  salvaModifiche(i: number) {
    let value:number=parseInt(<string>this.postiDisponibili?.value);
    if(this.tratteFiltrate[i].getPosti_disponibili()<value){
      window.alert("Il numero di posti disponibili non può essere maggiore di quello precedente");
      return;
    }
    this.spinner.show().then();
    let trattamodificata:Tratta=this.tratteFiltrate[i].copy();
    trattamodificata.setId(<string>this.id?.value);
    trattamodificata.setCapienza(parseInt(<string>this.capienza?.value));
    trattamodificata.setPosti_disponibili(parseInt(<string>this.postiDisponibili?.value));
    trattamodificata.setData_ora(new Date(this.dataPartenza?.value+" "+this.oraPartenza?.value));
    trattamodificata.setTipo_mezzo(<mezzi>Tratta.converti(<string>this.tipoMezzo?.value));
    trattamodificata.setPartenza(<string>this.partenzaTratta?.value);
    trattamodificata.setDestinazione(<string>this.destinazioneTratta?.value);
    trattamodificata.setPrezzo(parseFloat(<string>this.prezzo?.value));
    trattamodificata.setSconto(parseInt(<string>this.sconto?.value));
    trattamodificata.setBiglietti_scontati(parseInt(<string>this.numero_biglietti_scontati?.value));
    this.service.modificaTratta(this.tratteFiltrate[i].getId(), trattamodificata).subscribe(
      _=>{
        if(this.tratteFiltrate[i].getPartenza()!=trattamodificata.getPartenza()||this.tratteFiltrate[i].getDestinazione()!=trattamodificata.getDestinazione()){
          for(let j=0;j<this.tratte.length;j++){
            if(this.tratte[j].getId()==this.tratteFiltrate[i].getId()){
              this.tratte.splice(j,1);
              break;
            }
          }
          this.necessitaReload=true;
          this.tratteFiltrate.splice(i,1);
          this.trattaInModifica.splice(i,1);
        }else {
          for(let j=0;j<this.tratte.length;j++){
            if(this.tratte[j].getId()==this.tratteFiltrate[i].getId()){
              this.tratte[j]=trattamodificata;
              break;
            }
          }
          this.tratteFiltrate[i]=trattamodificata;
          this.trattaInModifica[i]=false;}
        this.toast.success("Tratta modificata con successo");



      }, _ => {
        this.toast.error("Errore nella modifica della tratta");
      });
    this.spinner.hide().then();
  }

  private numeroBigliettiControllo():ValidatorFn { //validator personalizzato per il form
    return (_: AbstractControl): ValidationErrors | null => {
      if(this.numero_biglietti_scontati?.value!=null && this.numero_biglietti_scontati?.value!='' && this.postiDisponibili?.value!=null && this.postiDisponibili?.value!=''){
        let numeroBiglietti=parseInt(this.numero_biglietti_scontati?.value);
        let postiDisponibili=parseInt(this.postiDisponibili?.value);
        if(numeroBiglietti>postiDisponibili){
          return { 'bigliettiScontatiNonValidi': true };
        }
      }  return null;
    }
  }
}
