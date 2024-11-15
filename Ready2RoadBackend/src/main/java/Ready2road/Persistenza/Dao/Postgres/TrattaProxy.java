package Ready2road.Persistenza.Dao.Postgres;

import Ready2road.Persistenza.Model.Tratta;
import Ready2road.Persistenza.Model.Venditore;
import com.google.gson.JsonObject;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class TrattaProxy extends Tratta {
    //Classe che implementa il pattern Proxy, viene usata perchè in molti casi non è necessario caricare il venditore che offre la tratta

    Connection connection;
    public TrattaProxy(Connection connection){
        this.connection=connection;
    }
    @Override
    public Venditore getVenditore(){
        if(super.getVenditore()==null){
        Venditore venditore=null;
        String query="select *  from tratta, venditore where tratta.id=? and tratta.nome_venditore=venditore.nome_società";
        try{
            PreparedStatement st=connection.prepareStatement(query);
            st.setString(1,this.getId());
            ResultSet rs=st.executeQuery();
            if (rs.next()){
                venditore=new VenditoreProxy(connection);
                venditore.setNomeSocieta(rs.getString("nome_società"));
                venditore.setPassword(rs.getString("password"));
                venditore.setIndirizzoEmail(rs.getString("indirizzo_email"));
                super.setVenditore(venditore);
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }}
        return super.getVenditore();
    }
    @Override
    public JsonObject toJson(){
        JsonObject result = new JsonObject();
        result.addProperty("id",getId());
        result.addProperty("partenza",getPartenza());
        result.addProperty("destinazione",getDestinazione());
        result.addProperty("tipo_mezzo", getTipoMezzo().toString());
        result.addProperty("capienza",getCapienza());
        result.addProperty("data_ora", getDataOra().toString());
        result.addProperty("posti_disponibili",getPostiDisponibili());
        result.addProperty("biglietti_scontati",getBigliettiScontati());
        result.addProperty("prezzo", getPrezzo());
        result.addProperty("sconto", getSconto());
        return result;
    }

    }

