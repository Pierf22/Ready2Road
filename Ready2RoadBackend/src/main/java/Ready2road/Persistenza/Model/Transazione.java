package Ready2road.Persistenza.Model;

import Ready2road.Persistenza.Model.MetodiPagamento.MetodoPagamento;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class Transazione {
    private Long id;
    private BigDecimal valore;
    private LocalDateTime dataOra;
    private MetodoPagamento metodoPagamento;
    private Wallet wallet;
    private List<Biglietto> biglietti;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public BigDecimal getValore() {
        return valore;
    }

    public void setValore(BigDecimal valore) {
        this.valore = valore;
    }

    public LocalDateTime getDataOra() {
        return dataOra;
    }

    public void setDataOra(LocalDateTime dataOra) {
        this.dataOra = dataOra;
    }

    public MetodoPagamento getMetodoPagamento() {
        return metodoPagamento;
    }

    public void setMetodoPagamento(MetodoPagamento metodoPagamento) {
        this.metodoPagamento = metodoPagamento;
    }

    public Wallet getWallet() {
        return wallet;
    }

    public void setWallet(Wallet wallet) {
        this.wallet = wallet;
    }

    public List<Biglietto> getBiglietto() {
        return biglietti;
    }

    public void setBiglietto(List<Biglietto> biglietti) {
        this.biglietti = biglietti;
    }


}
