export class  Wallet{
    protected id:number;
    protected saldo:number;
    constructor(json:any){
        this.id=json.id;
        this.saldo=json.saldo;
    }
    getId= (): number =>{
        return this.id;
    }
    getSaldo= (): number =>{
        return this.saldo;
    }
    setId= (id:number): void =>{
        this.id=id;
    }
    setSaldo= (saldo:number): void =>{
        this.saldo=saldo;
    }
}
