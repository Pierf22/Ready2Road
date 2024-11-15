package Ready2road.Persistenza.Dao.Postgres;

import Ready2road.Persistenza.DBManager;
import Ready2road.Persistenza.Dao.ConversazioneDao;
import Ready2road.Persistenza.Dao.MessaggioDao;
import Ready2road.Persistenza.IdBrokers.IdBrokerMessaggio;
import Ready2road.Persistenza.Model.Messaggio;

import java.sql.*;

public class MessaggioDaoPostgres implements MessaggioDao {
    Connection connection;
    public MessaggioDaoPostgres(Connection connection){
        this.connection=connection;
    }

    @Override
    public Long creaMessaggio(String testo, String mittente, String conversazione, String data) {
        Long id;
        String query="insert into messaggio(id, conversazione, testo, mittente, data) values(?,?,?,?,?)";
        try{
            PreparedStatement preparedStatement=connection.prepareStatement(query);
            id= IdBrokerMessaggio.getId(DBManager.getInstance().getConnection());
            preparedStatement.setLong(1,id);
            preparedStatement.setString(2, conversazione);
            preparedStatement.setString(3, testo);
            preparedStatement.setString(4, mittente);
            preparedStatement.setTimestamp(5, Timestamp.valueOf(data.replace("T", " ").replace("Z", "")));
            preparedStatement.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return id;
    }

    @Override
    public Messaggio findMessaggio(Long id) {
        Messaggio messaggio=new Messaggio();
        String query="select * from messaggio where id=?";
        try{
            PreparedStatement preparedStatement=connection.prepareStatement(query);
            preparedStatement.setLong(1,id);
            ResultSet rs=preparedStatement.executeQuery();
            if(rs.next()) {
                messaggio.setId(id);
                messaggio.setTesto(rs.getString("testo"));
                messaggio.setMittente(rs.getString("mittente"));
                messaggio.setData(rs.getTimestamp("data").toLocalDateTime());
                ConversazioneDao conversazioneDao=DBManager.getInstance().getConversazioneDao();
                messaggio.setConversazione(conversazioneDao.findConversazione(rs.getString("conversazione")));
            }

        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return messaggio;
    }
}
