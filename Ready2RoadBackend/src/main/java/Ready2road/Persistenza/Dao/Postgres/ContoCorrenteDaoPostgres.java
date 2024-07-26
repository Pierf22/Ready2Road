package Ready2road.Persistenza.Dao.Postgres;

import Ready2road.Persistenza.Dao.ContoCorrenteDao;
import Ready2road.Persistenza.Model.MetodiPagamento.ContoCorrente;
import Ready2road.Persistenza.Model.MetodiPagamento.MetodoPagamento;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class ContoCorrenteDaoPostgres implements ContoCorrenteDao {
    Connection connection;

    public ContoCorrenteDaoPostgres(Connection connection) {
        this.connection = connection;
    }

    @Override
    public int getNumeroTotaleConti() {
        int count = 0;
        String query = "select count(*) as result from conto_corrente";
        try {
            PreparedStatement st = connection.prepareStatement(query);
            ResultSet rs = st.executeQuery();
            if (rs.next())
                count = rs.getInt("result");

        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return count;
    }

    @Override
    public List<ContoCorrente> getUserConto(Long idWallet) {
        List<ContoCorrente> conti = new ArrayList<>();
        MetodoPagamento metodoPagamento;
        ContoCorrente conto;
        String query = "select * from metodo_di_pagamento mdp, conto_corrente cc where mdp.wallet=? and mdp.nome=cc.nome";
        try {
            PreparedStatement preparedStatement = connection.prepareStatement(query);
            preparedStatement.setLong(1, idWallet);
            ResultSet resultSet = preparedStatement.executeQuery();
            while (resultSet.next()) {
                conto = new ContoCorrente();
                metodoPagamento = new MetodoPagamento();
                
                metodoPagamento.setNome(resultSet.getString("nome"));
                conto.setIban(resultSet.getString("iban"));
                conto.setBanca(resultSet.getString("banca"));
                conto.setMetodoPagamento(metodoPagamento);
                conti.add(conto);
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        return conti;
    }

    @Override
    public void removeConto(String nome) {
        String query = "delete from conto_corrente where nome=?";
        try {
            PreparedStatement preparedStatement = connection.prepareStatement(query);
            preparedStatement.setString(1, nome);
            preparedStatement.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public void addConto(String iban, String nome, String banca){
        String query = "insert into conto_corrente values(?,?,?)";
        try {
            PreparedStatement preparedStatement = connection.prepareStatement(query);
            preparedStatement.setString(1, iban);
            preparedStatement.setString(2, nome);
            preparedStatement.setString(3, banca);
            preparedStatement.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

}
