package Ready2road.Persistenza.Dao;

import Ready2road.Persistenza.Model.Conversazione;
import Ready2road.Persistenza.Model.Messaggio;

import java.util.List;

public interface ConversazioneDao {

    List<Conversazione> getConversazioniAdmin(String username);

    List<Messaggio> getMessaggiDiUnaConversazione(String nomeConversazione);

    Conversazione findConversazione(String conversazione);

    List<Conversazione> getConversazioniUtente(String indirizzoEmail);

    Conversazione creaConversazioneUtenteVenditore(String nomeSocieta, String indirizzoEmail);

    Conversazione creaConversazioneUtenteAdmin(String username, String indirizzoEmail);

    void eliminaConversazione(String nomeConversazione);

    List<Conversazione> getConversazioniVenditore(String nomeSocieta);
}
