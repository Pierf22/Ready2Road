package Ready2road.Persistenza.Dao.Postgres;

import Ready2road.Persistenza.DBManager;
import Ready2road.Persistenza.Dao.ConversazioneDao;
import Ready2road.Persistenza.Model.Admin;
import Ready2road.Persistenza.Model.Conversazione;
import Ready2road.Persistenza.Model.Messaggio;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class ConversazioneDaoPostgres implements ConversazioneDao {
    Connection connection;
    public ConversazioneDaoPostgres(Connection connection) {
        this.connection = connection;
    }

    @Override
    public List<Conversazione> getConversazioniAdmin(String username) {
        List<Conversazione> conversaziones=new ArrayList<>();
        String query="select * from conversazione where username_admin=?  ";
        try{
            PreparedStatement preparedStatement=connection.prepareStatement(query);
            preparedStatement.setString(1,username);
            ResultSet rs=preparedStatement.executeQuery();
            while (rs.next()){
                Conversazione conversazione=new Conversazione();
                conversazione.setNome(rs.getString("nome"));



                conversaziones.add(conversazione);
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return conversaziones;
    }

    @Override
    public List<Messaggio> getMessaggiDiUnaConversazione(String nomeConversazione) {
        List<Messaggio> messaggios=new ArrayList<>();
        String query="select * from messaggio where conversazione=?";
        try{
            PreparedStatement preparedStatement=connection.prepareStatement(query);
            preparedStatement.setString(1,nomeConversazione);
            ResultSet rs=preparedStatement.executeQuery();
            while (rs.next()){
                Messaggio messaggio=new Messaggio();
                messaggio.setId(rs.getLong("id"));
                messaggio.setTesto(rs.getString("testo"));
                messaggio.setMittente(rs.getString("mittente"));
                messaggio.setData(rs.getTimestamp("data").toLocalDateTime());
                ConversazioneDao conversazioneDao= DBManager.getInstance().getConversazioneDao();
                messaggio.setConversazione(conversazioneDao.findConversazione(rs.getString("conversazione")));
                messaggios.add(messaggio);
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return messaggios;
    }

    @Override
    public Conversazione findConversazione(String conversazione) {
        Conversazione conversazione1=new Conversazione();
        String query="select * from conversazione where nome=?";
        try{
            PreparedStatement preparedStatement=connection.prepareStatement(query);
            preparedStatement.setString(1,conversazione);
            ResultSet rs=preparedStatement.executeQuery();
            if(rs.next()){
                conversazione1.setNome(rs.getString("nome"));

            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return conversazione1;
    }

    @Override
    public List<Conversazione> getConversazioniUtente(String indirizzoEmail) {
        List<Conversazione> conversaziones=new ArrayList<>();
        String query="select * from conversazione where email_utente=?";
        try{
            PreparedStatement preparedStatement=connection.prepareStatement(query);
            preparedStatement.setString(1,indirizzoEmail);
            ResultSet rs=preparedStatement.executeQuery();
            while (rs.next()){
                Conversazione conversazione=new Conversazione();
                conversazione.setNome(rs.getString("nome"));



                conversaziones.add(conversazione);
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return conversaziones;
    }

    @Override
    public Conversazione creaConversazioneUtenteVenditore(String nomeSocieta, String indirizzoEmail) {
        Conversazione conversazione1=new Conversazione();
        String query="insert into conversazione(nome, email_utente, nome_venditore) values (?, ?, ?)";
        try{
            PreparedStatement preparedStatement=connection.prepareStatement(query);
            conversazione1.setNome(nomeSocieta+"-"+indirizzoEmail);
            preparedStatement.setString(1, conversazione1.getNome());
            preparedStatement.setString(2, indirizzoEmail);
            preparedStatement.setString(3, nomeSocieta);
            preparedStatement.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return conversazione1;
    }

    @Override
    public Conversazione creaConversazioneUtenteAdmin(String username, String indirizzoEmail) {
        Conversazione conversazione1=new Conversazione();
        String query="insert into conversazione(nome, email_utente, username_admin) values (?, ?, ?)";
        try{
            PreparedStatement preparedStatement=connection.prepareStatement(query);
            conversazione1.setNome(username+"-"+indirizzoEmail);
            preparedStatement.setString(1, conversazione1.getNome());
            preparedStatement.setString(2, indirizzoEmail);
            preparedStatement.setString(3, username);
            preparedStatement.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return conversazione1;
    }

    @Override
    public void eliminaConversazione(String nomeConversazione) {
        String query="delete from conversazione where nome=?";
        try{
            PreparedStatement preparedStatement=connection.prepareStatement(query);
            preparedStatement.setString(1,nomeConversazione);
            preparedStatement.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public List<Conversazione> getConversazioniVenditore(String nomeSocieta) {
        List<Conversazione> conversaziones=new ArrayList<>();
        String query="select * from conversazione where nome_venditore=?  ";
        try{
            PreparedStatement preparedStatement=connection.prepareStatement(query);
            preparedStatement.setString(1,nomeSocieta);
            ResultSet rs=preparedStatement.executeQuery();
            while (rs.next()){
                Conversazione conversazione=new Conversazione();
                conversazione.setNome(rs.getString("nome"));



                conversaziones.add(conversazione);
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return conversaziones;
    }
}
