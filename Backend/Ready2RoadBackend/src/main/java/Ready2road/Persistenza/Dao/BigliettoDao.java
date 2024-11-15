package Ready2road.Persistenza.Dao;

import Ready2road.Persistenza.Model.Biglietto;
import Ready2road.Persistenza.Model.Tratta;
import Ready2road.Persistenza.Model.Utente;

import java.sql.Timestamp;
import java.util.HashMap;
import java.util.List;

public interface BigliettoDao {
    int getNumeroTotaleDiBigliettiVenduti();

    int getNumeroTotaleDiBigliettiInvenduti();
    List<Biglietto> getBigliettiDiUnUtente(String email);

    Integer getNumeroBigliettiDiUnUtente(String email);

    int getNumeroBigliettiVendutiVenditore(String nomeSocieta);

    HashMap<String, Integer> getStatisticheBiglietti(String nomeSocieta);

    HashMap<String, List<Integer>> getNumeroBigliettiVendutiAnno(String nomeSocieta, int anno);
    Biglietto generaBiglietto(String trattaId, Timestamp dataOraAcquisto, Timestamp scadenza, String indirizzoEmailUtente, String nome, String cognome, String cf, int posto);

    void salvaBiglietto(Biglietto biglietto, String trattaId, String indirizzoEmailUtente);

    List<Integer> getPostiOccupati(String trattaID);
}
