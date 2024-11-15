import { Injectable } from '@angular/core';
import * as Papa from 'papaparse';

@Injectable({
  providedIn: 'root',
})
export class CsvReaderService {
  private datiCsv: any[] = [];

  constructor() {
    // Path fisso del file CSV
    const filePath = './assets/CSV/ElencoComuni.csv';
    this.leggiFileCSV(filePath);
  }

  private leggiFileCSV(filePath: string): void {
    Papa.parse(filePath, {
      download: true,
      complete: (result: any) => {
        this.datiCsv = result.data;
      },
      error: (error: any) => {
        console.error('Errore durante la lettura del file CSV:', error);
      },
    });
  }

  public leggirighe(){
    for(let i=0; i<this.datiCsv.length; i++){
      if(this.datiCsv[i][10] == 'Calabria'){
        console.log(this.datiCsv[i][6]);
      }
    }
  }

  controllaValiditaTappe(tappe: string[], partenza: string, arrivo: string): string {
    // Controllo che la partenza, arrivo e tappe siano presenti nel CSV
    if(!this.datiCsv.find((element: any) => element[6] == partenza)){
      return "partenza";
    }
    if(!this.datiCsv.find((element: any) => element[6] == arrivo)){
      return "arrivo";
    }
    for(let i=0; i<tappe.length; i++){
      if(!this.datiCsv.find((element: any) => element[6] == tappe[i])){
        return "tappa";
      }
    }

    // Controllo che il tragitto sia valido
    // Controlla che se tutte le tappe, siano in Sardegna o fuori dalla Sardegna
    var Sardegna = 0;
    for (let i = 0; i < tappe.length; i++) {
      if (this.datiCsv.find((element: any) => element[6] == tappe[i])[10] == 'Sardegna') {
        Sardegna++;
      }
    }
    if(this.datiCsv.find((element: any) => element[6] == partenza)[10] == 'Sardegna'){
      Sardegna++;
    }
    if(this.datiCsv.find((element: any) => element[6] == arrivo)[10] == 'Sardegna'){
      Sardegna++;
    }
    if(Sardegna == 0 || Sardegna == tappe.length + 2){
      return "OK";
    }
    else{
      return "tragitto";
    }
  }

  controllaValiditaNomi(partenza: string, arrivo: string): string {
    // Controllo che la partenza e arrivo siano presenti nel CSV
    if(!this.datiCsv.find((element: any) => element[6] == partenza)){
      return "partenza";
    }
    if(!this.datiCsv.find((element: any) => element[6] == arrivo)){
      return "arrivo";
    }
    return "OK";
  }
}
