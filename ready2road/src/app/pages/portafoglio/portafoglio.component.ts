import {Component, OnInit} from '@angular/core';
import {SessionService} from '../../services/session.service';
import {Utente} from "../../model/Utente";
import {Venditore} from "../../model/Venditore";
import {WalletService} from "../../services/wallet.service";
import {NgxSpinnerService} from "ngx-spinner";
import {SaldoChartService} from "../../services/saldo-chart.service";
import Swal from "sweetalert2";
import {Location} from "@angular/common";
import {Browser} from "leaflet";

@Component({
  selector: 'app-portafoglio',
  templateUrl: './portafoglio.component.html',
  styleUrl: './portafoglio.component.css'
})

export class PortafoglioComponent implements OnInit {
  /* VARIABILI */
  public user: any;  //oggetto che contiene i dati dell'utente
  public nome: any;  //nome dell'utente
  public wallet: any;  //oggetto che contiene i dati del wallet
  protected transazioni: any;  //oggetto che contiene le transazioni
  protected dataOraTransazioni: any = [];  //data e ora delle transazioni
  protected valoreTransazioni: any = [];  //tipo delle transazioni
  protected buoni: any;  //oggetto che contiene i buoni
  protected metodiPagamento: any;  //oggetto che contiene i metodi di pagamento
  protected idCard: any = 0;  //id della carta

  /* COSTRUTTORE */
  constructor(private sessionService: SessionService, private walletService: WalletService, private spinner: NgxSpinnerService, private chart: SaldoChartService, private location: Location) {}

  /* INIZIALIZZAZIONE */
  async ngOnInit() {
    this.spinner.show();  //visualizza lo spinner

    // Utilizza l'operatore await per aspettare che l'utente diventi disponibile
    await this.sessionService.waitForUser().then(async () => {
      this.user = this.sessionService.getUser();

      // Utilizza l'operatore await per aspettare che il wallet diventi disponibile
      await this.walletService.getWallet(this.user.indirizzoEmail);
      this.wallet = this.walletService.wallet;

      //se l'utente è un utente prendo il nome, altrimenti prendo il nome della società
      if (this.user instanceof Utente)
        this.nome = this.user.getNome();
      else
        this.nome = this.user.getNomeSocieta();

      // Utilizza l'operatore await per aspettare che le transazioni diventino disponibili
      await this.getTransazioni();  //ottieni le transazioni
      //se ci sono transazioni
      if (this.transazioni != null)
        this.addTransazioni();  //aggiungi le transazioni

      this.chart.createChart(this.valoreTransazioni, this.dataOraTransazioni); //crea il grafico

      // Utilizza l'operatore await per aspettare che i buoni diventino disponibili
      await this.getBuoni();  //ottieni i buoni
      if (this.buoni != null)
        this.addBuoni(); //aggiungi i buoni

      // Utilizza l'operatore await per aspettare che i metodi di pagamento diventino disponibili
      await this.getMetodiPagamento();  //ottieni i metodi di pagamento
    });

    this.spinner.hide(); //rimuove lo spinner
  }

