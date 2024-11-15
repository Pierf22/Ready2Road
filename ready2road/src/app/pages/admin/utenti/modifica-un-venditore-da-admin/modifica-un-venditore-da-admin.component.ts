import {Component, inject, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {AbstractControl, FormControl, FormGroup, Validators} from "@angular/forms";
import {Venditore} from "../../../../model/Venditore";
import {VenditoreService} from "../../../../services/venditore.service";
@Component({
  selector: 'app-modifica-un-venditore-da-admin',
  templateUrl: './modifica-un-venditore-da-admin.component.html',
  styleUrls: ['./modifica-un-venditore-da-admin.component.css', '../modify-a-user-by-admin/modify-a-user-by-admin.component.css']
})
export class ModificaUnVenditoreDaAdminComponent implements OnInit{
  activeModal=inject(NgbActiveModal);
  list:VenditoreService=inject(VenditoreService);
  @Input() venditore!:Venditore; //venditore da modificare
  userCreationForm=new FormGroup({
    nomeSocieta: new FormControl('', Validators.required),
    email: new FormControl('',[
      Validators.required,
      Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
    password: new FormControl('', [Validators.required, Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$")]),
    passwordConferma: new FormControl('', Validators.required),
    submit:new FormControl('')
  })
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
      nomeSocieta: this.venditore.getNomeSocieta(),
      email: this.venditore.getIndirizzoEmail(),
      password: this.venditore.getPassword(),
      passwordConferma: this.venditore.getPassword(),
      submit: 'ok'
    });
  }
  chiudiFinestra() {
    this.activeModal.close();
  }
  submitModifica() {
    if(this.userCreationForm.get('email')?.dirty || this.userCreationForm.get('nomeSocieta')?.dirty){
      this.list.checkVenditoreDisponibile(this.email?.value, this.nomeSocieta?.value).subscribe(value => {
        if(!value){
          this.email?.setErrors({'emailOccupata': true});
          return;
        }else {
          if(this.userCreationForm.valid){
            this.effettuaModifica();
          }
        }});
    }else {
      if(this.userCreationForm.valid){
        this.effettuaModifica();
      }}}

  formDisabilitato() {
    const formValues = this.userCreationForm.value;
    const isFieldEmpty = Object.values(formValues).some(value => value === '');
    const hasValidationError = Object.keys(this.userCreationForm.controls).some(controlName => {
      const control = this.userCreationForm.get(controlName);
      return control && control.invalid;
    });

    // Compare form values with utente values
    const isDisabled = (
        formValues.nomeSocieta === this.venditore.getNomeSocieta() &&
        formValues.email === this.venditore.getIndirizzoEmail() &&
        formValues.password === this.venditore.getPassword()
    );

    return isDisabled || isFieldEmpty || hasValidationError;

  }
  get nomeSocieta(): AbstractControl | null {
    return this.userCreationForm.get('nomeSocieta');
  }
  get email(): AbstractControl | null {
    return this.userCreationForm.get('email');
  }

  get password(): AbstractControl | null {
    return this.userCreationForm.get('password');
  }
  get passwordConferma(): AbstractControl | null {
    return this.userCreationForm.get('passwordConferma');
  }

  private effettuaModifica() {
    let venditore:Venditore=this.venditore;
    venditore.setNomeSocieta(this.nomeSocieta?.value);
    venditore.setIndirizzoEmail(this.email?.value);
    venditore.setPassword(this.password?.value);
    this.list.modificaVenditore( venditore,this.venditore.getNomeSocieta()).subscribe(_ => {
      this.activeModal.dismiss(this.venditore);
      this.venditore=venditore;
    }, _ => {
      this.activeModal.dismiss(null);

    });
  }
}
