package Ready2road.Persistenza.IdBrokers;

import Ready2road.Persistenza.Model.Tratta;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class IdBrokerTratta {
    private static final String bus="tratta_bus_id";
    private static final String aerei="tratta_aerei_id";
    private static final String treni="tratta_treni_id";
    private static final String query = "SELECT nextval('tratta_id') AS id";

    public static String getId(Connection connection, Tratta.mezzi mezzo){
        String id = null;
        try {
            String query = "SELECT nextval(?) AS id";
            PreparedStatement statement = connection.prepareStatement(query);
            switch (mezzo){
                case AEREO:
                    statement.setString(1, aerei);
                    break;
                case BUS:
                    statement.setString(1, bus);
                    break;
                default:
                    statement.setString(1, treni);
                    break;
            }
            ResultSet result = statement.executeQuery();
            result.next();
            switch (mezzo){
                case AEREO:
                    id = "AR" + result.getLong("id");
                    break;
                case BUS:
                    id = "BR" + result.getLong("id");
                    break;
                default:
                    id = "TR" + result.getLong("id");
                    break;
            }
        } catch (SQLException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }

        return id;
    }
}
