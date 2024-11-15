package Ready2road.Persistenza.Dao;

import Ready2road.Persistenza.Model.Utente;

import java.util.List;

public interface UtenteDao {
    int getNumeroTotaleDiUtenti();
    boolean isUtentePresente(String email);
    void registraUtente(Utente utente);

    List<Utente> findAlLazy();
    Utente findByPrimaryKey(String username, String password);

    boolean changePassword(String email, String password);
    boolean isEmailPresent(String email);

    void modifica(String email, Utente nuovoUtente);
    void elimina(String email);

    void banna(String email);
    Boolean eBannato(String indirizzoEmail);
}
