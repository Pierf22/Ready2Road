package Ready2road.Controller;

import Ready2road.Persistenza.DBManager;
import Ready2road.Persistenza.Dao.*;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import jakarta.mail.*;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.Properties;
import java.util.Random;

@CrossOrigin(origins = "http://localhost:4200/")
@RestController
public class AreaPersonaleController {
    @GetMapping("/areapersonale/getNumeroTicket/{email}")
    public String getNumeroTicket(@PathVariable String email){
        //prendo il numero di biglietti dell'utente
        BigliettoDao bigliettoDao=DBManager.getInstance().getBigliettoDao();
        JsonElement ob = new JsonObject();
        ob.getAsJsonObject().addProperty("size", (bigliettoDao.getNumeroBigliettiDiUnUtente(email)));

        return ob.toString();
    }

    @GetMapping("/areapersonale/getSaldo/{email}")
    public String getSaldo(@PathVariable String email){
        //prendo il saldo dell'utente
        WalletDao wallet = DBManager.getInstance().getWalletDao();
        JsonElement ob = wallet.getSaldo(email);

        return ob.toString();
    }

    @GetMapping("/areapersonale/getNumeroTransazioni/{email}")
    public String getNumeroTransizioni(@PathVariable String email){
        //prendo il numero di transazioni dell'utente
        TransazioneDao transazioneDao = DBManager.getInstance().getTransazioneDao();
        JsonElement ob = new JsonObject();
        ob.getAsJsonObject().addProperty("transazioni", transazioneDao.getTransazioniUtente(email));

        return ob.toString();
    }

    @GetMapping("/areapersonale/generateGiftCard/{email}")
    public void generateGiftCard(@PathVariable String email){
        //genero la gift card
        String codice = generaCodice(); //genero il codice
        int valoreBuono = generaValoreBuono(); //genero il valore del buono

        //abbasso i punti acquisto dell'utente dal wallet
        WalletDao walletDao = DBManager.getInstance().getWalletDao();
        walletDao.setPunti(email);

        //inserisco il buono generato nel db
        MetodoPagamentoDao metodoPagamentoDao = DBManager.getInstance().getMetodoPagamentoDao();
        String nome = metodoPagamentoDao.addBuono(codice, valoreBuono, email);
        walletDao.addBuono(codice, nome, BigDecimal.valueOf(valoreBuono));

        this.sendEmail(codice, valoreBuono, email);    //mando l'email con il buono
    }

    @GetMapping("/areapersonale/getTratteVenditore/{nome}")
    public int getTratteVenditore(@PathVariable String nome){
        //prendo il numero delle tratte vendute dal venditore
        TrattaDao trattaDao = DBManager.getInstance().getTrattaDao();

        return trattaDao.getNumeroTratteOfferteDaVenditore(nome);
    }

    @GetMapping("/areapersonale/logout")
    public void logout(HttpServletRequest req){
        //invalido la sessione per effettuare il logout
        HttpSession session = req.getSession(false);
        if(session != null)
            session.invalidate();
    }

    protected String generaCodice() {
        // Definisco il caratteri consentiti nel codice
        String caratteriConsentiti = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

        // Ottiengo il timestamp attuale in secondi
        long timestamp = Instant.now().getEpochSecond();

        // Converto il timestamp in una stringa esadecimale
        String timestampHex = Long.toHexString(timestamp);

        // Se la stringa esadecimale è troppo lunga, prendo solo gli ultimi 4 caratteri
        if (timestampHex.length() > 4)
            timestampHex = timestampHex.substring(timestampHex.length() - 4);

        // Creo un oggetto SecureRandom per generare numeri casuali in modo sicuro
        SecureRandom random = new SecureRandom();

        // Inizializzo una StringBuilder per costruire il codice
        StringBuilder codiceBuilder = new StringBuilder(8);

        // Aggiungo la parte compressa del timestamp al codice
        codiceBuilder.append(timestampHex);

        // Genero altri 4 caratteri casuali
        for (int i = 0; i < 4; i++) {
            int index = random.nextInt(caratteriConsentiti.length());
            char carattereCasuale = caratteriConsentiti.charAt(index);
            codiceBuilder.append(carattereCasuale);
        }

        return codiceBuilder.toString();
    }   //funzione per generare codice alfanumerico della gift card
    protected int generaValoreBuono() {
        // Creare un oggetto Random
        Random random = new Random();

        // Genera un numero casuale tra 1 e 100
        int probabilita = random.nextInt(100) + 1;

        // Determina il valore del buono in base alle probabilità date
        if (probabilita <= 40)
            return 5;
        else if (probabilita <= 40 + 28)
            return 10;
        else if (probabilita <= 40 + 28 + 17)
            return 20;
        else if (probabilita <= 40 + 28 + 17 + 12)
            return 50;
        else
            return 100;
    }   //genero il valore del buono
    protected void sendEmail(String codice, int valore, String email) {
        String emailGoogle = "YOUR GOOGLE EMAIL";   //email account
        String password = "YOUR GOOGLE PASSWORD";    //password per app non password account

        //parametri di configurazione, uso gmail
        Properties properties = new Properties();
        properties.put("mail.smtp.host", "smtp.gmail.com");
        properties.put("mail.smtp.port", "587");
        properties.put("mail.smtp.auth", "true");
        properties.put("mail.smtp.starttls.enable", "true");

        //autenticazione dell'account gmail per l'invio dell'email con servizio smtp di gmail
        Authenticator authenticator = new Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(emailGoogle, password);
            }
        };

        //creazione della sessione per l'invio dell'email
        Session session = Session.getInstance(properties, authenticator);

        try {
            // Contenuto dell'email
            String emailContent = "Gentile cliente,\n\n"
                    + "Ecco i dettagli della sua gift card!\n\n"
                    + "Codice del buono: " + codice + "\n"
                    + "Valore del buono: " + valore + "€\n\n"
                    + "Grazie per aver scelto i nostri servizi.\n"
                    + "Buon shopping!\n\n"
                    + "Cordiali saluti,\n"
                    + "Ready2Road";

            // Creazione del messaggio email
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress("YOUR GOOGLE EMAIL"));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(email));
            message.setSubject("Gift Card Ready2Road");
            message.setText(emailContent);

            // Invio dell'email
            Transport.send(message);

        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }
}
