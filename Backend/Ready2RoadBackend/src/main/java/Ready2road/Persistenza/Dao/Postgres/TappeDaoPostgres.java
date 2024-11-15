package Ready2road.Persistenza.Dao.Postgres;

import Ready2road.Persistenza.Dao.TappeDao;
import Ready2road.Persistenza.Model.Tappe;
import com.google.gson.JsonElement;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

public class TappeDaoPostgres implements TappeDao {
    Connection connection;

    public TappeDaoPostgres(Connection connection) {
        this.connection = connection;
    }

    public Tappe getTappe(String id) {
        Tappe tappa = null;
        String query = "select * from tappe where tratta = ?";
        try{
            PreparedStatement st=connection.prepareStatement(query);
            st.setString(1, id);
            ResultSet rs = st.executeQuery();
            if(rs.next()){
                tappa = new Tappe();
                tappa.setCitta1(rs.getString("citta1"));
                tappa.setCitta2(rs.getString("citta2"));
                tappa.setCitta3(rs.getString("citta3"));
                tappa.setCitta4(rs.getString("citta4"));
                tappa.setCitta5(rs.getString("citta5"));
                tappa.setCitta6(rs.getString("citta6"));
                tappa.setCitta7(rs.getString("citta7"));
                tappa.setCitta8(rs.getString("citta8"));
                tappa.setCitta9(rs.getString("citta9"));
                tappa.setCitta10(rs.getString("citta10"));
            }

        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return tappa;
    }

    @Override
    public void salva(String id, List<String> tappeList) {
        if (tappeList.size() > 10 || tappeList.isEmpty()) {
            // Numero massimo di città supportato superato
            return;
        }

        StringBuilder queryBuilder = new StringBuilder("insert into tappe (tratta");
        for (int i = 1; i <= tappeList.size(); i++) {
            queryBuilder.append(", citta").append(i);
        }
        queryBuilder.append(") values (?");

        queryBuilder.append(", ?".repeat(tappeList.size()));
        queryBuilder.append(")");

        String query = queryBuilder.toString();

        try {
            PreparedStatement st = connection.prepareStatement(query);
            st.setString(1, id);
            for (int i = 0; i < tappeList.size(); i++) {
                st.setString(i + 2, tappeList.get(i));
            }
            st.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
}}
