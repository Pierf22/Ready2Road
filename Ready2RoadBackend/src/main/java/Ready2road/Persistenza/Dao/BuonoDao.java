package Ready2road.Persistenza.Dao;

import Ready2road.Persistenza.Model.MetodiPagamento.Buono;
import com.google.gson.JsonObject;

import java.util.List;

public interface BuonoDao {
    public List<Buono> getBuono(Long idWallet);
    public Buono findByPrimaryKey(String codice);
    public void rimuoviBuono(String codice);
}
