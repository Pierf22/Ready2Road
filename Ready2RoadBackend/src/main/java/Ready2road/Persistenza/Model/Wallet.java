package Ready2road.Persistenza.Model;

import com.google.gson.JsonObject;

import java.math.BigDecimal;

public class Wallet {
    private Long id;
    private BigDecimal saldo;
    private BigDecimal puntiAcquisto;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public BigDecimal getSaldo() {
        return saldo;
    }

    public BigDecimal getPunti(){
        return puntiAcquisto;
    }

    public void setSaldo(BigDecimal saldo) {
        this.saldo = saldo;
    }

    public void setPuntiAcquisto(BigDecimal punti){
        this.puntiAcquisto = punti;
    }

    public JsonObject toJson(){
        JsonObject jsonObject=new JsonObject();
        jsonObject.addProperty("id",this.getId());
        jsonObject.addProperty("saldo",this.getSaldo());
        jsonObject.addProperty("puntiAcquisto", this.puntiAcquisto);
        return jsonObject;
    }
}
