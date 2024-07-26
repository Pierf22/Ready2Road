package Ready2road.Persistenza.Dao.Postgres;

import Ready2road.Persistenza.Dao.CartaPagamentoDao;
import Ready2road.Persistenza.Model.MetodiPagamento.CartaPagamento;
import Ready2road.Persistenza.Model.MetodiPagamento.MetodoPagamento;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class CartaPagamentoDaoPostgres implements CartaPagamentoDao {
    Connection connection;

    public CartaPagamentoDaoPostgres(Connection connection) {
        this.connection = connection;
    }

    @Override
    public int getNumeroTotaleDiCarte() {
        int count = 0;
        String query = "select count(*) as result from carta_di_pagamento";
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
   public void removeCarta(String numero) {
        String query = "delete from carta_di_pagamento where numero=?";
        try {
            PreparedStatement preparedStatement = connection.prepareStatement(query);
            preparedStatement.setString(1, numero);
            preparedStatement.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public void addCarta(String numero, String nome, String cvv, String dataScadenza){
        String query = "insert into carta_di_pagamento (numero, nome, cvc, data_di_scadenza) values (?, ?, ?, ?)";
        try {
            PreparedStatement preparedStatement = connection.prepareStatement(query);
            preparedStatement.setString(1, numero);
            preparedStatement.setString(2, nome);
            preparedStatement.setString(3, cvv);
            preparedStatement.setDate(4, Date.valueOf(dataScadenza));
            preparedStatement.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public List<CartaPagamento> getUserCard(Long idWallet) {
        List<CartaPagamento> carte = new ArrayList<>();
        MetodoPagamento metodoPagamento;
        CartaPagamento carta;
        String query = "select * from metodo_di_pagamento mdp, carta_di_pagamento cdp where mdp.wallet=? and mdp.nome=cdp.nome and cdp.data_di_scadenza > current_date";
        try {
            PreparedStatement preparedStatement = connection.prepareStatement(query);
            preparedStatement.setLong(1, idWallet);
            ResultSet resultSet = preparedStatement.executeQuery();
            while (resultSet.next()) {
                carta = new CartaPagamento();
                metodoPagamento = new MetodoPagamento();
                metodoPagamento.setNome(resultSet.getString("nome"));

                carta.setCvc(resultSet.getString("cvc"));
                carta.setNumero(resultSet.getString("numero"));
                carta.setDataScadenza(resultSet.getDate("data_di_scadenza"));
                carta.setMetodoPagamento(metodoPagamento);
                carte.add(carta);
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return carte;
    }
}
