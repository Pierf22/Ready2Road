import { Injectable } from '@angular/core';
import {Wallet} from "../model/Wallet";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  wallet: Wallet | undefined;

  constructor(private httClient: HttpClient) {}

  //metodo per aspettare finchè il wallet non è disponibile
  getWallet(email: any): Promise<void> {
    const link = 'http://localhost:8080/wallet/getWallet/' + email;

    const response = this.httClient.get<any>(link, { responseType: 'json' });
    response.subscribe((responseData) => {
      this.wallet = responseData;
    });

    // Utilizza una promessa per aspettare che il wallet diventi disponibile
    return new Promise<void>((resolve) => {
      const checkWallet = (): void => {
        const wallet = this.wallet;
        if (wallet !== undefined) {
          // Il wallet è disponibile, risolvi la promessa
          resolve();
        } else {
          // Il wallet non è ancora disponibile, controlla di nuovo dopo un breve intervallo di tempo
          setTimeout(checkWallet, 100);
        }
      };

      // Inizia a controllare il wallet
      checkWallet();
    });
  }

  //metodo per ottenere le transazioni
  getTransazioni(id: any): any {
    const link = 'http://localhost:8080/wallet/getTransazioni/' + id;

    return this.httClient.get<any>(link, { responseType: 'json' });
  }

  //metodo per ottenere i buoni
  getBuoni(id: any): any {
    const link = 'http://localhost:8080/wallet/getBuoni/' + id;

    return this.httClient.get<any>(link, { responseType: 'json' });
  }

  //metodo per ottenere i metodi di pagamento
  getMetodiPagamento(id: any): any {
    const link = 'http://localhost:8080/wallet/getMetodiPagamento/' + id;

    return this.httClient.get<any>(link, { responseType: 'json' });
  }

  //metodo per prelevare
  prelevo(id: any, valore: any, metodoPagamento: any): any {
    const link = 'http://localhost:8080/wallet/prelevo/' + id + '/' + valore + '/' + metodoPagamento;

    return this.httClient.get<any>(link, { responseType: 'json' });
  }

  //metodo per depositare
  deposito(id: any, valore: any, metodoPagamento: any, saldo: any): any {
    const link = 'http://localhost:8080/wallet/deposito/' + id + '/' + valore + '/' + metodoPagamento + '/' + saldo;

    return this.httClient.get<any>(link, { responseType: 'json' });
  }

  //metodo per eliminare un metodo di pagamento
  deleteMetodoPagamento(nome: any): any {
    const link = 'http://localhost:8080/wallet/remove/' + nome;

    return this.httClient.get<any>(link, { responseType: 'json' });
  }

  //metodo per aggiungere un metodo di pagamento
  addMetodoPagamento(id: any, nome: any, numero: any, cvv: any, scadenza: any): any {
    if(scadenza == "")
      scadenza = null;

    const link = 'http://localhost:8080/wallet/add/' + id + '/' + nome + '/' + numero + '/' + scadenza + '/' + cvv;

    return this.httClient.get<any>(link, { responseType: 'json' });
  }

}
