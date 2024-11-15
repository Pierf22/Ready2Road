package Ready2road.Persistenza.Model;

import com.google.gson.JsonObject;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Date;

public class Biglietto {
    private Integer posto;
    private String numero, cf, nome, cognome;

    public String getCf() {
        return cf;
    }

    public void setCf(String cf) {
        this.cf = cf;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getCognome() {
        return cognome;
    }

    public void setCognome(String cognome) {
        this.cognome = cognome;
    }

    private Tratta tratta;

    private LocalDateTime dataAcquisto, scadenza;
    private Utente utente;

    public String getNumero() {
        return numero;
    }

    public void setNumero(String numero) {
        this.numero = numero;
    }



    public Integer getPosto() {
        return posto;
    }

    public void setPosto(Integer posto) {
        this.posto = posto;
    }

    public Tratta getTratta() {
        return tratta;
    }

    public void setTratta(Tratta tratta) {
        this.tratta = tratta;
    }





    public LocalDateTime getDataAcquisto() {
        return dataAcquisto;
    }

    public void setDataAcquisto(LocalDateTime dataAcquisto) {
        this.dataAcquisto = dataAcquisto;
    }

    public LocalDateTime getScadenza() {
        return scadenza;
    }

    public void setScadenza(LocalDateTime scadenza) {
        this.scadenza = scadenza;
    }

    public Utente getUtente() {
        return utente;
    }

    public void setUtente(Utente utente) {
        this.utente = utente;
    }
    public JsonObject toJson(){
        JsonObject json = new JsonObject();
        json.addProperty("numero", getNumero());
        json.addProperty("posto", getPosto());
        json.addProperty("cf", getCf());
        json.addProperty("nome", getNome());
        json.addProperty("cognome", getCognome());
        json.addProperty("data_ora_acquisto", getDataAcquisto().toString());
        json.addProperty("scadenza", getScadenza().toString());

        json.add("tratta", this.tratta.toJson());
        json.add("utente", this.utente.toJson());
        return json;
    }
}
