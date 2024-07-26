import {Component, inject, Input, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from "@angular/forms";
import {Utente} from "../../../../model/Utente";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {UtenteService} from "../../../../services/utente.service";
@Component({
  selector: 'app-modify-a-user-by-admin',
  templateUrl: './modify-a-user-by-admin.component.html',
  styleUrl: './modify-a-user-by-admin.component.css'
})
export class ModifyAUserByAdminComponent implements OnInit{
  activeModal=inject(NgbActiveModal);
  list:UtenteService=inject(UtenteService);
@Input() utente!:Utente; //utente da modificare
  userCreationForm=new FormGroup({
    nome: new FormControl('', Validators.required),
    cognome: new FormControl('', Validators.required),
    email: new FormControl('',[
      Validators.required,
      Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
    numeroTelefono: new FormControl('', Validators.required),
    dataNascita: new FormControl('', Validators.required),
    password: new FormControl('', [Validators.required, Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$")]),
    passwordConferma: new FormControl('', Validators.required), //controllo se la password è uguale a passwordConferma
    submit:new FormControl('')
  })
  today:Date=new Date();
  mostraPassword: boolean=false;
  mostraPasswordConferma: boolean=false;
  mostraPasswordConfermaToggle(){
    this.mostraPasswordConferma=!this.mostraPasswordConferma;
  }
  mostraPasswordToggle(){
    this.mostraPassword=!this.mostraPassword;
  }

  constructor(){

  }
  ngOnInit(): void {
    this.userCreationForm.patchValue({
      nome: this.utente.getNome(),
      cognome: this.utente.getCognome(),
      email: this.utente.getIndirizzoEmail(),
      numeroTelefono: this.utente.getNumeroTelefono(),
      dataNascita: this.utente.getDataNascita().toString(),
      password: this.utente.getPassword(),
      passwordConferma: this.utente.getPassword(),
      submit: 'ok'
    });
  }
  chiudiFinestra() {
    this.activeModal.close();
  }
  submitModifica() {
    if(this.userCreationForm.get('email')?.dirty){
      this.list.checkEmailLibera(this.email?.value).subscribe(value => { //se si cambia email bisogna controllare che non sia già presente
        if(!value){
          this.email?.setErrors({'emailOccupata': true});
          return;
        }else {
            if(this.userCreationForm.valid){
              this.effettuaModificaUtente();
        }
      }});
  }else {
      if(this.userCreationForm.valid){
        this.effettuaModificaUtente();}}}

  formDisabilitato() { //vari controlli per abilitare o disabilitare il pulsante di submit
    const formValues = this.userCreationForm.value;
    const isFieldEmpty = Object.values(formValues).some(value => value === '');
    const hasValidationError = Object.keys(this.userCreationForm.controls).some(controlName => {
      const control = this.userCreationForm.get(controlName);
      return control && control.invalid;
    });

    // Compare form values with utente values
    const isDisabled = (
      formValues.nome === this.utente.getNome() &&
      formValues.cognome === this.utente.getCognome() &&
      formValues.email === this.utente.getIndirizzoEmail() &&
      formValues.numeroTelefono === this.utente.getNumeroTelefono() &&
      formValues.dataNascita === this.utente.getDataNascita().toString() &&
      formValues.password === this.utente.getPassword()
    );

    return isDisabled || isFieldEmpty || hasValidationError;

  }
  get nome(): AbstractControl | null {
    return this.userCreationForm.get('nome');
  }
  get cognome(): AbstractControl | null {
    return this.userCreationForm.get('cognome');
  }
  get email(): AbstractControl | null {
    return this.userCreationForm.get('email');
  }
  get numeroTelefono(): AbstractControl | null {
    return this.userCreationForm.get('numeroTelefono');
  }
  get dataNascita(): AbstractControl | null {
    return this.userCreationForm.get('dataNascita');
  }
  get password(): AbstractControl | null {
    return this.userCreationForm.get('password');
  }
  get passwordConferma(): AbstractControl | null {
    return this.userCreationForm.get('passwordConferma');
  }

  private effettuaModificaUtente() {
    let utente:Utente=this.utente;
    utente.setNome(this.nome?.value);
    utente.setCognome(this.cognome?.value);
    utente.setIndirizzoEmail(this.email?.value);
    utente.setNumeroTelefono(this.numeroTelefono?.value);
    const dataNascitaValue = this.dataNascita?.value;
    utente.setDataNascita(dataNascitaValue);
    utente.setPassword(this.password?.value);
    this.list.modificaUtente( utente,this.utente.getIndirizzoEmail()).subscribe(value => {
      this.activeModal.dismiss(this.utente);
      this.utente=utente;
    }, error => {
      this.activeModal.dismiss(null);

    });
    this.activeModal.close();
  }
  }


