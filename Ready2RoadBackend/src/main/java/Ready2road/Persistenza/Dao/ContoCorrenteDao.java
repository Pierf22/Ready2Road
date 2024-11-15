package Ready2road.Persistenza.Dao;

import Ready2road.Persistenza.Model.MetodiPagamento.ContoCorrente;

import java.util.List;

public interface ContoCorrenteDao {
    int getNumeroTotaleConti();

    List<ContoCorrente> getUserConto(Long idWallet);

    void removeConto(String iban);

    void addConto(String iban, String nome, String banca);
}
