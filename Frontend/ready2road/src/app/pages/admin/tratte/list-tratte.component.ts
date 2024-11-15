import {Component, inject, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from "@angular/forms";
import {TratteService} from "../../../services/tratte.service";
import {NgxSpinnerService} from "ngx-spinner";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {TratteDiUnVenditoreComponent} from "./tratte-di-un-venditore/tratte-di-un-venditore.component";
import {SessionService} from "../../../services/session.service";
import {Admin} from "../../../model/Admin";
import {Router} from "@angular/router";
import {Venditore} from "../../../model/Venditore";
@Component({
  selector: 'app-tratte',
  templateUrl: './list-tratte.component.html',
  styleUrl: './list-tratte.component.css'
})
export class ListTratteComponent implements OnInit{
  partDest:Map<string,string[]>=new Map<string,string[]>();
  private modalService=inject(NgbModal);
  partenze:string[]=[];
    arrivi:string[]=[];
    venditori:string[][]=[];
  service:TratteService=inject(TratteService);
  searchForm=new FormGroup({ //form di ricerca
    partenza: new FormControl('', Validators.required),
    arrivo: new FormControl('', Validators.required),
    nomeSocieta: new FormControl('', Validators.required),
  })
  showOptions: boolean[]=[];
  constructor(private router:Router, private sessionService:SessionService, private spinner: NgxSpinnerService) {
  }
ngOnInit(): void {
    this.sessionService.waitForUser().then(()=>{
      if(!(this.sessionService.getUser() instanceof Admin)) {
        this.router.navigate(['/home']);
        return;
      }
      this.spinner.show().then();
      this.service.getPartenzeDestinazioni().subscribe((data)=>{

        this.partDest=data;
        Object.keys(this.partDest).forEach((key) => {
          // Dividi la chiave in partenza e destinazione
          const [partenza, destinazione] = key.split('-');

          // Aggiungi partenza e destinazione agli array corrispondenti
          this.partenze.push(partenza);
          this.arrivi.push(destinazione);

          // Aggiungi i venditori corrispondenti all'array venditori
          // @ts-ignore
          this.venditori.push(this.partDest[key]);

        });
        this.spinner.hide().then();
        this.showOptions=new Array(this.partenze.length).fill(false);

      });
      this.searchForm.valueChanges.subscribe(() => {
        this.aggiornaLista();
      });
    });
}
  aggiornaLista() {
    //filtro secondo i dati inseriti nel form
    const filteredPartDest = new Map<string, string>();
    for(const [key, value] of Object.entries(this.partDest)){
      // @ts-ignore
      if(this.partDest[key].some(v => v.startsWith(this.getNomeSocieta()?.value)) || this.getNomeSocieta()?.value==''){
      let value=key.split('-');
      if(value[0].startsWith(this.primaLetteraMaiuscola(this.getPartenza()?.value)) && value[1].startsWith(this.primaLetteraMaiuscola(this.getArrivo()?.value))){
        filteredPartDest.set(value[0], value[1]);
      }}
    }
    console.log(filteredPartDest);

    // Update partenze and arrivi arrays
    this.partenze = Array.from(filteredPartDest.keys());
    this.arrivi = Array.from(filteredPartDest.values());
    this.showOptions=new Array(this.partenze.length).fill(false);
  }
  getPartenza():AbstractControl | null{
    return this.searchForm.get('partenza');
  }
  getArrivo():AbstractControl | null{
    return this.searchForm.get('arrivo');
  }
    getNomeSocieta():AbstractControl | null{
        return this.searchForm.get('nomeSocieta');
    }
  private primaLetteraMaiuscola(value: any) {
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  }
  visualizzaVenditori(partenza: string, destinazione: string, i: number) {
    this.showOptions[i]=!this.showOptions[i];




  }

  accediAlleTratte(venditore: string, partenza: string, arrivo: string) {
    const modalRef=this.modalService.open(TratteDiUnVenditoreComponent, {size: 'xl'});
    modalRef.componentInstance.partenza=partenza;
    modalRef.componentInstance.arrivo=arrivo;
    modalRef.componentInstance.nomeSocieta=venditore;
    modalRef.dismissed.subscribe(value => {
      if(value)
        window.location.reload()

    });

  }
}

