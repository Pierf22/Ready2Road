package Ready2road.Persistenza.Dao;

import Ready2road.Persistenza.Model.Transazione;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

import java.math.BigDecimal;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

public interface TransazioneDao {
    Integer getNumeroTotaleDiTransazioni();

    HashMap<String, Integer> getNumeroDiTransazioniPerMetodoDiPagamento();


    BigDecimal getRendimentiInUnGapDiDate(Date inizio, Date fine);

    Integer getTransazioniUtente(String email);

    JsonObject getAllUtente(Long walletID);

    void addTransazione(Long idWallet, BigDecimal valore, String metodoPagamento);

    void addTransazioneBiglietto(Long idWallet, BigDecimal valore, String metodoPagamento, List<String> biglietto);

    void azzeraSaldo(Long idWallet, BigDecimal valore, String metodoPagamento);

    void deleteTransazione(String nome);

    int getNumeroTransazioniWallet(String nomeSocieta);

    BigDecimal getRendimentiInUnGapDiDateSingoloVenditore(Date inizio, Date fine, String nomeSocieta);
}
