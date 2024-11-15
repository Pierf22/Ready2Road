package Ready2road.Persistenza.Model;

import com.google.gson.JsonObject;

public class Admin {
    private String username, cognome, nome, password;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
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
    public JsonObject toJson(){
        JsonObject result = new JsonObject();
        result.addProperty("username",getUsername());
        result.addProperty("nome",getNome());
        result.addProperty("cognome",getCognome());
        result.addProperty("password",getPassword());
        return result;
    }
}
