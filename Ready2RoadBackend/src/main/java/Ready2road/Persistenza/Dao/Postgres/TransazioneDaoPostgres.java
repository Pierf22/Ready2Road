package Ready2road.Persistenza.Dao.Postgres;

import Ready2road.Persistenza.DBManager;
import Ready2road.Persistenza.Dao.TransazioneDao;
import Ready2road.Persistenza.Dao.VenditoreDao;
import Ready2road.Persistenza.IdBrokers.IdBrokerTransazione;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

import java.math.BigDecimal;
import java.sql.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

public class TransazioneDaoPostgres implements TransazioneDao {
    Connection connection;

    public TransazioneDaoPostgres(Connection connection) {
        this.connection = connection;
    }

    @Override
    public Integer getNumeroTotaleDiTransazioni() {
        Integer count=0;
        String query="select count(*) as result from transazione";
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
    public Integer getTransazioniUtente(String email) {
        Integer count = 0;
        String query = "select count(*) as totale from transazione, wallet, utente where utente.indirizzo_email = ? and utente.id_wallet = wallet.id and wallet.id = transazione.wallet ";
        try{
            PreparedStatement st=connection.prepareStatement(query);
            st.setString(1, email);
            ResultSet rs=st.executeQuery();
            if(rs.next()){
                count = rs.getInt("totale");
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return count;
    }

    @Override
    public JsonObject getAllUtente(Long walletId){
        LocalDateTime dateTime;
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        JsonElement jsonElement = null;
        int i = 1;
        JsonObject jsonObject = new JsonObject();
        String query = "select * from transazione where wallet=? order by data_ora asc";
        String query1 = "select * from biglietto_transazione where id_transazione=?";

        try{
            PreparedStatement st=connection.prepareStatement(query);
            st.setLong(1, walletId);
            ResultSet rs=st.executeQuery();
            while(rs.next()){
                jsonElement = new JsonObject();

                Long idTransazione = rs.getLong("id");
                List<String> biglietti = new ArrayList<>();
                PreparedStatement st1=connection.prepareStatement(query1);
                st1.setLong(1, idTransazione);
                ResultSet rs1=st1.executeQuery();
                while (rs1.next()) {
                    String numeroBiglietto = rs1.getString("numero_biglietto");
                    if (numeroBiglietto != null) {
                        biglietti.add(numeroBiglietto);
                    }
                }
                //prendo l'intera data e la trasformo in stringa
                dateTime = rs.getTimestamp("data_ora").toLocalDateTime();

                jsonElement.getAsJsonObject().addProperty("data_ora", dateTime.format(formatter));
                jsonElement.getAsJsonObject().addProperty("valore", rs.getBigDecimal("valore"));
                jsonElement.getAsJsonObject().addProperty("metodo_pagamento", rs.getString("metodo_pagamento"));
                JsonArray jsonArray = new JsonArray();
                for (String s : biglietti) {
                    jsonArray.add(s);
                }
                jsonElement.getAsJsonObject().add("biglietti", jsonArray);
                jsonObject.add(String.valueOf(i), jsonElement);
                i++;
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return jsonObject;
    }

    @Override
    public void addTransazione(Long idwallet, BigDecimal valore, String metodoPagamento){
        Timestamp timestamp = new Timestamp(System.currentTimeMillis());
        String query = "insert into transazione (valore, data_ora, metodo_pagamento, wallet) values (?,?,?,?)";
        try{
            PreparedStatement st=connection.prepareStatement(query);
            st.setBigDecimal(1, valore);
            st.setTimestamp(2, timestamp);
            st.setString(3, metodoPagamento);
            st.setLong(4, idwallet);
            st.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public void addTransazioneBiglietto(Long idWallet, BigDecimal valore, String metodoPagamento, List<String> biglietto){
        Timestamp timestamp = new Timestamp(System.currentTimeMillis());
        Long idTransazione;
        String query = "insert into transazione (id, valore, data_ora, metodo_pagamento, wallet) values (?, ?,?,?,?)";
        String query1 = "insert into biglietto_transazione (numero_biglietto, id_transazione) values (?,?)";
        try{
            PreparedStatement st=connection.prepareStatement(query);
            idTransazione = IdBrokerTransazione.getId(connection);
            st.setLong(1, idTransazione);
            st.setBigDecimal(2, valore);
            st.setTimestamp(3, timestamp);
            st.setString(4, metodoPagamento);
            st.setLong(5, idWallet);
            for(String s : biglietto){
                PreparedStatement st1=connection.prepareStatement(query1);
                st1.setLong(1, Long.parseLong(s));
                st1.setLong(2, idTransazione);
                st1.executeUpdate();
            }
            st.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }


    @Override
    public void azzeraSaldo(Long idwallet, BigDecimal valore, String metodoPagamento) {
        Timestamp timestamp = new Timestamp(System.currentTimeMillis());
        String query = "insert into transazione (valore, data_ora, metodo_pagamento, wallet) values (?,?,?,?)";
        try{
            PreparedStatement st=connection.prepareStatement(query);
            st.setBigDecimal(1, valore);
            st.setTimestamp(2, timestamp);
            st.setString(3, metodoPagamento);
            st.setLong(4, idwallet);
            st.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public void deleteTransazione(String nome){
        String query = "delete from transazione where metodo_pagamento = ?";
        try{
            PreparedStatement st=connection.prepareStatement(query);
            st.setString(1, nome);
            st.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public int getNumeroTransazioniWallet(String nomeSocieta) {
        int count=0;
        String query="select count(*) as result from transazione, wallet, venditore where nome_società=?" +
                " and venditore.id_wallet=wallet.id and transazione.wallet=wallet.id";
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



    @Override
    public HashMap<String, Integer> getNumeroDiTransazioniPerMetodoDiPagamento() {
        HashMap<String, Integer> counts=new HashMap<>();
        String query="select count(*) as result from transazione, carta_di_pagamento where metodo_pagamento=carta_di_pagamento.nome";
        String query1="select count(*) as result from transazione, conto_corrente where metodo_pagamento=conto_corrente.nome";
        String query2="select count(*) as result from transazione, buono where metodo_pagamento=buono.nome";


        try{
            PreparedStatement st=connection.prepareStatement(query);
            ResultSet rs=st.executeQuery();
            if(rs.next() )
                counts.put("Carte di pagamento",rs.getInt("result"));
            st=connection.prepareStatement(query1);
            rs=st.executeQuery();
            if(rs.next() )
                counts.put("Conti correnti",rs.getInt("result"));
            st=connection.prepareStatement(query2);
            rs=st.executeQuery();
            if(rs.next() )
                counts.put("Buoni",rs.getInt("result"));

        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return counts;
    }



    @Override
    public BigDecimal getRendimentiInUnGapDiDate(Date inizio, Date fine) {
        BigDecimal value1=BigDecimal.ZERO;
        String query="select sum(valore) as result from transazione where DATE(data_ora) between ? and ?";
        try{
            PreparedStatement st=connection.prepareStatement(query);
            java.sql.Date sqlDate1 = new java.sql.Date(inizio.getTime());
            java.sql.Date sqlDate2 = new java.sql.Date(fine.getTime());
            st.setDate(1,sqlDate1);
            st.setDate(2,sqlDate2);
            ResultSet rs=st.executeQuery();
            if(rs.next() && rs.getString("result")!=null){
                String resultString = rs.getString("result").replaceAll("[$,]", ""); // Rimuove la virgola
                value1 = new BigDecimal(resultString);
            }



        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return value1;
    }
    @Override
    public BigDecimal getRendimentiInUnGapDiDateSingoloVenditore(Date inizio, Date fine, String nomeSocieta) {
        BigDecimal value1=BigDecimal.ZERO;
        String query="select sum(valore) as result from transazione, venditore where DATE(data_ora) between ? and ? and nome_società=? and venditore.id_wallet=transazione.wallet";
        try{
            PreparedStatement st=connection.prepareStatement(query);
            java.sql.Date sqlDate1 = new java.sql.Date(inizio.getTime());
            java.sql.Date sqlDate2 = new java.sql.Date(fine.getTime());
            st.setDate(1,sqlDate1);
            st.setDate(2,sqlDate2);
            st.setString(3,nomeSocieta);
            ResultSet rs=st.executeQuery();
            if(rs.next() && rs.getString("result")!=null){
                String resultString = rs.getString("result").replaceAll("[$,]", ""); // Rimuove la virgola
                value1 = new BigDecimal(resultString);
            }


        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return value1;
    }
}
