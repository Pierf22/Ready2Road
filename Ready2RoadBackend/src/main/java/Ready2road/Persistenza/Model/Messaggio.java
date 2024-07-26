package Ready2road.Persistenza.Model;

import com.google.gson.JsonObject;

import java.time.LocalDateTime;

public class Messaggio {
    private String testo;
    private String mittente;
    private Long id;
    private LocalDateTime data;
    private Conversazione conversazione;

    public String getTesto() {
        return testo;
    }

    public void setTesto(String testo) {
        this.testo = testo;
    }

    public String getMittente() {
        return mittente;
    }

    public void setMittente(String mittente) {
        this.mittente = mittente;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getData() {
        return data;
    }

    public void setData(LocalDateTime data) {
        this.data = data;
    }

    public Conversazione getConversazione() {
        return conversazione;
    }

    public void setConversazione(Conversazione conversazione) {
        this.conversazione = conversazione;
    }

    public JsonObject toJson() {
        JsonObject jsonObject = new JsonObject();
        jsonObject.addProperty("testo", testo);
        jsonObject.addProperty("mittente", mittente);
        jsonObject.addProperty("id", id);
        jsonObject.addProperty("data", data.toString());
        jsonObject.add("conversazione", conversazione.toJson());
        return jsonObject;

    }
}
