package Ready2road.Persistenza.Model.MetodiPagamento;

import Ready2road.Persistenza.Model.Wallet;

public class MetodoPagamento {
    private String nome;
    private Wallet wallet;

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public Wallet getWallet() {
        return wallet;
    }

    public void setWallet(Wallet wallet) {
        this.wallet = wallet;
    }
}
