package Ready2road.Persistenza.Model.MetodiPagamento;

import Ready2road.Persistenza.Model.MetodiPagamento.MetodoPagamento;

import java.util.Date;

public class CartaPagamento {
    private String numero,  cvc;
    private MetodoPagamento metodoPagamento;

    public MetodoPagamento getMetodoPagamento() {
        return metodoPagamento;
    }

    public void setMetodoPagamento(MetodoPagamento metodoPagamento) {
        this.metodoPagamento = metodoPagamento;
    }

    public String getNumero() {
        return numero;
    }

    public void setNumero(String numero) {
        this.numero = numero;
    }



    public String getCvc() {
        return cvc;
    }

    public void setCvc(String cvc) {
        this.cvc = cvc;
    }

    public Date getDataScadenza() {
        return dataScadenza;
    }

    public void setDataScadenza(Date dataScadenza) {
        this.dataScadenza = dataScadenza;
    }

    private Date dataScadenza;
}
