package Ready2road.Controller;

import Ready2road.Persistenza.DBManager;
import Ready2road.Persistenza.Dao.*;
import Ready2road.Persistenza.Model.MetodiPagamento.Buono;
import Ready2road.Persistenza.Model.MetodiPagamento.CartaPagamento;
import Ready2road.Persistenza.Model.MetodiPagamento.ContoCorrente;
import Ready2road.Persistenza.Model.Wallet;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.List;

@CrossOrigin(origins = "http://localhost:4200/")
@RestController
public class WalletController {

    @GetMapping("/wallet/getWallet/{email}")
    public String getWallet(@PathVariable String email) {
        WalletDao walletDao = DBManager.getInstance().getWalletDao();
        JsonElement jsonElement = new JsonObject();

        //prendo il wallet dell'utente
        Wallet wallet = walletDao.getWalletUtente(email);

        if(wallet != null) {
            jsonElement.getAsJsonObject().addProperty("id", wallet.getId());
            jsonElement.getAsJsonObject().addProperty("saldo", wallet.getSaldo());
        }

        return jsonElement.toString();
    }

    @GetMapping("/wallet/getTransazioni/{id}")
    public String getTransazioni(@PathVariable String id) {
        //prendo le transazioni dell'utente
        if(id.equals("null"))
            return new JsonObject().toString();

        TransazioneDao transazione = DBManager.getInstance().getTransazioneDao();
        return transazione.getAllUtente(Long.valueOf(id)).toString();
    }

    @GetMapping("/wallet/getBuoni/{id}")
    public String getBuoni(@PathVariable String id){
        //prendo tutte le informazioni sui buoni dell'utente
        if(id.equals("null"))
            return new JsonObject().toString();

        BuonoDao buonoDao = DBManager.getInstance().getBuonoDao();
        List<Buono> buoni = buonoDao.getBuono(Long.valueOf(id));
        JsonElement jsonElement;
        JsonObject jsonObject = new JsonObject();
        int i = 1;

        for(Buono buono : buoni){
            jsonElement = new JsonObject();
            jsonElement.getAsJsonObject().addProperty("codice", buono.getCodice());
            jsonElement.getAsJsonObject().addProperty("valore", buono.getValore());
            jsonObject.add(String.valueOf(i), jsonElement);
            i++;
        }
        return jsonObject.toString();
    }

    @GetMapping("/wallet/getMetodiPagamento/{id}")
    public String getMetodiPagamento(@PathVariable String id){
        //prendo tutte le informazioni sui metodi di pagamento dell'utente
        if(id.equals("null"))
            return new JsonObject().toString();

        //prendo le carte di pagamento dell'utente
        CartaPagamentoDao cartaPagamentoDao = DBManager.getInstance().getCartaPagamentoDao();
        List<CartaPagamento> carte = cartaPagamentoDao.getUserCard(Long.valueOf(id));
        JsonElement jsonElement;
        JsonObject jsonObject = new JsonObject();
        int i = 1;

        for(CartaPagamento carta : carte){
            jsonElement = new JsonObject();
            jsonElement.getAsJsonObject().addProperty("nome", carta.getMetodoPagamento().getNome());
            jsonElement.getAsJsonObject().addProperty("numero", carta.getNumero());
            jsonElement.getAsJsonObject().addProperty("scadenza", carta.getDataScadenza().toString());
            jsonElement.getAsJsonObject().addProperty("cvc", carta.getCvc());
            jsonObject.add(("carta" + i), jsonElement);
            i++;
        }

        //prendo i conti correnti dell'utente
        ContoCorrenteDao contoCorrenteDao = DBManager.getInstance().getContoCorrenteDao();
        List<ContoCorrente> conti = contoCorrenteDao.getUserConto(Long.valueOf(id));
        i = 1;

        for (ContoCorrente conto : conti){
            jsonElement = new JsonObject();
            jsonElement.getAsJsonObject().addProperty("nome", conto.getMetodoPagamento().getNome());
            jsonElement.getAsJsonObject().addProperty("iban", conto.getIban());
            jsonElement.getAsJsonObject().addProperty("banca", conto.getBanca());
            jsonObject.add(("conto" + i), jsonElement);
            i++;
        }

        return jsonObject.toString();
    }

    @GetMapping ("/wallet/prelevo/{id}/{valore}/{metodoPagamento}")
    public void prelevo(@PathVariable Long id, @PathVariable BigDecimal valore, @PathVariable String metodoPagamento){
        //metodo per effettuare un'operazione di prelevamento dal wallet, in pratica preleva tutto il saldo dal wallet ad un metodo di pagamento indicato
        WalletDao walletDao = DBManager.getInstance().getWalletDao();
        walletDao.updateSaldo(id, BigDecimal.valueOf(0));

        TransazioneDao transazioneDao = DBManager.getInstance().getTransazioneDao();
        transazioneDao.azzeraSaldo(id, valore, metodoPagamento);
    }

    @GetMapping("/wallet/deposito/{id}/{valore}/{metodoPagamento}/{saldo}")
    public void deposito(@PathVariable Long id, @PathVariable BigDecimal valore, @PathVariable String metodoPagamento, @PathVariable BigDecimal saldo){
        //metodo per effettuare un'operazione di deposito nel wallet
        WalletDao walletDao = DBManager.getInstance().getWalletDao();
        walletDao.updateSaldo(id, saldo.add(valore));

        TransazioneDao transazioneDao = DBManager.getInstance().getTransazioneDao();
        transazioneDao.addTransazione(id, valore, metodoPagamento);
    }

    @GetMapping("/wallet/remove/{nome}")
    public void remove(@PathVariable String nome){
        //metodo per rimuovere un metodo di pagamento, carta di pagamento o conto corrente
        if(nome.contains("carta")) {
            CartaPagamentoDao cartaPagamentoDao = DBManager.getInstance().getCartaPagamentoDao();
            cartaPagamentoDao.removeCarta(nome);
        }
        else {
            ContoCorrenteDao contoCorrenteDao = DBManager.getInstance().getContoCorrenteDao();
            contoCorrenteDao.removeConto(nome);
        }
        //elimina anche tutte le transazioni associate al metodo di pagamento eliminato
        TransazioneDao transazioneDao = DBManager.getInstance().getTransazioneDao();
        transazioneDao.deleteTransazione(nome);
        //infine la elimina anche dalla tabella dei metodi di pagamento
        MetodoPagamentoDao metodoPagamentoDao = DBManager.getInstance().getMetodoPagamentoDao();
        metodoPagamentoDao.removeMetodoPagamento(nome);
    }

    @GetMapping("/wallet/add/{id}/{nome}/{numero}/{scadenza}/{cvv}")
    public void add(@PathVariable Long id, @PathVariable String nome, @PathVariable String numero, @PathVariable String scadenza, @PathVariable String cvv){
        //metodo per aggiungere un metodo di pagamento, carta di pagamento o conto corrente
        MetodoPagamentoDao metodoPagamentoDao = DBManager.getInstance().getMetodoPagamentoDao();
        nome = metodoPagamentoDao.addMetodoPagamento(nome, id);

        //aggiunge il metodo di pagamento, carta di pagamento o conto corrente
        if(nome.contains("carta")) {
            CartaPagamentoDao cartaPagamentoDao = DBManager.getInstance().getCartaPagamentoDao();
            cartaPagamentoDao.addCarta(numero, nome, cvv, scadenza);
        }
        else {
            ContoCorrenteDao contoCorrenteDao = DBManager.getInstance().getContoCorrenteDao();
            contoCorrenteDao.addConto(numero, nome, cvv);
        }
    }

}
