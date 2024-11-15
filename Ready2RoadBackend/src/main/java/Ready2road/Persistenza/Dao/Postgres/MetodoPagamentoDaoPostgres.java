package Ready2road.Persistenza.Dao.Postgres;

import Ready2road.Persistenza.DBManager;
import Ready2road.Persistenza.Dao.MetodoPagamentoDao;
import Ready2road.Persistenza.IdBrokers.IdBrokerMetodoPagamento;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class MetodoPagamentoDaoPostgres implements MetodoPagamentoDao {
    Connection connection;

    public MetodoPagamentoDaoPostgres(Connection connection) {
        this.connection = connection;
    }

    @Override
    public void removeMetodoPagamento(String nome) {
        String query = "DELETE FROM metodo_di_pagamento WHERE nome = ?";
        try {
            PreparedStatement preparedStatement = connection.prepareStatement(query);
            preparedStatement.setString(1, nome);
            preparedStatement.executeUpdate();
        }
        catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public String addMetodoPagamento(String nome, Long idWallet) {
        String nomeMetodo = IdBrokerMetodoPagamento.getId(DBManager.getInstance().getConnection(), nome);

        String query = "INSERT INTO metodo_di_pagamento (nome, wallet) VALUES (?, ?)";
        try {
            PreparedStatement preparedStatement = connection.prepareStatement(query);
            preparedStatement.setString(1, nomeMetodo);
            preparedStatement.setLong(2, idWallet);
            preparedStatement.executeUpdate();
        }
        catch (Exception e) {
            e.printStackTrace();
        }

        return nomeMetodo;
    }

    @Override
    public String addBuono(String codice, int valore, String email) {
        String nome = IdBrokerMetodoPagamento.getId(DBManager.getInstance().getConnection(), "buono");

        String query = "insert into metodo_di_pagamento (nome, wallet) values(?, (select id from wallet, utente where wallet.id = utente.id_wallet and utente.indirizzo_email = ?))";
        try {
            PreparedStatement st = connection.prepareStatement(query);
            st.setString(1, nome);
            st.setString(2, email);
            st.executeUpdate();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        return nome;
    }
}
