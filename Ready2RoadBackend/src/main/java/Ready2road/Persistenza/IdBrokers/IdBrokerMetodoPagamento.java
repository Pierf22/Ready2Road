package Ready2road.Persistenza.IdBrokers;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class IdBrokerMetodoPagamento {
    //Attributi
    private static final String conto="pagamento_conto_id";
    private static final String carta="pagamento_carta_id";
    private static final String buono="pagamento_buono_id";

    //Metodi
    public static String getId(Connection connection, String tipo){
        String id = null;
        //Query per ottenere l'id
        try{
            String query = "SELECT nextval(?) AS id";
            PreparedStatement statement = connection.prepareStatement(query);
            //in base al tipo di pagamento si passa il nome della sequenza corrispondente
            switch (tipo){
                case "conto":
                    statement.setString(1, conto);
                    break;
                case "carta":
                    statement.setString(1, carta);
                    break;
                default:
                    statement.setString(1, buono);
                    break;
            }
            ResultSet result = statement.executeQuery();
            result.next();
            //in base al tipo di pagamento si costruisce l'id
            switch (tipo){
                case "conto":
                    id = "conto" + result.getLong("id");
                    break;
                case "carta":
                    id = "carta" + result.getLong("id");
                    break;
                default:
                    id = "buono" + result.getLong("id");
                    break;
            }
        }catch (SQLException e) {
            e.printStackTrace();
        }

        return id;
    }
}
