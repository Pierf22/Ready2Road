package Ready2road.Persistenza.Dao;

import Ready2road.Persistenza.Model.Tratta;
import Ready2road.Persistenza.Model.Venditore;
import com.google.gson.JsonElement;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public interface TrattaDao {
    Tratta[] getTratteLazy(String partenza, String destinazione, Date dataPartenza, Tratta.mezzi tipoMezzo);
    Tratta[] getTratteLazy(String partenza, String destinazione);
    String [] getPartenze(Tratta.mezzi tipoMezzo);
    String[] getDestinazioni(Tratta.mezzi tipoMezzo, String partenza);
    JsonElement findByPrimaryKey(String id);

    void aggiornaPostiScontatiDisponibili(String id, int postiScontatiOccupati);

    Map<String,String> getPartenzeDestinazioni();
    Map<String, List<String>> getPartenzeDestinazioniVenditori();

    Venditore getVenditore(String id);

    Tratta[] getTratteDiUnVenditoreLazy(String partenza, String destinazione, String nomeVenditore);
    Tratta [] getTratteAttiveDiUnVenditoreLazy(String nomeVenditore);
    void modifica(String id, Tratta tratta);
    void elimina(String id);

    void salva(Tratta tratta, String nomeVenditore);

    int getNumeroTratteOfferteDaVenditore(String nomeSocieta);

    int getCapienzaTratta(String trattaID);
    public HashMap<String, List<Integer>> getNumeroDiVenditeBigliettiPerAnno(int anno);
}
