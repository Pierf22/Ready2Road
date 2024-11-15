package Ready2road.Persistenza.Dao.Postgres;

import Ready2road.Persistenza.Model.Biglietto;
import Ready2road.Persistenza.Model.Tratta;
import Ready2road.Persistenza.Model.Utente;
import com.google.gson.JsonObject;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class BigliettoProxy extends Biglietto {
    //Classe che implementa il pattern Proxy, viene usata perchè in molti casi non è necessario caricare l'utente proprietario del biglietto

    Connection connection;
    public BigliettoProxy(Connection connection){
        this.connection=connection;

    }

    @Override
    public Utente getUtente(){
        if(super.getUtente()==null){
            Utente utente=null;
            String query="select * from biglietto, utente where numero=? and tratta=? and utente=indirizzo_email";
            try{
                PreparedStatement ps=connection.prepareStatement(query);
                ps.setString(1, super.getNumero());
                ps.setString(2, super.getTratta().getId());
                ResultSet rs=ps.executeQuery();
                utente=new UtenteProxy(connection);
                utente.setIndirizzoEmail(rs.getString("indirizzo_email"));
                utente.setCognome(rs.getString("cognome"));
                utente.setNome(rs.getString("nome"));
                utente.setDataNascita(rs.getDate("data_nascita"));
                utente.setPassword(rs.getString("password"));
                utente.setNumeroTelefono(rs.getString("numero_telefono"));
                utente.setBan(rs.getBoolean("ban"));


            } catch (SQLException e) {
                throw new RuntimeException(e);
            }
        } return super.getUtente();
    }
    @Override
    public JsonObject toJson(){
        JsonObject json = new JsonObject();
        json.addProperty("numero", getNumero());
        json.addProperty("posto", getPosto());
        json.addProperty("cf", getCf());
        json.addProperty("nome", getNome());
        json.addProperty("cognome", getCognome());
        json.addProperty("data_ora_acquisto", getDataAcquisto().toString());
        json.addProperty("scadenza", getScadenza().toString());
        json.add("tratta", this.getTratta().toJson());

        return json;

    }

}
