import {Component, OnInit} from '@angular/core';
import {SessionService} from "../../services/session.service";
import {Utente} from "../../model/Utente";
import {Venditore} from "../../model/Venditore";
import Swal from "sweetalert2";
import {Location} from "@angular/common";
import {AreapersonaleService} from "../../services/areapersonale.service";
import {UtenteService} from "../../services/utente.service";
import {VenditoreService} from "../../services/venditore.service";

@Component({
  selector: 'app-cambia-dati-utente',
  templateUrl: './cambia-dati-utente.component.html',
  styleUrl: './cambia-dati-utente.component.css'
})

export class CambiaDatiUtenteComponent implements OnInit {
  protected user: any = 'null';  //utente loggato
  protected email: any = 'null'; //email dell'utente loggato
  protected nome: any = 'null'; //nome dell'utente loggato
  protected cognome: any = 'null'; //cognome dell'utente loggato
  protected dataNascita: any = 'null'; //data di nascita dell'utente loggato
  protected telefono: any = 'null'; //telefono dell'utente loggato
  constructor(private session: SessionService, private location: Location, private profile: AreapersonaleService, private utenteService: UtenteService, private venditoreService: VenditoreService) { }

  async ngOnInit(): Promise<void> {
    // Utilizza l'operatore await per aspettare che l'utente diventi disponibile
    await this.session.waitForUser().then(() => {
      // Ora l'utente è disponibile, puoi ottenere i suoi dati
      this.user = this.session.getUser();

      this.email = this.user.indirizzoEmail;
      if(this.isVenditore()) {
        this.nome = this.user.nomeSocieta;
      }
      else if(this.isUtente()) {
        this.nome = this.user.nome;
        this.cognome = this.user.cognome;
        this.dataNascita = this.user.dataNascita;
        this.telefono = this.user.numeroTelefono;
      }
    });
  }

  isVenditore(): boolean {
    return this.user instanceof Venditore;
  }

  isUtente(): boolean {
    return this.user instanceof Utente;
  }

  confermaAnnulla(): void {
    // Mostra un messaggio di conferma per annullare le modifiche
    Swal.fire({
      text: 'Sei sicuro di voler annullare le modifiche?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
      confirmButtonColor: 'var(--primary-color)',
      cancelButtonColor: 'var(--primary-color)',
      background: '#4d4d4d',
      color: 'white'
    }).then((result) => {
      // Se l'utente conferma, annulla le modifiche e ricarica la pagina
      if (result.isConfirmed) {
        this.location.replaceState('/home');
        window.location.reload();
      }
    });
  }

  confermaModifiche(): void {
    // Mostra un messaggio di conferma per confermare le modifiche
    Swal.fire({
      text: 'Sei sicuro di voler confermare le modifiche? Una volta confermate verrà effettuato il logout.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
      confirmButtonColor: 'var(--primary-color)',
      cancelButtonColor: 'var(--primary-color)',
      background: '#4d4d4d',
      color: 'white'
    }).then(async (result) => {
      // Se l'utente conferma, aggiorna i dati e ricarica la pagina
      if (result.isConfirmed) {
        await this.updateData();

        this.location.replaceState('/home');
        window.location.reload();
      }
    });
  }

  async updateData(): Promise<void> {
    // Aggiorna i dati dell'utente
    if(this.user instanceof Utente) {
      this.user.setNome(this.nome);
      this.user.setCognome(this.cognome);
      this.user.setDataNascita(this.dataNascita);
      this.user.setNumeroTelefono(this.telefono);
      this.user.setPassword(this.user.getPassword());
      // Utilizza l'operatore await per aspettare che la richiesta di modifica dell'utente venga completata
      await new Promise<void>((resolve) => {
        this.utenteService.modificaUtente(this.user, this.email).subscribe((response: any) => {
          resolve();
        });
      });
    }
    else if(this.user instanceof Venditore) {
      this.user.setNomeSocieta(this.nome);
      this.user.setPassword(this.user.getPassword());
      // Utilizza l'operatore await per aspettare che la richiesta di modifica del venditore venga completata
      await new Promise<void>((resolve) => {
        this.venditoreService.modificaVenditore(this.user, this.email).subscribe((response: any) => {
          resolve();
        });
      });
    }
    // Utilizza l'operatore await per aspettare che la richiesta di logout venga completata
    await new Promise<void>((resolve) => {
      this.profile.logout().subscribe((response: any) => {
        resolve();
      });
    });
    this.session.logout();
  }
}
