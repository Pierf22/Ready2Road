package Ready2road.Persistenza.Dao.Postgres;

import Ready2road.Persistenza.DBManager;
import Ready2road.Persistenza.Dao.VenditoreDao;
import Ready2road.Persistenza.Dao.WalletDao;
import Ready2road.Persistenza.IdBrokers.IdBrokerWallet;
import Ready2road.Persistenza.Model.Utente;
import Ready2road.Persistenza.Model.Venditore;
import Ready2road.Persistenza.Model.Wallet;

import java.math.BigDecimal;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class VenditoreDaoPostgres implements VenditoreDao {
    Connection connection;

    public VenditoreDaoPostgres(Connection connection) {
        this.connection = connection;
    }

    @Override
    public int getNumeroTotaleDiVenditori() {
        int count=0;
        String query="select count(*) as result from venditore";
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
    public List<String> getNomiVenditori() {
        List<String> nomi=new ArrayList<>();
        String query="select * from venditore";
        try{
            PreparedStatement st=connection.prepareStatement(query);
            ResultSet rs=st.executeQuery();
            while(rs.next())
                nomi.add(rs.getString("nome_società"));

        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return nomi;
    }

    @Override
    public boolean isVenditorePresente(String email, String nomeSocieta) {
        boolean result=false;
        String query = "select * from venditore where indirizzo_email = ? or nome_società = ?";
        try {
            PreparedStatement st = connection.prepareStatement(query);
            st.setString(1, email);
            st.setString(2, nomeSocieta);
            ResultSet rs = st.executeQuery();
            if(rs.next()){
                result=true;}
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return result;
    }



    @Override
    public void registraVenditore(Venditore venditore) {
        String query="insert into venditore values(?,?,?,?)";
        try{
            PreparedStatement st=connection.prepareStatement(query);

            st.setString(1,venditore.getNomeSocieta());
            st.setString(2,venditore.getPassword());
            st.setString(3,venditore.getIndirizzoEmail());
            Wallet wallet=new Wallet();
            wallet.setId(IdBrokerWallet.getId(DBManager.getInstance().getConnection()));
            wallet.setSaldo(BigDecimal.ZERO);
            WalletDao walletDao=DBManager.getInstance().getWalletDao();
            walletDao.save(wallet);
            st.setLong(4, wallet.getId());

            venditore.setWallet(wallet);
            st.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public List<Venditore> findAlLazy() {
        List<Venditore> venditori=new ArrayList<>();
        try {

            String query = "select * from venditore";
            PreparedStatement st=connection.prepareStatement(query);
            ResultSet rs = st.executeQuery();
            while (rs.next()){
                Venditore venditore = new VenditoreProxy(connection);
                venditore.setNomeSocieta(rs.getString("nome_società"));
                venditore.setPassword(rs.getString("password"));
                venditore.setIndirizzoEmail(rs.getString("indirizzo_email"));
                venditore.setBan(rs.getBoolean("ban"));
                venditori.add(venditore);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }

        return venditori;
    }

    @Override
    public Venditore findByNome(String nomeSocieta) {
        Venditore venditore = null;
        try {

            String query = "select * from venditore where nome_società=?";
            PreparedStatement st = connection.prepareStatement(query);
            st.setString(1, nomeSocieta);
            ResultSet rs = st.executeQuery();
            if (rs.next()) {
                venditore = new VenditoreProxy(connection);
                venditore.setNomeSocieta(rs.getString("nome_società"));
                venditore.setPassword(rs.getString("password"));
                venditore.setIndirizzoEmail(rs.getString("indirizzo_email"));
                venditore.setBan(rs.getBoolean("ban"));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return venditore;
    }

    @Override
    public Venditore findByPrimaryKey(String indirizzoEmail, String password) {
        Venditore venditore=null;
        try {

            String query = "select * from venditore where indirizzo_email=? and password=? ";
            PreparedStatement st=connection.prepareStatement(query);
            st.setString(1, indirizzoEmail);
            st.setString(2, password);
            ResultSet rs = st.executeQuery();
            if (rs.next()){
                venditore = new VenditoreProxy(connection);
                venditore.setNomeSocieta(rs.getString("nome_società"));
                venditore.setPassword(rs.getString("password"));
                venditore.setIndirizzoEmail(rs.getString("indirizzo_email"));
                venditore.setBan(rs.getBoolean("ban"));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return venditore;
    }

    @Override
    public boolean isEmailPresent(String email) {
        boolean result=false;
        String query = "select * from venditore where indirizzo_email = ?";
        try {
            PreparedStatement st = connection.prepareStatement(query);
            st.setString(1, email);
            ResultSet rs = st.executeQuery();
            if(rs.next())
                result=true;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return result;
    }

    @Override
    public boolean isNomePresent(String nome) {
        boolean result=false;
        String query = "select * from venditore where nome_società = ?";
        try {
            PreparedStatement st = connection.prepareStatement(query);
            st.setString(1, nome);
            ResultSet rs = st.executeQuery();
            if(rs.next()){
                result=true;}
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return result;
    }

    @Override
    public boolean changePassword(String email, String password) {
        String query="update venditore set password=? where indirizzo_email=?";
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
    public void modifica(String nomeSocieta, Venditore venditore) {
        String query="update venditore set nome_società=?, password=?, indirizzo_email=?, ban=? where nome_società=? ";
        try{
            PreparedStatement st=connection.prepareStatement(query);
            st.setString(1,venditore.getNomeSocieta());
            st.setString(2,venditore.getPassword());
            st.setString(3,venditore.getIndirizzoEmail());
            st.setBoolean(4,venditore.isBan());
            st.setString(5,nomeSocieta);
            st.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
    }
}

    @Override
    public void elimina(String nomeSocieta) {
        String query="delete from venditore where nome_società=?";
        try{
            PreparedStatement st=connection.prepareStatement(query);
            st.setString(1,nomeSocieta);
            st.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public void banna(String nomeSocieta) {
        String query="update venditore set ban=not ban where nome_società=?";
        try{
            PreparedStatement st=connection.prepareStatement(query);
            st.setString(1,nomeSocieta);
            st.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public Boolean eBannato(String nomeSocieta){
        Boolean ban = null;
        String query = "SELECT ban FROM venditore WHERE nome_società=?";
        try (PreparedStatement st = connection.prepareStatement(query)) {
            st.setString(1, nomeSocieta);
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

    @Override
    public int getNumeroClientiPerVenditore(String nomeSocieta) {
        int count=0;
        String query="select count(distinct biglietto.utente) as result from venditore, tratta, biglietto where nome_società=?" +
                " and nome_venditore=venditore.nome_società and id=biglietto.tratta";
        try{
            PreparedStatement st=connection.prepareStatement(query);
            st.setString(1,nomeSocieta);
            ResultSet rs=st.executeQuery();
            if(rs.next())
                count=rs.getInt("result");

        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return count;
    }

}
