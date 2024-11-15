package Ready2road.Persistenza.Dao.Postgres;

import Ready2road.Persistenza.DBManager;
import Ready2road.Persistenza.Dao.UtenteDao;
import Ready2road.Persistenza.Dao.WalletDao;
import Ready2road.Persistenza.IdBrokers.IdBrokerWallet;
import Ready2road.Persistenza.Model.Utente;
import Ready2road.Persistenza.Model.Wallet;

import java.math.BigDecimal;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class UtenteDaoPostgres implements UtenteDao {
    Connection connection;

    public UtenteDaoPostgres(Connection connection) {
        this.connection = connection;
    }

    @Override
    public int getNumeroTotaleDiUtenti() {
        int count=0;
        String query="select count(*) as result from utente";
        try{
            PreparedStatement st=connection.prepareStatement(query);
            ResultSet rs=st.executeQuery();
            if(rs.next())
                count=rs.getInt("result");

        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return count;
    }

    @Override
    public boolean isUtentePresente(String email) {
        boolean result=false;
        String query="select * from utente where indirizzo_email=?";
        try{
            PreparedStatement st=connection.prepareStatement(query);
            st.setString(1,email);
            ResultSet rs=st.executeQuery();
            if(rs.next())
                result=true;

        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return result;
    }

    @Override
    public void registraUtente(Utente utente) {
        String query="insert into utente values(?,?,?,?,?,?, ?)";
        try{
            PreparedStatement st=connection.prepareStatement(query);
            st.setString(1,utente.getIndirizzoEmail());
            st.setString(2,utente.getCognome());
            st.setString(3,utente.getNome());
            java.sql.Date sqlDate = new java.sql.Date(utente.getDataNascita().getTime());
            st.setDate(4, sqlDate);
            st.setString(5,utente.getPassword());
            st.setString(6,utente.getNumeroTelefono());
            Wallet wallet=new Wallet();
            wallet.setId(IdBrokerWallet.getId(DBManager.getInstance().getConnection()));
            wallet.setSaldo(BigDecimal.ZERO);
            WalletDao walletDao=DBManager.getInstance().getWalletDao();
            walletDao.save(wallet);
            st.setLong(7, wallet.getId());

            utente.setWallet(wallet);
            st.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public List<Utente> findAlLazy() {
        List<Utente> utenti=new ArrayList<>();
        try {

            String query = "select * from utente";
            PreparedStatement st=connection.prepareStatement(query);
            ResultSet rs = st.executeQuery();
            while (rs.next()){
                Utente utente = new UtenteProxy(connection);
                utente.setIndirizzoEmail(rs.getString("indirizzo_email"));
                utente.setCognome(rs.getString("cognome"));
                utente.setNome(rs.getString("nome"));
                utente.setDataNascita(rs.getDate("data_nascita"));
                utente.setPassword(rs.getString("password"));
                utente.setNumeroTelefono(rs.getString("numero_telefono"));
                utente.setBan(rs.getBoolean("ban"));
                utenti.add(utente);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }

        return utenti;
    }

    @Override
    public Utente findByPrimaryKey(String email, String password) {
        Utente utente=null;
        try {

            String query = "select * from utente where indirizzo_email=? and password=? ";
            PreparedStatement preparedStatement=connection.prepareStatement(query);
            preparedStatement.setString(1, email);
            preparedStatement.setString(2, password);
            ResultSet rs = preparedStatement.executeQuery();

            if (rs.next()){
                utente = new UtenteProxy(connection);
                utente.setIndirizzoEmail(rs.getString("indirizzo_email"));
                utente.setCognome(rs.getString("cognome"));
                utente.setNome(rs.getString("nome"));
                utente.setDataNascita(rs.getDate("data_nascita"));
                utente.setPassword(rs.getString("password"));
                utente.setNumeroTelefono(rs.getString("numero_telefono"));
                utente.setBan(rs.getBoolean("ban"));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }

        return utente;
    }

    @Override
    public boolean changePassword(String email, String password) {
        String query="update utente set password=? where indirizzo_email=?";
        try{
            PreparedStatement st=connection.prepareStatement(query);
            st.setString(1,password);
            st.setString(2,email);
            int rowsUpdated = st.executeUpdate();

            return rowsUpdated > 0;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public boolean isEmailPresent(String email) {
        boolean result=false;
        String query="select * from utente where indirizzo_email = ?";
        try{
            PreparedStatement st=connection.prepareStatement(query);
            st.setString(1,email);
            ResultSet rs=st.executeQuery();
            if(rs.next())
                result=true;

        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return result;
    }

    @Override
    public void modifica(String email,  Utente nuovoUtente) {
        String query="update utente set indirizzo_email=?, cognome=?, nome=?, data_nascita=?, password=?, numero_telefono=?, ban=? where indirizzo_email=?";
        try{
            PreparedStatement st=connection.prepareStatement(query);
            st.setString(1,nuovoUtente.getIndirizzoEmail());
            st.setString(2,nuovoUtente.getCognome());
            st.setString(3,nuovoUtente.getNome());
            java.sql.Date sqlDate = new java.sql.Date(nuovoUtente.getDataNascita().getTime());
            st.setDate(4, sqlDate);
            st.setString(5,nuovoUtente.getPassword());
            st.setString(6,nuovoUtente.getNumeroTelefono());
            st.setBoolean(7,nuovoUtente.isBan());
            st.setString(8,email);
            st.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
    }
}

    @Override
    public void elimina(String email) {
        String query="delete from utente where indirizzo_email=?";
        try{
            PreparedStatement st=connection.prepareStatement(query);
            st.setString(1,email);
            st.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public void banna(String email) {
        String query="update utente set ban=not ban where indirizzo_email=?";
        try{
            PreparedStatement st=connection.prepareStatement(query);
            st.setString(1,email);
            st.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public Boolean eBannato(String indirizzoEmail) {
        Boolean ban = null;
        String query = "SELECT ban FROM utente WHERE indirizzo_email=?";
        try (PreparedStatement st = connection.prepareStatement(query)) {
            st.setString(1, indirizzoEmail);
            try (ResultSet rs = st.executeQuery()) {
                if (rs.next()) {
                    ban = rs.getBoolean("ban");
                }
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }

// Verifica se l'utente è presente e non è bannato
        return ban != null && !ban;}
    }

