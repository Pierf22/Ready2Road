package Ready2road.Persistenza.Dao.Postgres;

import Ready2road.Persistenza.DBManager;
import Ready2road.Persistenza.Dao.WalletDao;
import Ready2road.Persistenza.IdBrokers.IdBrokerWallet;
import Ready2road.Persistenza.Model.Wallet;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class WalletDaoPostgres implements WalletDao {
    Connection connection;

    public WalletDaoPostgres(Connection connection) {
        this.connection = connection;
    }

    @Override
    public void save(Wallet wallet) {
        String query="insert into wallet values(?,?,?)";
        try{
            PreparedStatement st=connection.prepareStatement(query);
            st.setLong(1,wallet.getId());
            st.setBigDecimal(2,wallet.getSaldo());
            st.setBigDecimal(3, BigDecimal.valueOf(0));
            st.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public JsonElement getSaldo(String email){
        JsonElement element = new JsonObject();

        BigDecimal saldo=new BigDecimal(0);
        String query="SELECT saldo, puntiacquisto\n" +
                "FROM wallet\n" +
                "JOIN utente ON utente.id_wallet = wallet.id AND utente.indirizzo_email = ?\n" +
                "WHERE utente.id_wallet IS NOT NULL\n" +
                "UNION\n" +
                "SELECT saldo, puntiacquisto\n" +
                "FROM wallet\n" +
                "JOIN venditore ON venditore.id_wallet = wallet.id AND venditore.indirizzo_email = ?\n" +
                "WHERE venditore.id_wallet IS NOT NULL";
        try{
            PreparedStatement st=connection.prepareStatement(query);
            st.setString(1,email);
            st.setString(2,email);
            ResultSet rs=st.executeQuery();
            if(rs.next()){
                element.getAsJsonObject().addProperty("saldo", rs.getBigDecimal("saldo"));
                element.getAsJsonObject().addProperty("puntiAcquisto", rs.getBigDecimal("puntiacquisto"));
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return element;
    }

    @Override
    public Wallet getWalletUtente(String email) {
        Wallet wallet=new Wallet();
        String query="Select id, saldo from wallet , utente where utente.id_wallet=id and indirizzo_email=? union select id, saldo from wallet, venditore where venditore.id_wallet=id and indirizzo_email = ?";
        try{
            PreparedStatement st=connection.prepareStatement(query);
            st.setString(1,email);
            st.setString(2,email);
            ResultSet rs=st.executeQuery();
            if(rs.next()){
                wallet.setId(rs.getLong("id"));
                wallet.setSaldo(rs.getBigDecimal("saldo"));
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return wallet;
    }

    @Override
    public void setPunti(String email) {
        String query = "UPDATE wallet SET puntiacquisto = puntiacquisto - 100 WHERE id = (SELECT id_wallet FROM utente WHERE indirizzo_email = ?)";
        try{
            PreparedStatement st=connection.prepareStatement(query);
            st.setString(1,email);
            st.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public void addBuono(String codice, String nome, BigDecimal valore) {
        String query = "INSERT INTO buono (codice, nome, valore) VALUES (?, ?, ?)";
        try{
            PreparedStatement st=connection.prepareStatement(query);
            st.setString(1,codice);
            st.setString(2,nome);
            st.setBigDecimal(3,valore);
            st.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return;
    }

    @Override
    public Wallet getWalletVenditore(String email) {
        Wallet wallet=new Wallet();
        String query="Select id, saldo from wallet , venditore where venditore.id_wallet=id and indirizzo_email=?";
        try{
            PreparedStatement st=connection.prepareStatement(query);
            st.setString(1,email);
            ResultSet rs=st.executeQuery();
            if(rs.next()){
                wallet.setId(rs.getLong("id"));
                wallet.setSaldo(rs.getBigDecimal("saldo"));
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return wallet;
    }

    @Override
    public void updateSaldo(Long idWallet, BigDecimal saldo) {
        String query="update wallet set saldo=? where id=?";
        try{
            PreparedStatement st=connection.prepareStatement(query);
            st.setBigDecimal(1,saldo);
            st.setLong(2,idWallet);
            st.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public void addPunti(String email, BigDecimal punti) {
        String query = "UPDATE wallet SET puntiacquisto = puntiacquisto + ? WHERE id = (SELECT id_wallet FROM utente WHERE indirizzo_email = ?)";
        try{
            PreparedStatement st=connection.prepareStatement(query);
            st.setBigDecimal(1,punti);
            st.setString(2,email);
            st.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }
}