  /* METODO PER GESTIONE GRAFICO E TRANSAZIONI */
  protected async getTransazioni() {
    //questo metodo mi permette di ottenere le transazioni
    await new Promise<void>((resolve) => {
      this.walletService.getTransazioni(this.wallet.id).subscribe((response: any) => {
        this.transazioni = response;
        //se la risposta non è vuota, quindi se ci sono transazioni allora le salvo
        if(response != null && Object.keys(response).length !== 0){
          this.transazioni = response;

          //itero il mio json per ottenere i dati che mi servono
          const key = Object.keys(response);
          let supp = 0, supp2 = 0;
          key.forEach((k) => {
            //prendo solo le ultime 30 transazioni per metterle sul grafico
            if(supp2 < 30){
              //di queste transazioni prendo la data e l'ora della transazione
              this.dataOraTransazioni.push((response[k].data_ora).substring(5, 10));

              //e prendo anche il valore della transazione:
              //se il metodo di pagamento è nullo e ci sono biglietti nell'array, allora è un acquisto tramite saldo
              if(response[k].metodo_pagamento == null && response[k].biglietti.length != 0)
                supp = supp - response[k].valore;
              //se il metodo di pagamento è diverso da nullo e ci sono biglietti nell'array, allora è un acquisto tramite carta di credito o conto bancario
              else if(response[k].metodo_pagamento != null && response[k].biglietti.length != 0)
                supp = supp - response[k].valore;
              //se il metodo di pagamento è diverso da nullo e non ci sono biglietti nell'array e il valore non è negativo allora è una ricarica tramite carta di credito o conto bancario
              else if(response[k].metodo_pagamento != null && response[k].biglietti.length == 0 && response[k].valore.toString().substring(0, 1) != '-')
                supp = supp + response[k].valore;
              //se il metodo di pagamento è null e lo sono anche i biglietti allora è un entrata per un venditore
              else if(this.transazioni[k].metodo_pagamento == null && this.transazioni[k].biglietti.length == 0)
                supp = supp + response[k].valore;
              //se il metodo di pagamento è diverso da nullo e non ci sono biglietti nell'array e il valore è negativo allora è un prelevo del saldo su carta di credito o conto bancario, preleva l'intero saldo
              else if(response[k].metodo_pagamento != null && response[k].biglietti.length == 0 && response[k].valore.toString().substring(0, 1) == '-')
                supp = 0;

              //aggiungo il valore della transazione all'array
              this.valoreTransazioni.push(supp);
              supp2++;
            }
            return;
          });
        }
        else{
          //se non ci sono transazioni allora mostro un messaggio di errore
          const component: any = document.getElementById('erroreMovimenti');
          component.style.display = 'block';
        }

        resolve();
      });
    });
  }
  protected addTransazioni() {
    //questo metodo mi permette di aggiungere le transazioni per la visualizzazione più dettagliata
    const container = document.getElementById('transazioni');
    const key = Object.keys(this.transazioni);
    let n = 1;
    let divVendite: string = '';
    let operazione: string = '';

    //aggiungo al mio componente html le informazioni sulle transazioni: data e ora, tipo di transazione e valore
    key.forEach((k) => {
      //creo il div che conterrà la transazione
      let nuovoDiv = document.createElement('div');

      if(this.transazioni[k].metodo_pagamento == null && this.transazioni[k].biglietti.length != 0){
        operazione = 'Acquisto tramite saldo';
        divVendite = "<div style='color: #c70000; margin-left: auto;'><strong>-" + this.transazioni[k].valore + "€</strong></div>";
      }
      else if(this.transazioni[k].metodo_pagamento != null && this.transazioni[k].biglietti.length != 0){
        if(this.transazioni[k].metodo_pagamento.substring(0, 5) == 'carta')
          operazione = 'Acquisto tramite carta di credito';
        else
          operazione = 'Acquisto tramite conto bancario';
        divVendite = "<div style='color: #c70000; margin-left: auto;'><strong>-" + this.transazioni[k].valore + "€</strong></div>";
      }
      else if(this.transazioni[k].metodo_pagamento != null && this.transazioni[k].biglietti.length == 0 && this.transazioni[k].valore.toString().substring(0, 1) != '-'){
        if(this.transazioni[k].metodo_pagamento.substring(0, 5) == 'carta')
          operazione = 'Ricarica tramite carta di credito';
        else
          operazione = 'Ricarica tramite conto bancario';
        divVendite = "<div style='color: green; margin-left: auto;'><strong>+" + this.transazioni[k].valore + "€</strong></div>";
      }
      else if(this.transazioni[k].metodo_pagamento != null && this.transazioni[k].biglietti.length == 0 && this.transazioni[k].valore.toString().substring(0, 1) == '-'){
        if(this.transazioni[k].metodo_pagamento.substring(0, 5) == 'carta')
          operazione = 'Prelevo del saldo su carta di credito';
        else
          operazione = 'Prelevo del saldo su conto bancario';
        divVendite = "<div style='color: #c70000; margin-left: auto;'><strong>" + this.transazioni[k].valore + "€</strong></div>";
      }
      else if(this.transazioni[k].metodo_pagamento == null && this.transazioni[k].biglietti.length == 0){
        operazione = "Entrata relativa ad acquisto di biglietti";
        divVendite = "<div style='color: green; margin-left: auto;'><strong>+" + this.transazioni[k].valore + "€</strong></div>";
      }

      //aggiungo il mio nuovo componente al codice html per la visualizzazione
      nuovoDiv.innerHTML = '<div style="background-color: var(--component-color); color: var(--text-color); padding: 10px; border-radius: 10px; margin-top: 10px;"><div style="display: flex;"><div><div>Transazione n°' + n + ' - ' + operazione + '</div><div class="data-ora">' + this.transazioni[k].data_ora + '</div></div>' + divVendite + '</div></div>';
      container?.appendChild(nuovoDiv);
      n++;
    });
  }

