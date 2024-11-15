package Ready2road.Persistenza.Dao;

import Ready2road.Persistenza.Model.MetodiPagamento.CartaPagamento;

import java.util.Date;
import java.util.List;

public interface CartaPagamentoDao {
    int getNumeroTotaleDiCarte();

    List<CartaPagamento> getUserCard(Long idWallet);

    void removeCarta(String numero);

    void addCarta(String numero, String nome, String cvv, String dataScadenza);
}
