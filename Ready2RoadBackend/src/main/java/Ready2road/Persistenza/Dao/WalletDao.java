package Ready2road.Persistenza.Dao;

import Ready2road.Persistenza.Model.Wallet;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

import java.math.BigDecimal;

public interface WalletDao {
    void save(Wallet wallet);
    JsonElement getSaldo(String email);
    Wallet getWalletUtente(String email);
    Wallet getWalletVenditore(String email);
    void setPunti(String email);
    void updateSaldo(Long idWallet, BigDecimal saldo);
    void addPunti(String email, BigDecimal punti);
    void addBuono(String codice, String nome, BigDecimal valore);
}
