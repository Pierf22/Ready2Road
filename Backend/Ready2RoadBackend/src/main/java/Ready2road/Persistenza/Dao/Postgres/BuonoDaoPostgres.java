package Ready2road.Persistenza.Dao.Postgres;

import Ready2road.Persistenza.Dao.BuonoDao;
import Ready2road.Persistenza.Model.MetodiPagamento.Buono;
import com.google.gson.JsonObject;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

public class BuonoDaoPostgres implements BuonoDao {
    Connection connection;

    public BuonoDaoPostgres(Connection connection) {
        this.connection = connection;
    }

    @Override
    public List<Buono> getBuono(Long idWallet) {
        List<Buono> buoni = new ArrayList<>();
        String query = "SELECT * FROM buono, metodo_di_pagamento WHERE metodo_di_pagamento.wallet=? and buono.nome=metodo_di_pagamento.nome";
        try{
            PreparedStatement preparedStatement = connection.prepareStatement(query);
            preparedStatement.setLong(1, idWallet);
            ResultSet resultSet = preparedStatement.executeQuery();
            while(resultSet.next()){
                Buono buono = new Buono();
                buono.setCodice(resultSet.getString("codice"));
                buono.setValore(resultSet.getBigDecimal("valore"));
                buoni.add(buono);
            }
        }catch (Exception e){
            e.printStackTrace();
        }
        return buoni;
    }

    @Override
    public Buono findByPrimaryKey(String codice) {
        Buono buono = new Buono();
        String query = "SELECT * FROM buono WHERE codice=?";
        try{
            PreparedStatement preparedStatement = connection.prepareStatement(query);
            preparedStatement.setString(1, codice);
            ResultSet resultSet = preparedStatement.executeQuery();
            if(resultSet.next()){
                buono.setCodice(resultSet.getString("codice"));
                buono.setValore(resultSet.getBigDecimal("valore"));
            }
        }catch (Exception e){
            e.printStackTrace();
        }
        return buono;
    }

    @Override
    public void rimuoviBuono(String codice) {
        String query = "DELETE FROM buono WHERE codice=?";
        try {
            PreparedStatement preparedStatement = connection.prepareStatement(query);
            preparedStatement.setString(1, codice);
            preparedStatement.executeUpdate();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
