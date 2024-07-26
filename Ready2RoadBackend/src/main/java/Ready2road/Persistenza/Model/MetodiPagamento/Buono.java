package Ready2road.Persistenza.Model.MetodiPagamento;

import Ready2road.Persistenza.Model.MetodiPagamento.MetodoPagamento;

import java.math.BigDecimal;

public class Buono {
    private String codice;
    private MetodoPagamento metodoPagamento;
    private BigDecimal valore;

    public String getCodice() {
        return codice;
    }

    public void setCodice(String codice) {
        this.codice = codice;
    }

    public MetodoPagamento getMetodoPagamento() {
        return metodoPagamento;
    }

    public void setMetodoPagamento(MetodoPagamento metodoPagamento) {
        this.metodoPagamento = metodoPagamento;
    }

    public BigDecimal getValore() {
        return valore;
    }

    public void setValore(BigDecimal valore) {
        this.valore = valore;
    }
}
