package Ready2road.Persistenza.Dao.Postgres;

import Ready2road.Persistenza.Model.Venditore;
import Ready2road.Persistenza.Model.Wallet;
import com.google.gson.JsonObject;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class VenditoreProxy extends Venditore {
    //Classe che implementa il pattern Proxy, viene usata perchè in molti casi non è necessario caricare il wallet del venditore

    Connection connection;
    public VenditoreProxy(Connection connection){
        this.connection=connection;
    }
    @Override
    public Wallet getWallet(){
        if(super.getWallet()==null){
        Wallet wallet=null;
        String query="select *  from venditore, wallet where venditore.nome_società=? and venditore.id_wallet=wallet.id";
        try{
            PreparedStatement st=connection.prepareStatement(query);
            st.setString(1,this.getNomeSocieta());
            ResultSet rs=st.executeQuery();
            if (rs.next()){
                wallet=new Wallet();
                wallet.setId(rs.getLong("id"));
                wallet.setSaldo(rs.getBigDecimal("saldo"));
                wallet.setPuntiAcquisto(rs.getBigDecimal("puntiacquisto"));
                super.setWallet(wallet);
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }}
        return super.getWallet();

    }
    public JsonObject toJson() {
        JsonObject jsonObject=new JsonObject();
        jsonObject.addProperty("nomeSocieta",this.getNomeSocieta());
        jsonObject.addProperty("indirizzoEmail",this.getIndirizzoEmail());
        jsonObject.addProperty("password",this.getPassword());
        jsonObject.addProperty("ban", this.isBan());
        return jsonObject;
    }
}
