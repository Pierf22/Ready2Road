package Ready2road.Persistenza.Model;

import com.google.gson.JsonObject;

public class Venditore {
    public String getNomeSocieta() {
        return nomeSocieta;
    }

    public void setNomeSocieta(String nomeSocieta) {
        this.nomeSocieta = nomeSocieta;
    }

    public String getPassword() {
        return password;
    }


    public void setPassword(String password) {
        this.password = password;
    }

    public String getIndirizzoEmail() {
        return indirizzoEmail;
    }

    public void setIndirizzoEmail(String indirizzoEmail) {
        this.indirizzoEmail = indirizzoEmail;
    }

    public Wallet getWallet() {
        return wallet;
    }

    public void setWallet(Wallet wallet) {
        this.wallet = wallet;
    }

    private String nomeSocieta, password, indirizzoEmail;
    private Boolean ban;

    public Boolean isBan() {
        return ban;
    }

    public void setBan(Boolean ban) {
        this.ban = ban;
    }

    private Wallet wallet;

    public JsonObject toJson() {
        JsonObject jsonObject=new JsonObject();
        jsonObject.addProperty("nomeSocieta",this.getNomeSocieta());
        jsonObject.addProperty("indirizzoEmail",this.getIndirizzoEmail());
        jsonObject.addProperty("password",this.getPassword());
        jsonObject.addProperty("ban",this.isBan());
        jsonObject.add("wallet", this.getWallet().toJson());
        return jsonObject;
    }


}
