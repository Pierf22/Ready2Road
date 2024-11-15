package Ready2road.Persistenza.Dao.Postgres;

import Ready2road.Persistenza.Dao.BigliettoDao;
import Ready2road.Persistenza.IdBrokers.IdBrokerBiglietto;
import Ready2road.Persistenza.IdBrokers.IdBrokerMessaggio;
import Ready2road.Persistenza.Model.Biglietto;
import Ready2road.Persistenza.Model.Tratta;
import Ready2road.Persistenza.Model.Utente;

import java.sql.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;

public class BigliettoDaoPostgres implements BigliettoDao {
    Connection connection;

    public BigliettoDaoPostgres(Connection connection) {
        this.connection = connection;
    }

    @Override
    public int getNumeroTotaleDiBigliettiVenduti() {
        int count=0;
        String query="select count(*) as result from biglietto where utente is not null";
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
    public int getNumeroTotaleDiBigliettiInvenduti() {
        int count=0;
        String query="select count(*) as result from biglietto where utente is null and scadenza<CURRENT_DATE";
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
    public List<Biglietto> getBigliettiDiUnUtente(String email) {
        List<Biglietto> biglietti=new ArrayList<>();
        String query="select * from biglietto, tratta where utente=? and biglietto.tratta=tratta.id";
        try{
            PreparedStatement st=connection.prepareStatement(query);
            st.setString(1,email);
            ResultSet rs=st.executeQuery();
            while(rs.next()){
                Biglietto biglietto=new BigliettoProxy(connection);
                Tratta tratta=new TrattaProxy(connection);
                biglietto.setNumero(rs.getString("numero"));
                biglietto.setPosto(rs.getInt("posto"));
                biglietto.setDataAcquisto(rs.getTimestamp("data_ora_acquisto").toLocalDateTime());
                biglietto.setScadenza(rs.getTimestamp("scadenza").toLocalDateTime());
                biglietto.setNome(rs.getString("nome"));
                biglietto.setCognome(rs.getString("cognome"));
                biglietto.setCf(rs.getString("cf"));

                tratta.setId(rs.getString("id"));
                tratta.setPartenza(rs.getString("partenza"));
                tratta.setDestinazione(rs.getString("destinazione"));
                tratta.setTipoMezzo(Tratta.mezzi.valueOf(rs.getString("tipo_mezzo")));
                tratta.setCapienza(rs.getInt("capienza"));
                tratta.setDataOra(rs.getTimestamp("data_ora").toLocalDateTime());
                tratta.setPostiDisponibili(rs.getInt("posti_disponibili"));
                biglietto.setTratta(tratta);


                biglietti.add(biglietto);
            }

        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return biglietti;
    }

    @Override
    public Integer getNumeroBigliettiDiUnUtente(String email) {
        Integer count=0;
        String query="select count(*) as result from biglietto where utente=?";
        try{
            PreparedStatement st=connection.prepareStatement(query);
            st.setString(1,email);
            ResultSet rs=st.executeQuery();
            if(rs.next())
                count=rs.getInt("result");

        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return count;
    }

    @Override
    public int getNumeroBigliettiVendutiVenditore(String nomeSocieta) {
        int count=0;
        String query="select count(*) as result from venditore, tratta, biglietto where nome_società=?" +
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

    @Override
    public HashMap<String, Integer> getStatisticheBiglietti(String nomeSocieta) {
        HashMap<String, Integer> counts=new HashMap<>();
        String bigliettiInvenduti="select sum(capienza-tratta.posti_disponibili) as result from venditore, tratta where nome_società=? and nome_venditore=venditore.nome_società " +
                "and data_ora<now() ";
        String bigliettiInVendita="select sum(capienza-tratta.posti_disponibili) as result from venditore, tratta where nome_società=? and nome_venditore=venditore.nome_società " +
                "and data_ora>now() ";


        try{
            counts.put("Biglietti venduti",getNumeroBigliettiVendutiVenditore(nomeSocieta));
            PreparedStatement st=connection.prepareStatement(bigliettiInvenduti);
            st.setString(1,nomeSocieta);
            ResultSet rs=st.executeQuery();
            if(rs.next() )
                counts.put("Biglietti invenduti",rs.getInt("result"));
            st=connection.prepareStatement(bigliettiInVendita);
            st.setString(1,nomeSocieta);
            rs=st.executeQuery();
            if(rs.next() )
                counts.put("Biglietti in vendita",rs.getInt("result"));

        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return counts;
    }

    @Override
    public HashMap<String, List<Integer>> getNumeroBigliettiVendutiAnno(String nomeSocieta, int anno) {
        HashMap<String, List<Integer>> counts = new LinkedHashMap<>();

// Inizializza la mappa con 12 mesi, ognuno con una lista di tre valori per ogni tipo di mezzo
        for (int mese = 1; mese <= 12; mese++) {
            List<Integer> values = new ArrayList<>();
            for (int i = 0; i < Tratta.mezzi.values().length; i++) {
                values.add(0);
            }
            counts.put(numeroAMese(mese), values);
        }

        String query = "SELECT COUNT(*) AS result, EXTRACT(MONTH FROM data_ora_acquisto) AS mese, tipo_mezzo " +
                "FROM venditore, tratta, biglietto " +
                "WHERE nome_società=? " +
                "AND nome_venditore=venditore.nome_società " +
                "AND id=biglietto.tratta " +
                "AND DATE(biglietto.data_ora_acquisto) BETWEEN ? AND ? " +
                "GROUP BY EXTRACT(MONTH FROM data_ora_acquisto), tipo_mezzo";

        try {
            PreparedStatement st = connection.prepareStatement(query);
            st.setString(1, nomeSocieta);
            st.setDate(2, java.sql.Date.valueOf(anno + "-01-01"));
            st.setDate(3, java.sql.Date.valueOf(anno + "-12-31"));
            ResultSet rs = st.executeQuery();
            while (rs.next()) {
                int mese = rs.getInt("mese");
                Tratta.mezzi mezzo = Tratta.mezzi.valueOf(rs.getString("tipo_mezzo"));
                int result = rs.getInt("result");
                // Ottieni la lista di valori per il mese corrente e aggiorna il valore del tipo di mezzo corrente
                counts.get(numeroAMese(mese)).set(mezzo.ordinal(), result);
            }

        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return counts;

    }

    @Override
    public Biglietto generaBiglietto(String trattaId, Timestamp dataOraAcquisto, Timestamp scadenza, String indirizzoEmailUtente, String nome, String cognome, String cf, int posto) {
        if(posto==-1){
            posto=IdBrokerBiglietto.getPosto(trattaId);
        }
        Biglietto biglietto=new BigliettoProxy(connection);
        biglietto.setNumero(trattaId+"/"+posto);
        biglietto.setPosto(posto);
        biglietto.setDataAcquisto(dataOraAcquisto.toLocalDateTime());
        biglietto.setScadenza(scadenza.toLocalDateTime());
        biglietto.setNome(nome);
        biglietto.setCognome(cognome);
        biglietto.setCf(cf);
        return biglietto;

    }



    @Override
    public void salvaBiglietto(Biglietto biglietto, String trattaId, String indirizzoEmailUtente) {
        String query="insert into biglietto(numero, tratta, posto, data_ora_acquisto, scadenza, utente, nome, cognome, cf) values(?,?,?,?,?,?,?,?,?)";
        try{
            PreparedStatement st=connection.prepareStatement(query);
            st.setString(1,biglietto.getNumero());
            st.setString(2,trattaId);
            st.setInt(3,biglietto.getPosto());
            st.setTimestamp(4,Timestamp.valueOf(biglietto.getDataAcquisto()));
            st.setTimestamp(5,Timestamp.valueOf(biglietto.getScadenza()));
            st.setString(6,indirizzoEmailUtente);
            st.setString(7,biglietto.getNome());
            st.setString(8,biglietto.getCognome());
            st.setString(9,biglietto.getCf());
            st.executeUpdate();

        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public List<Integer> getPostiOccupati(String trattaID) {
        List<Integer> postiOccupati=new ArrayList<>();
        String query="select posto from biglietto where tratta=?";
        try{
            PreparedStatement st=connection.prepareStatement(query);
            st.setString(1,trattaID);
            ResultSet rs=st.executeQuery();
            while(rs.next()){
                postiOccupati.add(rs.getInt("posto"));
            }

        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return postiOccupati;
    }

    String numeroAMese(int numero) {
        return switch (numero) {
            case 1 -> "Gennaio";
            case 2 -> "Febbraio";
            case 3 -> "Marzo";
            case 4 -> "Aprile";
            case 5 -> "Maggio";
            case 6 -> "Giugno";
            case 7 -> "Luglio";
            case 8 -> "Agosto";
            case 9 -> "Settembre";
            case 10 -> "Ottobre";
            case 11 -> "Novembre";
            case 12 -> "Dicembre";
            default -> "Numero non valido";
        };
    }


}
