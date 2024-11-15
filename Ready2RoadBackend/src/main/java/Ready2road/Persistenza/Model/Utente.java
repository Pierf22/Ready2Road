package Ready2road.Persistenza.Model;

import com.google.gson.JsonObject;

import java.util.Date;

public class Utente {

    private String indirizzoEmail, cognome, nome, password, numeroTelefono;
    private Boolean ban;

    public Boolean isBan() {
        return ban;
    }

    public void setBan(Boolean ban) {
        this.ban = ban;
    }

    private Date dataNascita;
    private Wallet wallet;

    public String getIndirizzoEmail() {
        return indirizzoEmail;
    }

    public void setIndirizzoEmail(String indirizzoEmail) {
        this.indirizzoEmail = indirizzoEmail;
    }

    public String getCognome() {
        return cognome;
    }

    public void setCognome(String cognome) {
        this.cognome = cognome;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getNumeroTelefono() {
        return numeroTelefono;
    }

    public void setNumeroTelefono(String numeroTelefono) {
        this.numeroTelefono = numeroTelefono;
    }

    public Date getDataNascita() {
        return dataNascita;
    }

    public void setDataNascita(Date dataNascita) {
        this.dataNascita = dataNascita;
    }

    public Wallet getWallet() {
        return wallet;
    }

    public void setWallet(Wallet wallet) {
        this.wallet = wallet;
    }


    public JsonObject toJson() {
        JsonObject jsonObject=new JsonObject();
        jsonObject.addProperty("nome",this.getNome());
        jsonObject.addProperty("cognome",this.getCognome());
        jsonObject.addProperty("numeroTelefono",this.getNumeroTelefono());
        jsonObject.addProperty("dataNascita",this.getDataNascita().toString());
        jsonObject.addProperty("password",this.getPassword());
        jsonObject.addProperty("indirizzoEmail",this.getIndirizzoEmail());
        jsonObject.addProperty("ban",this.isBan());
        jsonObject.add("wallet", this.getWallet().toJson());
        return jsonObject;
    }
}