  /* METODI PER GESTIONE BUONI */
  protected async getBuoni() {
    //questo metodo mi permette di ottenere i buoni
    await new Promise<void>((resolve) => {
      this.walletService.getBuoni(this.wallet.id).subscribe((response: any) => {
        //se la risposta non è vuota, quindi se ci sono buoni allora li salvo
        if(response != null && Object.keys(response).length !== 0){
          this.buoni = response;
        }
        else{
          //se non ci sono buoni allora mostro un messaggio di errore
          const component: any = document.getElementById('erroreBuoni');
          component.style.display = 'block';
        }

        resolve();
      });
    });
  }
  protected addBuoni() {
    //questo metodo mi permette di aggiungere i buoni per la visualizzazione al mio html
    const pathBackground = 'assets/walletImage/giftCard.png';  //path delle immagini dei buoni
    const container = document.getElementById('buoni'); //ottengo il div che conterrà i buoni
    const key = Object.keys(this.buoni);  //ottengo le chiavi del json

    key.forEach((k) => {
      let nuovoDiv = document.createElement('div');  //creo il div che conterrà il buono
      nuovoDiv.style.backgroundImage = "url(" + pathBackground + ")";  //imposto l'immagine di sfondo
      nuovoDiv.style.backgroundSize = '100% auto';  //imposto la dimensione dell'immagine di sfondo
      nuovoDiv.style.backgroundRepeat = 'no-repeat';  //imposto la ripetizione dell'immagine di sfondo
      nuovoDiv.style.backgroundPosition = 'center';  //imposto la posizione dell'immagine di sfondo
      nuovoDiv.style.width = '100%';  //imposto la larghezza del div
      nuovoDiv.style.marginTop = '10px';  //imposto il margine superiore del div
      nuovoDiv.style.position = 'relative';  //imposto la posizione del div
      nuovoDiv.style.maxHeight = '300px';  //imposto l'altezza del div
      nuovoDiv.style.minHeight = '90px';  //imposto l'altezza minima del div
      nuovoDiv.style.paddingTop = '37.4%';  //imposto il padding top del div (img-height / img-width * container-width)

      if(window.innerWidth > 361)
        nuovoDiv.innerHTML = "<div style='margin-left: 5%; position: absolute; bottom: 0; height: 60px; color :white;'><p style='text-shadow: 0 0 10px rgba(0, 0, 0, 0.5); font-size: 1.2em;'>Codice: " + this.buoni[k].codice + "<br>Valore: " + this.buoni[k].valore + " €</p></div>";  //scrivo il codice html del div
      else
        nuovoDiv.innerHTML = "<div style='margin-left: 5%; position: absolute; bottom: 0; height: 40px; color: white;'><p style='text-shadow: 0 0 10px rgba(0, 0, 0, 0.5); font-size: 0.7em;'>Codice: " + this.buoni[k].codice + "<br>Valore: " + this.buoni[k].valore + " €</p></div>";  //scrivo il codice html del div

      container?.appendChild(nuovoDiv);  //aggiungo il div al container
    });
  }

