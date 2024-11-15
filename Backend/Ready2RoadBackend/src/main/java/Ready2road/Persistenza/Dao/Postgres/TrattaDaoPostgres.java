package Ready2road.Persistenza.Dao.Postgres;

import Ready2road.Persistenza.DBManager;
import Ready2road.Persistenza.Dao.TrattaDao;
import Ready2road.Persistenza.Dao.VenditoreDao;
import Ready2road.Persistenza.Model.Tratta;
import Ready2road.Persistenza.Model.Venditore;
import com.google.gson.JsonElement;

import java.sql.*;
import java.util.*;
import java.util.Date;

public class TrattaDaoPostgres implements TrattaDao {
    Connection connection;

    public TrattaDaoPostgres(Connection connection) {
        this.connection = connection;
    }

    @Override
    public Tratta[] getTratteLazy(String partenza, String destinazione, Date dataPartenza, Tratta.mezzi tipoMezzo) {
        List<Tratta> tratte = new ArrayList<>();
        String query="select *  from tratta where  partenza=? and destinazione=? and tipo_mezzo= ? and DATE(data_ora)=? and posti_disponibili>0";
        try{
            PreparedStatement st=connection.prepareStatement(query);
            st.setString(1,partenza);
            st.setString(2,destinazione);
            st.setString(3, tipoMezzo.toString());
            java.sql.Date sqlDate = new java.sql.Date(dataPartenza.getTime());
            st.setDate(4, sqlDate);
            ResultSet rs=st.executeQuery();
            while (rs.next()){
                Tratta tratta=new TrattaProxy(connection);
                tratta.setId(rs.getString("id"));
                tratta.setPartenza(rs.getString("partenza"));
                tratta.setDestinazione(rs.getString("destinazione"));
                //System.out.println(rs.getString("tipo_mezzo"));
                tratta.setPrezzo(rs.getBigDecimal("prezzo"));
                tratta.setBigliettiScontati(rs.getInt("numero_biglietti_scontati"));
                tratta.setSconto(rs.getInt("sconto"));
                tratta.setTipoMezzo(Tratta.mezzi.valueOf(rs.getString("tipo_mezzo").trim()));
                tratta.setCapienza(rs.getInt("capienza"));
                tratta.setDataOra(rs.getTimestamp("data_ora").toLocalDateTime());
                tratta.setPostiDisponibili(rs.getInt("posti_disponibili"));
                tratte.add(tratta);
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return tratte.toArray(Tratta[]::new);
    }

    @Override
    public Tratta[] getTratteLazy(String partenza, String destinazione) {
        List<Tratta> tratte = new ArrayList<>();
        String query="select *  from tratta where  partenza=? and destinazione=? ";
        try{
            PreparedStatement st=connection.prepareStatement(query);
            st.setString(1,partenza);
            st.setString(2,destinazione);

            ResultSet rs=st.executeQuery();
            while (rs.next()){
                Tratta tratta=new TrattaProxy(connection);
                tratta.setId(rs.getString("id"));
                tratta.setPartenza(rs.getString("partenza"));
                tratta.setDestinazione(rs.getString("destinazione"));
                tratta.setBigliettiScontati(rs.getInt("numero_biglietti_scontati"));

                tratta.setTipoMezzo(Tratta.mezzi.valueOf(rs.getString("tipo_mezzo").trim()));
                tratta.setCapienza(rs.getInt("capienza"));
                tratta.setSconto(rs.getInt("sconto"));

                tratta.setPrezzo(rs.getBigDecimal("prezzo"));

                tratta.setDataOra(rs.getTimestamp("data_ora").toLocalDateTime());
                tratta.setPostiDisponibili(rs.getInt("posti_disponibili"));
                tratte.add(tratta);
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return tratte.toArray(Tratta[]::new);
    }

    @Override
    public String[] getPartenze(Tratta.mezzi tipoMezzo) {
        List<String> partenze = new ArrayList<>();
        String query="select distinct partenza from tratta where data_ora>=current_timestamp and tipo_mezzo= ? and posti_disponibili>0";
        try{
            PreparedStatement st=connection.prepareStatement(query);
            st.setString(1,tipoMezzo.toString());
            ResultSet rs=st.executeQuery();
            while (rs.next()){
                partenze.add(rs.getString("partenza"));

            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return partenze.toArray(String[]::new);
    }

    @Override
    public String[] getDestinazioni(Tratta.mezzi tipoMezzo, String partenza) {
        List<String> destinazioni = new ArrayList<>();
        String query="select distinct destinazione from tratta where data_ora>=current_timestamp and tipo_mezzo= ? and posti_disponibili>0 and partenza=?";
        try{
            PreparedStatement st=connection.prepareStatement(query);
            st.setString(1,tipoMezzo.toString());
            st.setString(2, partenza);
            ResultSet rs=st.executeQuery();
            while (rs.next()){
                destinazioni.add(rs.getString("destinazione"));

            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return destinazioni.toArray(String[]::new);
    }

    @Override
    public JsonElement findByPrimaryKey(String id) {
        Tratta tratta = null;
        JsonElement ob = null;
        String query="select * from tratta where id=?";
        try{
            PreparedStatement st=connection.prepareStatement(query);
            st.setString(1,id);

            ResultSet rs=st.executeQuery();
            if (rs.next()){
                tratta = new TrattaProxy(connection);
                tratta.setId(rs.getString("id"));
                tratta.setPartenza(rs.getString("partenza"));
                tratta.setDestinazione(rs.getString("destinazione"));
                tratta.setTipoMezzo(Tratta.mezzi.valueOf(rs.getString("tipo_mezzo").trim()));
                tratta.setCapienza(rs.getInt("capienza"));
                tratta.setBigliettiScontati(rs.getInt("numero_biglietti_scontati"));

                tratta.setDataOra(rs.getTimestamp("data_ora").toLocalDateTime());
                tratta.setPrezzo(rs.getBigDecimal("prezzo"));
                tratta.setSconto(rs.getInt("sconto"));

                tratta.setPostiDisponibili(rs.getInt("posti_disponibili"));
                ob = tratta.toJson();
                ob.getAsJsonObject().addProperty("venditore", rs.getString("nome_venditore"));
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return ob;
    }

    @Override
    public Map<String,String> getPartenzeDestinazioni() {
        Map<String, String> partenzeDestinazioni = new HashMap<>();
        String query="select  partenza, destinazione from tratta t ";
        try{
            PreparedStatement st=connection.prepareStatement(query);
            ResultSet rs=st.executeQuery();
            while (rs.next()){
                partenzeDestinazioni.put(rs.getString("partenza"), rs.getString("destinazione"));
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return partenzeDestinazioni;
    }

    @Override
    public Map<String, List<String>> getPartenzeDestinazioniVenditori() {
        Map<String,String> partenzeDestinazioni = getPartenzeDestinazioni();
        Map<String, List<String>> partenzeDestinazioniVenditori = new HashMap<>();
        String query="select distinct nome_venditore from tratta where partenza=? and destinazione=? ";
        try{
            PreparedStatement st=connection.prepareStatement(query);
            for (Map.Entry<String, String> entry : partenzeDestinazioni.entrySet()) {
                st.setString(1, entry.getKey());
                st.setString(2, entry.getValue());
                ResultSet rs=st.executeQuery();
                List<String> venditori = new ArrayList<>();
                while (rs.next()){
                    venditori.add(rs.getString("nome_venditore"));
                }
                partenzeDestinazioniVenditori.put(entry.getKey()+"-"+entry.getValue(), venditori);
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return partenzeDestinazioniVenditori;
    }

    @Override
    public Venditore getVenditore(String id) {
        Venditore venditore=new VenditoreProxy(connection);
        String query="select nome_società, password, indirizzo_email, ban from venditore, tratta where id=? and nome_venditore=venditore.nome_società";
        try{
            PreparedStatement st=connection.prepareStatement(query);
            st.setString(1,id);
            ResultSet rs=st.executeQuery();
            if (rs.next()){
                venditore.setNomeSocieta(rs.getString("nome_società"));
                venditore.setPassword(rs.getString("password"));
                venditore.setIndirizzoEmail(rs.getString("indirizzo_email"));
                venditore.setBan(rs.getBoolean("ban"));
                return venditore;
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return venditore;
    }

    @Override
    public Tratta[] getTratteAttiveDiUnVenditoreLazy(String nomeVenditore) {
        List<Tratta> tratte = new ArrayList<>();
        String query = "SELECT * FROM tratta WHERE nome_venditore = ? AND data_ora > NOW() ORDER BY data_ora";
        try{
            PreparedStatement st=connection.prepareStatement(query);
            st.setString(1, nomeVenditore);

            ResultSet rs=st.executeQuery();
            while (rs.next()){
                Tratta tratta=new TrattaProxy(connection);
                tratta.setId(rs.getString("id"));
                tratta.setPartenza(rs.getString("partenza"));
                tratta.setDestinazione(rs.getString("destinazione"));
                tratta.setTipoMezzo(Tratta.mezzi.valueOf(rs.getString("tipo_mezzo").trim()));
                tratta.setCapienza(rs.getInt("capienza"));
                tratta.setBigliettiScontati(rs.getInt("numero_biglietti_scontati"));

                tratta.setPrezzo(rs.getBigDecimal("prezzo"));
                tratta.setSconto(rs.getInt("sconto"));

                tratta.setDataOra(rs.getTimestamp("data_ora").toLocalDateTime());
                tratta.setPostiDisponibili(rs.getInt("posti_disponibili"));
                tratte.add(tratta);
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return tratte.toArray(Tratta[]::new);
    }

    @Override
    public Tratta[] getTratteDiUnVenditoreLazy(String partenza, String destinazione, String nomeVenditore) {
        List<Tratta> tratte = new ArrayList<>();
        String query="select *  from tratta where  partenza=? and destinazione=? and nome_venditore=? order by data_ora";
        try{
            PreparedStatement st=connection.prepareStatement(query);
            st.setString(1,partenza);
            st.setString(2,destinazione);
            st.setString(3, nomeVenditore);

            ResultSet rs=st.executeQuery();
            while (rs.next()){
                Tratta tratta=new TrattaProxy(connection);
                tratta.setId(rs.getString("id"));
                tratta.setPartenza(rs.getString("partenza"));
                tratta.setDestinazione(rs.getString("destinazione"));
                tratta.setTipoMezzo(Tratta.mezzi.valueOf(rs.getString("tipo_mezzo").trim()));
                tratta.setCapienza(rs.getInt("capienza"));
                tratta.setBigliettiScontati(rs.getInt("numero_biglietti_scontati"));

                tratta.setPrezzo(rs.getBigDecimal("prezzo"));
                tratta.setSconto(rs.getInt("sconto"));

                tratta.setDataOra(rs.getTimestamp("data_ora").toLocalDateTime());
                tratta.setPostiDisponibili(rs.getInt("posti_disponibili"));
                tratte.add(tratta);
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return tratte.toArray(Tratta[]::new);
    }

    @Override
    public void modifica(String id, Tratta tratta) {
        String query="update tratta set id=?, tipo_mezzo=?, capienza=?, data_ora=?, posti_disponibili=?,  partenza=? ,destinazione=?, prezzo=?, sconto=?, numero_biglietti_scontati=? where id=?";
        try{
            PreparedStatement st=connection.prepareStatement(query);
            st.setString(1,tratta.getId());
            st.setString(2,tratta.getTipoMezzo().toString());
            st.setInt(3,tratta.getCapienza());
            st.setTimestamp(4, Timestamp.valueOf(tratta.getDataOra()));
            st.setInt(5,tratta.getPostiDisponibili());
            st.setString(6,tratta.getPartenza());
            st.setString(7,tratta.getDestinazione());
            st.setBigDecimal(8, tratta.getPrezzo());
            st.setInt(9, tratta.getSconto());
            st.setInt(10, tratta.getBigliettiScontati());
            st.setString(11,id);
            st.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public void elimina(String id) {
        String query="delete from tratta where id=?";
        try{
            PreparedStatement st=connection.prepareStatement(query);
            st.setString(1,id);
            st.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public void salva(Tratta tratta, String nomeVenditore) {
        String query="insert into tratta(id, partenza, destinazione, tipo_mezzo, capienza, data_ora, posti_disponibili, nome_venditore, prezzo, sconto, numero_biglietti_scontati) values(?,?,?,?,?,?,?,?, ?, ?, ?)";
        try{
            PreparedStatement st=connection.prepareStatement(query);
            st.setString(1,tratta.getId());
            st.setString(2,tratta.getPartenza());
            st.setString(3,tratta.getDestinazione());
            st.setString(4, tratta.getTipoMezzo().toString());
            st.setInt(5,tratta.getCapienza());
            st.setTimestamp(6,Timestamp.valueOf(tratta.getDataOra()));
            st.setInt(7,tratta.getPostiDisponibili());
            st.setString(8,nomeVenditore);
            st.setBigDecimal(9, tratta.getPrezzo());
            st.setInt(10, tratta.getSconto());
            st.setInt(11, tratta.getBigliettiScontati());
            st.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }

    }

    @Override
    public int getNumeroTratteOfferteDaVenditore(String nomeSocieta) {
        int count=0;
        String query="select count(*) as result from venditore, tratta  where nome_società=?" +
                " and nome_venditore=venditore.nome_società";
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
    public int getCapienzaTratta(String trattaID) {
        int capienza=0;
        String query="select capienza from tratta where id=?";
        try{
            PreparedStatement st=connection.prepareStatement(query);
            st.setString(1,trattaID);
            ResultSet rs=st.executeQuery();
            if(rs.next())
                capienza=rs.getInt("capienza");

        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return capienza;
    }
    @Override
    public HashMap<String, List<Integer>> getNumeroDiVenditeBigliettiPerAnno(int anno) {
        HashMap<String, List<Integer>> counts=new HashMap<>();
        String query="select sum(capienza-posti_disponibili) as result, tr.nome_venditore, tr.tipo_mezzo from tratta as tr where " +
                "   DATE(tr.data_ora) between ? and ? group by tr.nome_venditore, tr.tipo_mezzo";
        try{
            PreparedStatement st=connection.prepareStatement(query);
            st.setDate(1,java.sql.Date.valueOf(anno+"-01-01"));
            st.setDate(2,java.sql.Date.valueOf(anno+"-12-31"));
            ResultSet rs=st.executeQuery();
            while(rs.next()) {
                String nomeVenditore=rs.getString("nome_venditore");
                int numeroBiglietti=rs.getInt("result");
                if(!counts.containsKey(nomeVenditore))
                    counts.put(nomeVenditore,new java.util.ArrayList<>());
                counts.get(nomeVenditore).add(numeroBiglietti);
            }VenditoreDao venditoreDao= DBManager.getInstance().getVenditoreDao();
            List<String> venditori=venditoreDao.getNomiVenditori();
            for(String venditore:venditori){
                if(!counts.containsKey(venditore))
                    counts.put(venditore,new java.util.ArrayList<>());
                counts.get(venditore).add(0);
                counts.get(venditore).add(0);
                counts.get(venditore).add(0);

            }

        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return counts;
    }

    @Override
    public void aggiornaPostiScontatiDisponibili(String id, int postiScontatiOccupati) {
        String query="update tratta set numero_biglietti_scontati=numero_biglietti_scontati-? where id=?";
        try{
            PreparedStatement st=connection.prepareStatement(query);
            st.setInt(1,postiScontatiOccupati);
            st.setString(2,id);
            st.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }
}



