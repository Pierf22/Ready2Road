import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import {ContactComponent} from "./pages/contact/contact.component";
import {PortafoglioComponent} from "./pages/portafoglio/portafoglio.component";
import {ImieibigliettiComponent} from "./pages/imieibiglietti/imieibiglietti.component";
import {DashBoardComponent} from "./pages/dashboard/dash-board.component";
import {RicercaComponent} from "./pages/ricerca/ricerca.component";
import {UtentiComponent} from "./pages/admin/utenti/utenti.component";
import {AreaPersonaleComponent} from "./pages/area-personale/area-personale.component";
import {TracciamentoComponent} from "./pages/tracciamento/tracciamento.component";
import {ListTratteComponent} from "./pages/admin/tratte/list-tratte.component";
import {CaricaserviziComponent} from "./pages/caricaservizi/caricaservizi.component";
import {ErrorPageComponent} from "./pages/error-page/error-page.component";
import {ChatDashboardComponent} from "./pages/chat-dashboard/chat-dashboard.component";
import { TerminicondizioniComponent } from "./pages/terminicondizioni/terminicondizioni.component";
import { ChisiamoComponent } from "./pages/chisiamo/chisiamo.component";
import { CambiaDatiUtenteComponent} from "./pages/cambia-dati-utente/cambia-dati-utente.component";
import {OperationErrorComponent} from "./pages/operation-error/operation-error.component";
import {CaricaOfferteComponent} from "./pages/dashboard/carica-offerte/carica-offerte.component";
import {CheckoutComponent} from "./pages/checkout/checkout.component";


const routes: Routes = [
  {path:'home', component: HomeComponent},
  {path:'contact', component: ContactComponent},
  {path:'portafoglio', component: PortafoglioComponent},
  {path:'imieibiglietti', component: ImieibigliettiComponent},
  {path:'ricerca', component: RicercaComponent},
  {path:'utenti', component: UtentiComponent},
  {path:'tratte', component: ListTratteComponent},
  {path:'dashboard', component: DashBoardComponent},
  {path: 'chatdashboard', component: ChatDashboardComponent},
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'areapersonale', component: AreaPersonaleComponent},
  {path: 'tracciamento', component: TracciamentoComponent},
  {path: 'caricaservizi', component: CaricaserviziComponent},
  {path: 'error', component: ErrorPageComponent},
  {path: 'terminicondizioni', component: TerminicondizioniComponent},
  {path: 'chisiamo', component: ChisiamoComponent},
  {path: 'cambiadatiutente', component: CambiaDatiUtenteComponent},
  {path: 'operationError', component: OperationErrorComponent},
  {path: 'caricaOfferte', component: CaricaOfferteComponent},
  {path: 'checkout', component: CheckoutComponent},
  {path: '**', redirectTo: '/error', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