  /* METODI PER GESTIONE METODI DI PAGAMENTO */
  protected async getMetodiPagamento() {
    //questo metodo mi permette di ottenere i metodi di pagamento
    await new Promise<void>((resolve) => {
      //se la risposta non è vuota, quindi se ci sono metodi di pagamento allora li salvo
      this.walletService.getMetodiPagamento(this.wallet.id).subscribe((response: any) => {
        if(response != null && Object.keys(response).length !== 0){
          this.metodiPagamento = response;

          const tipoCarta: any = document.getElementById('tipoCarta');
          const nomeCarta: any = document.getElementById('nomeCarta');
          const numeroCarta: any = document.getElementById('numeroCarta');
          const scadenzaCarta: any = document.getElementById('scadenzaCarta');
          const cvvCarta: any = document.getElementById('cvvCarta');
          const key = Object.keys(this.metodiPagamento);

          //se ci sono metodi di pagamento allora mostro il primo, se è una carta di credito mostro i dati della carta di credito, altrimenti mostro i dati del conto bancario
          if(key[0].substring(0, 5) == 'carta'){
            tipoCarta.innerText = 'Carta di Credito';
            nomeCarta.innerHTML = 'Nome: <strong>' + this.user.nome + ' ' + this.user.cognome + '</strong>';
            numeroCarta.innerHTML = 'Numero Carta: <strong>' + this.metodiPagamento[key[0]].numero + '</strong>';
            scadenzaCarta.innerHTML = 'Scadenza: <strong>' + this.metodiPagamento[key[0]].scadenza + '</strong>';
            cvvCarta.innerHTML = 'CVV: <strong>' + this.metodiPagamento[key[0]].cvc + '</strong>';
          }
          else{
            tipoCarta.innerText = 'Conto Bancario';
            nomeCarta.innerHTML = 'Nome: <strong>' + this.user.nome + ' ' + this.user.cognome + '</strong>';
            numeroCarta.innerHTML = 'Banca: <strong>' + this.metodiPagamento[key[0]].banca + '</strong>';
            scadenzaCarta.innerHTML = 'IBAN: <strong>' + this.metodiPagamento[key[0]].iban + '</strong>';
            cvvCarta.innerHTML = '';
          }
        }
        else{
          //se non ci sono metodi di pagamento allora mostro un messaggio di errore
          const component: any = document.getElementById('creditCard');
          component.style.display = 'none';
          const component3: any = document.getElementById('btnRimuovi');
          component3.style.display = 'none';
          const component4: any = document.getElementById('btnCambia');
          component4.style.display = 'none';
          const component5: any = document.getElementById('erroreMetodiPagamento');
          component5.style.display = 'block';
          const component6: any = document.getElementById("addMoney");
          component6.style.display = 'none'
          const component7: any = document.getElementById("removeMoney");
          component7.style.display = 'none';
        }

        resolve();
      });
    });
  }

