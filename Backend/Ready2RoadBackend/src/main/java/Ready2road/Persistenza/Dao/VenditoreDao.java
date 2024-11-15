package Ready2road.Persistenza.Dao;

import Ready2road.Persistenza.Model.Venditore;

import java.util.List;

public interface VenditoreDao {
    int getNumeroTotaleDiVenditori();

    List<String> getNomiVenditori();

    boolean changePassword(String email, String password);
    boolean isEmailPresent(String email);
    boolean isNomePresent(String email);

    boolean isVenditorePresente(String email, String nomeSocieta);

    void registraVenditore(Venditore venditore);
    List<Venditore> findAlLazy();
    Venditore findByPrimaryKey(String indirizzoEmail, String password);
    Venditore findByNome(String nomeSocieta);

    void modifica(String nomeSocieta, Venditore venditore);

    void elimina(String nomeSocieta);

    void banna(String nomeSocieta);
    Boolean eBannato(String nomeSocieta);

    int getNumeroClientiPerVenditore(String nomeSocieta);
}
