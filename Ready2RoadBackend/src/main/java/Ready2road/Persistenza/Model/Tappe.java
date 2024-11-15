package Ready2road.Persistenza.Model;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

public class Tappe {
    String  citta1, citta2, citta3, citta4, citta5, citta6, citta7, citta8, citta9, citta10;
    Tratta tratta;



    public Tratta getTratta() {
        return tratta;
    }

    public void setTratta(Tratta tratta) {
        this.tratta = tratta;
    }

    public String getCitta1() {
        return citta1;
    }

    public void setCitta1(String citta1) {
        this.citta1 = citta1;
    }

    public String getCitta2() {
        return citta2;
    }

    public void setCitta2(String citta2) {
        this.citta2 = citta2;
    }

    public String getCitta3() {
        return citta3;
    }

    public void setCitta3(String citta3) {
        this.citta3 = citta3;
    }

    public String getCitta4() {
        return citta4;
    }

    public void setCitta4(String citta4) {
        this.citta4 = citta4;
    }

    public String getCitta5() {
        return citta5;
    }

    public void setCitta5(String citta5) {
        this.citta5 = citta5;
    }

    public String getCitta6() {
        return citta6;
    }

    public void setCitta6(String citta6) {
        this.citta6 = citta6;
    }

    public String getCitta7() {
        return citta7;
    }

    public void setCitta7(String citta7) {
        this.citta7 = citta7;
    }

    public String getCitta8() {
        return citta8;
    }

    public void setCitta8(String citta8) {
        this.citta8 = citta8;
    }

    public String getCitta9() {
        return citta9;
    }

    public void setCitta9(String citta9) {
        this.citta9 = citta9;
    }

    public String getCitta10() {
        return citta10;
    }

    public void setCitta10(String citta10) {
        this.citta10 = citta10;
    }

    public JsonElement toJson() {
        JsonObject result = new JsonObject();
        result.addProperty("citta1", citta1);
        result.addProperty("citta2", citta2);
        result.addProperty("citta3", citta3);
        result.addProperty("citta4", citta4);
        result.addProperty("citta5", citta5);
        result.addProperty("citta6", citta6);
        result.addProperty("citta7", citta7);
        result.addProperty("citta8", citta8);
        result.addProperty("citta9", citta9);
        result.addProperty("citta10", citta10);
        return result;
    }
}