  /* METODI PER GESTIONE PULSANTI */
  protected changeCard() {
    //ottengo gli elementi
    const tipoCarta: any = document.getElementById('tipoCarta');
    const nomeCarta: any = document.getElementById('nomeCarta');
    const numeroCarta: any = document.getElementById('numeroCarta');
    const scadenzaCarta: any = document.getElementById('scadenzaCarta');
    const cvvCarta: any = document.getElementById('cvvCarta');
    //ottengo le chiavi del json
    const key = Object.keys(this.metodiPagamento);
    this.idCard =(this.idCard + 1) % (key.length);  //cambio la carta

    //se l'elemento successivo è una carta di credito mostro i dati della carta di credito, altrimenti mostro i dati del conto bancario
    if(key[this.idCard].substring(0, 5) == 'carta'){
      tipoCarta.innerText = 'Carta di Credito';
      nomeCarta.innerHTML = 'Nome: <strong>' + this.user.nome + ' ' + this.user.cognome + '</strong>';
      numeroCarta.innerHTML = 'Numero Carta: <strong>' + this.metodiPagamento[key[this.idCard]].numero + '</strong>';
      scadenzaCarta.innerHTML = 'Scadenza: <strong>' + this.metodiPagamento[key[this.idCard]].scadenza + '</strong>';
      cvvCarta.innerHTML = 'CVV: <strong>' + this.metodiPagamento[key[this.idCard]].cvc + '</strong>';
    }
    else{
      tipoCarta.innerText = 'Conto Bancario';
      nomeCarta.innerHTML = 'Nome: <strong>' + this.user.nome + ' ' + this.user.cognome + '</strong>';
      numeroCarta.innerHTML = 'Banca: <strong>' + this.metodiPagamento[key[this.idCard]].banca + '</strong>';
      scadenzaCarta.innerHTML = 'IBAN: <strong>' + this.metodiPagamento[key[this.idCard]].iban + '</strong>';
      cvvCarta.innerHTML = '';
    }

  } //cambia la carta
  protected deleteCard() {
    //mostro un messaggio di conferma per l'eliminazione della carta
    Swal.fire({
      html: "Eliminando il metodo di pagamento selezionato verranno eliminate anche tutte le transazioni collegate!<br><br>Sei sicuro di voler continuare?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
      confirmButtonColor: 'var(--primary-color)',
      cancelButtonColor: 'var(--primary-color)',
      background: '#4d4d4d',
      color: 'white',
    }).then(async (result) => {
      //se l'utente conferma l'eliminazione allora elimino la carta
      if (result.isConfirmed) {
        await new Promise<void>((resolve) => {
          this.walletService.deleteMetodoPagamento(this.metodiPagamento[Object.keys(this.metodiPagamento)[this.idCard]].nome).subscribe((response: any) => {
            resolve();
          });
        });

        this.location.replaceState('/portafoglio');
        window.location.reload();
      }
    });
  } //elimina la carta
  protected addCard() {
    //questa funzione mi permette di aggiungere una carta di credito o un conto bancario
    let htmlContent: any;
    htmlContent = `<div style="text-align: left;">Scegli il tipo di metodo di pagamento da aggiungere: <br>`;
    htmlContent += `<label><input type="radio" name="addCart" id="carta" value="carta"> Carta di Credito</label><br>`;
    htmlContent += `<label><input type="radio" name="addCart" id="conto" value="conto"> Conto Bancario</label><br>`;

    //mostro un pop up per la scelta del metodo di pagamento
    Swal.fire({
      html: htmlContent,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Continua',
      cancelButtonText: 'Annulla',
      confirmButtonColor: 'var(--primary-color)',
      cancelButtonColor: 'var(--primary-color)',
      background: '#4d4d4d',
      color: 'white',
    }).then(async (result) => {
      //se l'utente conferma la scelta allora procedo con l'aggiunta della carta
      if (result.isConfirmed) {
        const selectedRadio = document.querySelector('input[name="addCart"]:checked');
        //continuo solo se è stato selezionato un metodo di pagamento
        if (selectedRadio) {
          const selectedIndex = Array.from(document.querySelectorAll('input[name="addCart"]')).indexOf(selectedRadio);
          //se è stata selezionata una carta di credito mostro i dati della carta di credito, altrimenti mostro i dati del conto bancario
          if(selectedIndex == 0){
            htmlContent = `<div style="text-align: left;">Inserisci i dati della carta di credito: <br><br>`;
            htmlContent += `<div style="padding: 5px;"><label>Numero Carta: </label><input type="text" id="numeroCarta" class="input-group-text" style="width: 100%; text-align: left; background-color: var(--accent-color); color: white;"><br>`;
            htmlContent += `<label>Scadenza: </label><input type="date" id="scadenzaCarta" class="input-group-text" style="width: 100%; text-align: left; background-color: var(--accent-color); color: white;"><br>`;
            htmlContent += `<label>CVV: </label><input type="text" id="cvvCarta" class="input-group-text" style="width: 100%; text-align: left; background-color: var(--accent-color); color: white;"><br></div>`;
            htmlContent += `Procedendo verrà aggiunta una nuova carta di credito al tuo portafoglio!<br>Sei sicuro di voler procedere?</div>`;

            //mostro un pop up per far inserire i dati della carta di credito
            Swal.fire({
              html: htmlContent,
              icon: 'warning',
              showCancelButton: true,
              confirmButtonText: 'Si',
              cancelButtonText: 'No',
              confirmButtonColor: 'var(--primary-color)',
              cancelButtonColor: 'var(--primary-color)',
              background: '#4d4d4d',
              color: 'white',
            }).then(async (result) => {
              //se l'utente conferma l'inserimento allora procedo con l'aggiunta della carta
              if(result.isConfirmed){
                const numeroCartaInput = (<HTMLInputElement>document.querySelector('input[id="numeroCarta"]'));
                const scadenzaCartaInput = (<HTMLInputElement>document.querySelector('input[id="scadenzaCarta"]'));
                const cvvCartaInput = (<HTMLInputElement>document.querySelector('input[id="cvvCarta"]'));
                var regex = /^[0-9]{16}$/;
                var regex2 = /^[0-9]{3}$/;

                //continuo solo se i dati della carta sono stati inseriti correttamente
                if (regex.test(numeroCartaInput.value) && scadenzaCartaInput.value != '' && regex2.test(cvvCartaInput.value)) {
                  await new Promise<void>((resolve) => {
                    this.walletService.addMetodoPagamento(this.wallet.id, "carta",  numeroCartaInput.value, cvvCartaInput.value, scadenzaCartaInput.value).subscribe((response: any) => {
                      resolve();
                    });
                  });

                  //aggiorno la pagina
                  this.location.replaceState('/portafoglio');
                  window.location.reload();
                } else {
                  //mostro un messaggio di errore se i dati della carta non sono stati inseriti correttamente
                  Swal.fire({
                    icon: 'error',
                    title: 'Errore',
                    text: 'Devi inserire i dati della carta correttamente!',
                    confirmButtonColor: 'var(--primary-color)',
                    background: '#4d4d4d',
                    color: 'white',
                  });
                }
              }
            });
          }
          else{
            htmlContent = `<div style="text-align: left;">Inserisci i dati del conto bancario: <br><br>`;
            htmlContent += `<div style="padding: 5px;"><label>Iban: </label><input type="text" id="ibanConto" class="input-group-text" style="width: 100%; text-align: left; background-color: var(--accent-color); color: white;"><br>`;
            htmlContent += `<label>Nome Banca: </label><input type="text" id="nomeBanca" class="input-group-text" style="width: 100%; text-align: left; background-color: var(--accent-color); color: white;"><br></div>`;
            htmlContent += `Procedendo verrà aggiunto un nuovo conto corrente al tuo portafoglio!<br>Sei sicuro di voler procedere?</div>`;

            //mostro un pop up per far inserire i dati del conto bancario
            Swal.fire({
              html: htmlContent,
              icon: 'warning',
              showCancelButton: true,
              confirmButtonText: 'Si',
              cancelButtonText: 'No',
              confirmButtonColor: 'var(--primary-color)',
              cancelButtonColor: 'var(--primary-color)',
              background: '#4d4d4d',
              color: 'white',
            }).then(async (result) => {
              //se l'utente conferma l'inserimento allora procedo con l'aggiunta del conto
              if(result.isConfirmed){
                const ibanContoInput = (<HTMLInputElement>document.querySelector('input[id="ibanConto"]'));
                const nomeBancaInput = (<HTMLInputElement>document.querySelector('input[id="nomeBanca"]'));
                var regex = /^[0-9]{16}$/;

                //continuo solo se i dati del conto sono stati inseriti correttamente
                if (regex.test(ibanContoInput.value) && nomeBancaInput.value != '') {
                  await new Promise<void>((resolve) => {
                    this.walletService.addMetodoPagamento(this.wallet.id, "conto",  ibanContoInput.value, nomeBancaInput.value, '').subscribe((response: any) => {
                      resolve();
                    });
                  });

                  this.location.replaceState('/portafoglio');
                  window.location.reload();
                } else {
                  //mostro un messaggio di errore se i dati del conto non sono stati inseriti correttamente
                  Swal.fire({
                    icon: 'error',
                    title: 'Errore',
                    text: 'Devi inserire i dati del conto correttamente!',
                    confirmButtonColor: 'var(--primary-color)',
                    background: '#4d4d4d',
                    color: 'white',
                  });
                }
              }
            });
          }
        }
        else{
          //mostro un messaggio di errore se non è stato selezionato un metodo di pagamento
          Swal.fire({
            icon: 'error',
            title: 'Errore',
            text: 'Devi selezionare un metodo di pagamento!',
            confirmButtonColor: 'var(--primary-color)',
            background: '#4d4d4d',
            color: 'white',
          });
        }
      }
    });
  } //aggiungi la carta
  protected addMoney() {
    const key = Object.keys(this.metodiPagamento);  //ottengo le chiavi del json

    // Creazione del contenuto per il popup, mostro i metodi di pagamento salvati e chiedo l'importo da depositare
    let htmlContent = `<div style="text-align: left;">Scegli il metodo di pagamento da cui prelevare: <br>`;
    for (let i = 0; i < key.length; i++) {
      if (key[i].substring(0, 5) === 'carta') {
        htmlContent += `<label><input type="radio" name="paymentMethod" id="carta${i}"> Carta ${this.metodiPagamento[key[i]].numero}</label><br>`;
      } else {
        htmlContent += `<label><input type="radio" name="paymentMethod" id="conto${i}"> Conto ${this.metodiPagamento[key[i]].iban}</label><br>`;
      }
    }
    //costruisco il contenuto del popup
    htmlContent += `<br><div style="padding: 5px;"><label>Inserisci la somma da depositare: </label><input type="text" id="depositAmount" class="input-group-text" style="width: 100%; margin-top: 5px; text-align: left; background-color: var(--accent-color); color: white;"></div>`;
    htmlContent += `<br>Procedendo verrà detratto il saldo inserito dal metodo di pagamento selezionato e verrà caricato sul tuo portafoglio!<br><br>Sei sicuro di voler procedere?</div>`;

    // Mostro il popup
    Swal.fire({
      html: htmlContent,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
      confirmButtonColor: 'var(--primary-color)',
      cancelButtonColor: 'var(--primary-color)',
      background: '#4d4d4d',
      color: 'white',
    }).then(async (result) => {
      // Se l'utente conferma il deposito, procedo con l'operazione
      if (result.isConfirmed) {
        const selectedRadio = document.querySelector('input[name="paymentMethod"]:checked');
        const depositAmountInput = document.getElementById('depositAmount') as HTMLInputElement;
        const depositAmount = depositAmountInput ? depositAmountInput.value : '';
        var regex = /^(0|[1-9]\d*)(\.\d+)?$/;

        // Verifica se almeno un input radio è selezionato e se l'importo è valido
        if (selectedRadio && regex.test(depositAmount)) {
          const selectedIndex = Array.from(document.querySelectorAll('input[name="paymentMethod"]')).indexOf(selectedRadio);

          // eseguo il deposito della somma solo se un metodo di pagamento è stato selezionato
          await new Promise<void>((resolve) => {
            this.walletService.deposito(this.wallet.id, depositAmount, this.metodiPagamento[key[selectedIndex]].nome, this.wallet.saldo).subscribe((response: any) => {
              resolve();
            });
          });

          // Aggiorno la pagina
          this.location.replaceState('/portafoglio');
          window.location.reload();
        } else {
          // Mostra un messaggio di errore se nessun metodo di pagamento è stato selezionato o se l'importo non è valido
          Swal.fire({
            icon: 'error',
            title: 'Errore',
            text: 'Devi selezionare un metodo di pagamento e/o inserire un importo valido!',
            confirmButtonColor: 'var(--primary-color)',
            background: '#4d4d4d',
            color: 'white',
          });
        }
      }
    });
  } //aggiungi denaro
  protected withdrawMoney() {
    // Ottengo le chiavi del json
    const key = Object.keys(this.metodiPagamento);

    // Creazione del contenuto per il popup
    let htmlContent = `<div style="text-align: left;">Scegli il metodo di pagamento su cui depositare: <br>`;
    for (let i = 0; i < key.length; i++) {
      if (key[i].substring(0, 5) === 'carta') {
        htmlContent += `<label><input type="radio" name="paymentMethod" id="carta${i}"> Carta ${this.metodiPagamento[key[i]].numero}</label><br>`;
      } else {
        htmlContent += `<label><input type="radio" name="paymentMethod" id="conto${i}"> Conto ${this.metodiPagamento[key[i]].iban}</label><br>`;
      }
    }
    //costruisco il contenuto del popup
    htmlContent += `<br>Procedendo tutto il tuo saldo verrà prelevato e depositato sul metodo di pagamento selezionato!<br><br>Sei sicuro di voler procedere?</div>`;

    // Mostro il popup
    Swal.fire({
      html: htmlContent,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
      confirmButtonColor: 'var(--primary-color)',
      cancelButtonColor: 'var(--primary-color)',
      background: '#4d4d4d',
      color: 'white',
    }).then(async (result) => {
      // Se l'utente conferma il prelievo, procedo con l'operazione
      if (result.isConfirmed) {
        // Verifica se almeno un input radio è selezionato
        const selectedRadio = document.querySelector('input[name="paymentMethod"]:checked');

        //procedo solo se un metodo di pagamento è stato selezionato
        if (selectedRadio) {
          const selectedIndex = Array.from(document.querySelectorAll('input[name="paymentMethod"]')).indexOf(selectedRadio);

          // Esegue l'invio solo se un metodo di pagamento è stato selezionato
          await new Promise<void>((resolve) => {
            this.walletService.prelevo(this.wallet.id, -this.wallet.saldo, this.metodiPagamento[key[selectedIndex]].nome).subscribe((response: any) => {
              resolve();
            });
          });

          this.location.replaceState('/portafoglio');
          window.location.reload();
        } else {
          // Mostra un messaggio di errore se nessun metodo di pagamento è stato selezionato
          Swal.fire({
            icon: 'error',
            title: 'Errore',
            text: 'Devi selezionare un metodo di pagamento!',
            confirmButtonColor: 'var(--primary-color)',
            background: '#4d4d4d',
            color: 'white',
          });
        }
      }
    });
  } //preleva denaro

  /* OTTENGO IL TIPO */
  seUtente() {
    return this.user instanceof Utente;
  }
  seVenditore() {
    return this.user instanceof Venditore;
  }
}
