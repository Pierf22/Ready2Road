import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {DatePipe, NgOptimizedImage} from "@angular/common";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './sharepage/navbar/navbar.component';
import { FooterComponent } from './sharepage/footer/footer.component';
import { HomeComponent } from './pages/home/home.component';
import { ContactComponent } from './pages/contact/contact.component';
import { ImieibigliettiComponent } from './pages/imieibiglietti/imieibiglietti.component';
import { PortafoglioComponent } from './pages/portafoglio/portafoglio.component';
import { DashBoardComponent } from './pages/dashboard/dash-board.component';
import { HttpClientModule } from '@angular/common/http';
import { NgChartsModule } from 'ng2-charts';
import {BrowserAnimationsModule, provideAnimations} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { MetodiDiPagamentoPieChart } from './pages/dashboard/metodi-di-pagamento-chart/metodi-di-pagamento-pie-chart.component';
import { VenditeLineChartComponent } from './pages/dashboard/vendite-line-chart/vendite-line-chart.component';
import { GuadagniLineChartComponent } from './pages/dashboard/guadagni-line-chart/guadagni-line-chart.component';
import { UtentiComponent } from './pages/admin/utenti/utenti.component';
import { ModifyAUserByAdminComponent } from './pages/admin/utenti/modify-a-user-by-admin/modify-a-user-by-admin.component';
import {NgbAlert} from "@ng-bootstrap/ng-bootstrap";
import {provideToastr, ToastrModule, ToastrService} from "ngx-toastr";
import { CookieService } from 'ngx-cookie-service';
import { ModificaUnVenditoreDaAdminComponent } from './pages/admin/utenti/modifica-un-venditore-da-admin/modifica-un-venditore-da-admin.component';
import { AreaPersonaleComponent } from './pages/area-personale/area-personale.component';
import { TracciamentoComponent } from './pages/tracciamento/tracciamento.component';
import { ListTratteComponent } from './pages/admin/tratte/list-tratte.component';
import {TratteService} from "./services/tratte.service";
import { CaricaserviziComponent } from './pages/caricaservizi/caricaservizi.component';
import {NgxSpinnerModule} from "ngx-spinner";
import { TratteDiUnVenditoreComponent } from './pages/admin/tratte/tratte-di-un-venditore/tratte-di-un-venditore.component';
import { ErrorPageComponent } from './pages/error-page/error-page.component';
import { ChatWidgetComponent } from './pages/chat-widget/chat-widget.component';
import { ChatDashboardComponent } from './pages/chat-dashboard/chat-dashboard.component';
import { TerminicondizioniComponent } from './pages/terminicondizioni/terminicondizioni.component';
import { ChisiamoComponent } from './pages/chisiamo/chisiamo.component';
import { CambiaDatiUtenteComponent } from './pages/cambia-dati-utente/cambia-dati-utente.component';
import { OperationErrorComponent } from './pages/operation-error/operation-error.component';
import { ThemeService } from "./services/theme.service";
import { BigliettiChartComponent } from './pages/dashboard/biglietti-chart/biglietti-chart.component';
import { VenditeSingoloVenditoreChartComponent } from './pages/dashboard/vendite-singolo-venditore-chart/vendite-singolo-venditore-chart.component';
import { GuadagniVenditoreChartComponent } from './pages/dashboard/guadagni-venditore-chart/guadagni-venditore-chart.component';
import { CaricaOfferteComponent } from './pages/dashboard/carica-offerte/carica-offerte.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    HomeComponent,
    ContactComponent,
    ImieibigliettiComponent,
    PortafoglioComponent,
    DashBoardComponent,
    MetodiDiPagamentoPieChart,
    VenditeLineChartComponent,
    GuadagniLineChartComponent,
    UtentiComponent,
    ModifyAUserByAdminComponent,
    ModificaUnVenditoreDaAdminComponent,
    AreaPersonaleComponent,
    TracciamentoComponent,
    ListTratteComponent,
    CaricaserviziComponent,
    TratteDiUnVenditoreComponent,
    ErrorPageComponent,
    ChatWidgetComponent,
    ChatDashboardComponent,
    TerminicondizioniComponent,
    ChisiamoComponent,
    CambiaDatiUtenteComponent,
    OperationErrorComponent,
    BigliettiChartComponent,
    VenditeSingoloVenditoreChartComponent,
    GuadagniVenditoreChartComponent,
    CaricaOfferteComponent,
    CheckoutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgChartsModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    NgbAlert,
    NgxSpinnerModule,
    ToastrModule.forRoot({
      preventDuplicates: true
    }),
    NgOptimizedImage
  ],
  providers: [provideAnimations(), provideToastr(), CookieService, TratteService, DatePipe, ThemeService],
  bootstrap: [AppComponent],

})
export class AppModule { }
