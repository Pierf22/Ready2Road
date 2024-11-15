import {Component, OnInit, signal} from '@angular/core';
import { SessionService } from '../../services/session.service';
import {Utente} from "../../model/Utente";
import {Admin} from "../../model/Admin";
import {Venditore} from "../../model/Venditore";
import {Location} from "@angular/common";
import {AreapersonaleService} from "../../services/areapersonale.service";
import Swal from "sweetalert2";
import { ThemeService } from "../../services/theme.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})

export class NavbarComponent implements OnInit {
  protected name = "Login";
  protected check: boolean = false;
  protected user: any;
  constructor(private sessionService: SessionService, private location: Location, private profile: AreapersonaleService, private theme: ThemeService) {}

  ngOnInit(): void {
    // Chiamo checkSession per inizializzare la sessione
    this.sessionService.checkSession();
    //this.sessionService.checkUser();
    this.waitUser();
  }

  async waitUser(): Promise<void> {
    await this.sessionService.waitForUser().then(()=>{
      this.user = this.sessionService.getUser();

      if(this.user != undefined){
        if(this.user instanceof Utente)
          this.name = this.user.getNome();
        else if(this.user instanceof Venditore)
          this.name = this.user.getNomeSocieta();
        this.check = true;
    }});

  }

  protected readonly Utente = Utente;
  seAdmin (): boolean {
    return this.user instanceof Admin;
  }
  seUtente(): boolean {
    return this.user instanceof Utente;
  }
  seVenditore(): boolean {
    return this.user instanceof Venditore;
  }

  logout(): void {
    Swal.fire({
      text: 'Sei sicuro di voler uscire?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
      confirmButtonColor: 'var(--primary-color)',
      cancelButtonColor: 'var(--primary-color)',
      background: '#4d4d4d',
      color: 'white'
    }).then(async (result) => {
      if (result.isConfirmed) {
        await this.logoutAll();

        this.location.replaceState('/home');
        window.location.reload();
      }
    });
  }

  async logoutAll(): Promise<void> {
    await new Promise<void>((resolve) => {
      this.profile.logout().subscribe((response: any) => {
        resolve();
      });
    });
    this.sessionService.logout();
  }

  toggleTheme() {
    this.theme.toggleTheme();
  }
}
