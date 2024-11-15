export class Admin{
    private username: string;
    private cognome: string;
    private nome: string;
    private password: string;

    constructor(json:any) {
        this.username = json.username;
        this.cognome = json.cognome;
        this.nome = json.nome;
        this.password = json.password;
    }
    getUsername= (): string =>{
        return this.username;
    }
    getCognome= (): string =>{
        return this.cognome;
    }
    getNome= (): string =>{
        return this.nome;
    }
    getPassword= (): string =>{
        return this.password;
    }
    setUsername= (username: string): void =>{
        this.username=username;
    }
    setCognome= (cognome: string): void =>{
        this.cognome=cognome;
    }
    setNome= (nome: string): void =>{
        this.nome=nome;
    }
    setPassword= (password: string): void =>{
        this.password=password;
    }

}
