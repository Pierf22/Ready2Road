package Ready2road.Persistenza.Model;

import Ready2road.Persistenza.DBManager;
import Ready2road.Persistenza.IdBrokers.IdBrokerTratta;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;


public class Tratta {
    private BigDecimal prezzo;
    private Integer sconto;

    public Integer getSconto() {
        return sconto;
    }

    public void setSconto(Integer sconto) {
        this.sconto = sconto;
    }

    public BigDecimal getPrezzo() {
        return prezzo;
    }

    public void setPrezzo(BigDecimal prezzo) {
        this.prezzo = prezzo;
    }

    public  Tratta(JsonObject json) {

        this.tipoMezzo = mezzi.valueOf(json.get("tipo_mezzo").getAsString());
        this.id=IdBrokerTratta.getId(DBManager.getInstance().getConnection(),this.tipoMezzo);
        this.partenza = json.get("partenza").getAsString();
        this.destinazione = json.get("destinazione").getAsString();
        this.dataOra = LocalDateTime.parse(json.get("data_ora").getAsString(),  DateTimeFormatter.ISO_DATE_TIME);
        this.capienza = json.get("capienza").getAsInt();
        this.postiDisponibili = json.get("posti_disponibili").getAsInt();
        this.prezzo=json.get("prezzo").getAsBigDecimal();
        this.sconto=json.get("sconto").getAsInt();
        this.bigliettiScontati=json.get("biglietti_scontati").getAsInt();
    }
    public Tratta (){

    }

    public enum mezzi{
        AEREO,
        BUS,
        TRENO
    }
    private String id;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public mezzi getTipoMezzo() {
        return tipoMezzo;
    }

    public void setTipoMezzo(mezzi tipoMezzo) {
        this.tipoMezzo = tipoMezzo;
    }

    public String getPartenza() {
        return partenza;
    }

    public void setPartenza(String partenza) {
        this.partenza = partenza;
    }

    public String getDestinazione() {
        return destinazione;
    }

    public void setDestinazione(String destinazione) {
        this.destinazione = destinazione;
    }

    public LocalDateTime getDataOra() {
        return dataOra;
    }

    public void setDataOra(LocalDateTime dataOra) {
        this.dataOra = dataOra;
    }



    public Venditore getVenditore() {
        return venditore;
    }

    public void setVenditore(Venditore venditore) {
        this.venditore = venditore;
    }

    public Integer getCapienza() {
        return capienza;
    }

    public void setCapienza(Integer capienza) {
        this.capienza = capienza;
    }

    public Integer getPostiDisponibili() {
        return postiDisponibili;
    }

    public void setPostiDisponibili(Integer postiDisponibili) {
        this.postiDisponibili = postiDisponibili;
    }

    private mezzi tipoMezzo;
    private String partenza, destinazione;
    private LocalDateTime dataOra;
    private Venditore venditore;
    private Integer capienza, postiDisponibili, bigliettiScontati;

    public Integer getBigliettiScontati() {
        return bigliettiScontati;
    }

    public void setBigliettiScontati(Integer bigliettiScontati) {
        this.bigliettiScontati = bigliettiScontati;
    }

    public JsonElement toJson() {
        JsonObject result = new JsonObject();
        result.addProperty("id",getId());
        result.addProperty("partenza",getPartenza());
        result.addProperty("destinazione",getDestinazione());
        result.addProperty("tipo_mezzo", getTipoMezzo().toString());
        result.addProperty("capienza",getCapienza());
        result.addProperty("data_ora", getDataOra().toString());
        result.addProperty("posti_disponibili",getPostiDisponibili());
        result.addProperty("prezzo", getPrezzo());
        result.addProperty("sconto", getSconto());
        result.addProperty("biglietti_scontati", getBigliettiScontati());
        result.add("nome_venditore", this.getVenditore().toJson());
        return result;
    }
}
