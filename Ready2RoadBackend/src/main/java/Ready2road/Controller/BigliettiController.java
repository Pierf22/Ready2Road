package Ready2road.Controller;

import Ready2road.Persistenza.DBManager;
import Ready2road.Persistenza.Dao.Postgres.BigliettoDaoPostgres;
import Ready2road.Persistenza.Dao.Postgres.TrattaDaoPostgres;
import Ready2road.Persistenza.Model.Biglietto;
import Ready2road.Persistenza.Model.Tratta;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

@CrossOrigin(origins = "http://localhost:4200/")
@RestController
public class BigliettiController {

    @GetMapping("/biglietti")
    public String getBiglietti(@RequestParam("utente") String utente) {
        BigliettoDaoPostgres biglietto = new BigliettoDaoPostgres(DBManager.getInstance().getConnection());
        List<Biglietto> biglietti = biglietto.getBigliettiDiUnUtente(utente);

        JsonArray bigliettiArray = createJSON(biglietti);

        return bigliettiArray.toString();
    }

    public JsonArray createJSON(List<Biglietto> biglietti){
        JsonArray bigliettiArray = new JsonArray();
        for (Biglietto b : biglietti) {
            JsonObject bigliettoJson = new JsonObject();
            bigliettoJson.addProperty("id", b.getNumero());
            bigliettoJson.addProperty("idTratta", b.getTratta().getId());
            bigliettoJson.addProperty("scadenza", b.getScadenza().toString());
            bigliettoJson.addProperty("dataAcquisto", b.getDataAcquisto().toString());
            bigliettoJson.addProperty("partenza", b.getTratta().getPartenza());
            bigliettoJson.addProperty("destinazione", b.getTratta().getDestinazione());
            bigliettoJson.addProperty("venditore", b.getTratta().getVenditore().getNomeSocieta());
            bigliettoJson.addProperty("posto", b.getPosto());
            bigliettoJson.addProperty("tipoMezzo", b.getTratta().getTipoMezzo().toString());
            bigliettoJson.addProperty("nome", b.getNome());
            bigliettoJson.addProperty("cognome", b.getCognome());
            bigliettoJson.addProperty("codiceFiscale", b.getCf());
            bigliettoJson.addProperty("collapse", false);
            bigliettiArray.add(bigliettoJson);
        }
        return bigliettiArray;
    }
}
