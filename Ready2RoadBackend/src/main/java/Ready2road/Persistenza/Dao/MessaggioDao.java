package Ready2road.Persistenza.Dao;

import Ready2road.Persistenza.Model.Messaggio;

public interface MessaggioDao {
    Long creaMessaggio(String testo, String mittente, String conversazione, String data);

    Messaggio findMessaggio(Long id);
}
