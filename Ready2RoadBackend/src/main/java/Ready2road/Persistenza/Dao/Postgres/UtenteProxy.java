package Ready2road.Persistenza.Dao.Postgres;

import Ready2road.Persistenza.Model.Utente;
import Ready2road.Persistenza.Model.Wallet;
import com.google.gson.JsonObject;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class UtenteProxy extends Utente {
    //Classe che implementa il pattern Proxy, viene usata perchè in molti casi non è necessario caricare il wallet dell'utente
    Connection connection;
    public UtenteProxy(Connection con){this.connection=con;}

    @Override
    public Wallet getWallet(){
        if(super.getWallet()==null){
            Wallet wallet=null;
            String query="select *  from utente, wallet where utente.indirizzo_email=? and utente.id_wallet=wallet.id";
            try{
                PreparedStatement st=connection.prepareStatement(query);
                st.setString(1,this.getIndirizzoEmail());
                ResultSet rs=st.executeQuery();
                if (rs.next()){
                    wallet=new Wallet();
                    wallet.setId(rs.getLong("id"));
                    wallet.setSaldo(rs.getBigDecimal("saldo"));
                    super.setWallet(wallet);
                }
            } catch (SQLException e) {
                throw new RuntimeException(e);
            }}
        return super.getWallet();

    }
    @Override
    public JsonObject toJson(){
        JsonObject jsonObject=new JsonObject();
        jsonObject.addProperty("nome",this.getNome());
        jsonObject.addProperty("cognome",this.getCognome());
        jsonObject.addProperty("numeroTelefono",this.getNumeroTelefono());
        jsonObject.addProperty("dataNascita",this.getDataNascita().toString());
        jsonObject.addProperty("password",this.getPassword());
        jsonObject.addProperty("indirizzoEmail",this.getIndirizzoEmail());
        jsonObject.addProperty("ban", this.isBan());
        return jsonObject;
    }
}
