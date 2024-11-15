package Ready2road.Persistenza.Dao;

import Ready2road.Persistenza.Model.Tappe;

import java.util.List;

public interface TappeDao {
    public Tappe getTappe(String id);

    void salva(String id, List<String> tappeList);
}
