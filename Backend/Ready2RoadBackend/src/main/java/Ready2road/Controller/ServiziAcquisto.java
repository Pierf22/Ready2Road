package Ready2road.Controller;

import Ready2road.Persistenza.DBManager;
import Ready2road.Persistenza.Dao.*;
import Ready2road.Persistenza.Model.Biglietto;
import Ready2road.Persistenza.Model.Tratta;
import Ready2road.Persistenza.Model.Wallet;
import com.google.gson.JsonElement;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.sql.SQLOutput;
import java.sql.Timestamp;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;


@RestController
@CrossOrigin("http://localhost:4200/")
public class ServiziAcquisto {
    @GetMapping("/generaBiglietto")
    public String acquistaBiglietto(HttpServletRequest req){


        //prendi da dati idandata, idritorno, dataacquisto, utente, nome, cognome, cf
        //scadenza la ricavi da tratta, posto lo generi e numero generi
        TrattaDao trattaDao= DBManager.getInstance().getTrattaDao();
        JsonElement tratta=trattaDao.findByPrimaryKey(req.getParameter("andata"));

        LocalDateTime dataOra = LocalDateTime.parse(tratta.getAsJsonObject().get("data_ora").getAsString(),  DateTimeFormatter.ISO_DATE_TIME);

        Timestamp SCADENZA = Timestamp.valueOf(dataOra);

        BigliettoDao bigliettoDao= DBManager.getInstance().getBigliettoDao();

        Instant istanteCorrente = Instant.now();

        // Crea un oggetto Timestamp dall'istante corrente
        Timestamp adesso = Timestamp.from(istanteCorrente);

        if(trattaDao.findByPrimaryKey(req.getParameter("andata")).getAsJsonObject().get("sconto").getAsInt()>0){
            trattaDao.aggiornaPostiScontatiDisponibili(req.getParameter("andata"), 1);
        }
        Biglietto ba = bigliettoDao.generaBiglietto(req.getParameter("andata"), adesso, SCADENZA ,req.getParameter("email"), req.getParameter("nome"), req.getParameter("cognome"), req.getParameter("CF"), -1);

        bigliettoDao.salvaBiglietto(ba, req.getParameter("andata"), req.getParameter("email"));
        if(req.getParameter("ritorno").equals("")){
            return "ok";
        }

        //se ci sono i dati del ritorno genero il biglietto

        tratta=trattaDao.findByPrimaryKey(req.getParameter("ritorno"));

        dataOra = LocalDateTime.parse(tratta.getAsJsonObject().get("data_ora").getAsString(),  DateTimeFormatter.ISO_DATE_TIME);

        SCADENZA = Timestamp.valueOf(dataOra);

        if(trattaDao.findByPrimaryKey(req.getParameter("ritorno")).getAsJsonObject().get("sconto").getAsInt()>0){
            trattaDao.aggiornaPostiScontatiDisponibili(req.getParameter("ritorno"), 1);
        }

        Biglietto br = bigliettoDao.generaBiglietto(req.getParameter("ritorno"), adesso, SCADENZA ,req.getParameter("email"), req.getParameter("nome"), req.getParameter("cognome"), req.getParameter("CF"), -1);

        bigliettoDao.salvaBiglietto(br, req.getParameter("ritorno"), req.getParameter("email"));


        return "ok";
    }

    @GetMapping("/scalaDenaro")
    public String scalaDenaro(HttpServletRequest req){
        //gestisci la transazione

        TransazioneDao transazioneDao = DBManager.getInstance().getTransazioneDao();
        WalletDao walletDao = DBManager.getInstance().getWalletDao();
        Wallet wallet = walletDao.getWalletUtente(req.getParameter("email"));
        BigDecimal prezzo = new BigDecimal(req.getParameter("prezzo"));
        transazioneDao.addTransazione(wallet.getId(), prezzo.negate(), null);
        //aggiunge i punti al wallet ma getpunti torna null

        walletDao.addPunti(req.getParameter("email"), prezzo.divide(new BigDecimal(10)));

        walletDao.updateSaldo(wallet.getId(), wallet.getSaldo().subtract(prezzo));

        TrattaDao trattaDao = DBManager.getInstance().getTrattaDao();
        String nomeVenditore = trattaDao.findByPrimaryKey(req.getParameter("tratta")).getAsJsonObject().get("venditore").getAsString();
        VenditoreDao venditoreDao = DBManager.getInstance().getVenditoreDao();
        Wallet walletVenditore = walletDao.getWalletUtente(venditoreDao.findByNome(nomeVenditore).getIndirizzoEmail());

        walletDao.updateSaldo(walletVenditore.getId(), walletVenditore.getSaldo().add(prezzo));
        //walletDao.addSaldo(walletVenditore.getId(), prezzo);

        transazioneDao.addTransazione(walletVenditore.getId(), prezzo, null);


        return "ok";
    }

    @GetMapping("/aggiungiDenaro")
    public String aggiungiDenaro(HttpServletRequest req){
        WalletDao walletDao = DBManager.getInstance().getWalletDao();
        Wallet wallet = walletDao.getWalletUtente(req.getParameter("email"));
        BigDecimal prezzo = new BigDecimal(req.getParameter("prezzo"));

        walletDao.updateSaldo(wallet.getId(), wallet.getSaldo().add(prezzo));
        return "ok";
    }
}