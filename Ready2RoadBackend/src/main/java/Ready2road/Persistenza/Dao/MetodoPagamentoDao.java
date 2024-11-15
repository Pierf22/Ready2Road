package Ready2road.Persistenza.Dao;

public interface MetodoPagamentoDao {

    void removeMetodoPagamento(String nome);

    String addMetodoPagamento(String nome, Long idWallet);

    String addBuono(String codice, int valore, String email);
}
