package Ready2road.Controller;

import Ready2road.Persistenza.DBManager;
import Ready2road.Persistenza.Dao.TrattaDao;
import Ready2road.Persistenza.Model.Tratta;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

@CrossOrigin(origins = "http://localhost:4200/")
@RestController
public class RicercaController {
    //mi restituisce il risultato della ricerca utente
    @GetMapping("/ricerca")
    public String effettuaRicerca(@RequestParam("mezzo") String mezzo, @RequestParam("andataRitorno") String andataRitorno, @RequestParam("partenza") String partenza, @RequestParam("destinazione") String destinazione, @RequestParam("dataPartenza") String dataPartenza, @RequestParam("dataRitorno") String dataRitorno, @RequestParam("numeroPasseggeri") String numeroPasseggeri) {
        Date dataP = null, dataR = null;
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        try {
            dataP = dateFormat.parse(dataPartenza);
            if(!dataRitorno.equals("ValoreDiDefault")){
                dataR = dateFormat.parse(dataRitorno);
            }
        } catch(ParseException e){
            e.printStackTrace();
        }

        // ricerca biglietti andata
        TrattaDao tratta = DBManager.getInstance().getTrattaDao();
        Tratta[] tratte = getTratte(mezzo, andataRitorno, partenza, destinazione, dataP, numeroPasseggeri, tratta);

        JsonArray tratteArray = new JsonArray();
        tratteArray.add(createJSON(tratte));

        // ricerca biglietti ritorno
        if(!dataRitorno.equals("ValoreDiDefault")){
            tratte = getTratte(mezzo, andataRitorno, destinazione, partenza, dataR, numeroPasseggeri, tratta);
            tratteArray.add(createJSON(tratte));
        }
        return tratteArray.toString();
    }

    public Tratta[] getTratte(String mezzo, String andataRitorno, String partenza, String destinazione, Date data, String numeroPasseggeri, TrattaDao tratta){
        Tratta[] tratte = null;
        if(mezzo.equals("aereo")) {
            tratte = tratta.getTratteLazy(partenza, destinazione, data, Tratta.mezzi.AEREO);
        } else if(mezzo.equals("autobus")) {
            tratte = tratta.getTratteLazy(partenza, destinazione, data, Tratta.mezzi.BUS);
        } else if(mezzo.equals("treno")) {
            tratte = tratta.getTratteLazy(partenza, destinazione, data, Tratta.mezzi.TRENO);
        }
        return tratte;
    }

    public JsonArray createJSON(Tratta[] tratte){
        JsonArray tratteArray = new JsonArray();
        for (Tratta t : tratte) {
            JsonObject trattaJson = new JsonObject();
            trattaJson.addProperty("idTratta",t.getId());
            trattaJson.addProperty("dataOra", t.getDataOra().toString());
            trattaJson.addProperty("partenza", t.getPartenza());
            trattaJson.addProperty("destinazione", t.getDestinazione());
            trattaJson.addProperty("tipoMezzo", t.getTipoMezzo().toString());
            trattaJson.addProperty("venditore", t.getVenditore().getNomeSocieta());
            trattaJson.addProperty("capienza", t.getCapienza());
            trattaJson.addProperty("postiDisponibili", t.getPostiDisponibili());
            trattaJson.addProperty("prezzo",t.getPrezzo());
            trattaJson.addProperty("collapse",false);
            tratteArray.add(trattaJson);
        }
        return tratteArray;
    }

    //mi restituisce tutte le partenze disponibili per un certo mezzo di trasporto
    @GetMapping("/partenze")
    public String getPartenze(@RequestParam("mezzo") String mezzo) {
        TrattaDao tratta = DBManager.getInstance().getTrattaDao();
        String[] partenze = null;
        if(mezzo.equals("aereo")) {
            partenze = tratta.getPartenze(Tratta.mezzi.AEREO);
        } else if(mezzo.equals("autobus")) {
            partenze = tratta.getPartenze(Tratta.mezzi.BUS);
        } else if(mezzo.equals("treno")) {
            partenze = tratta.getPartenze(Tratta.mezzi.TRENO);
        }
        JsonArray partenzeArray = new JsonArray();
        for (String p : partenze) {
            JsonObject partenzaJson = new JsonObject();
            partenzaJson.addProperty("partenza", p);
            partenzeArray.add(partenzaJson);
        }
        return partenzeArray.toString();
    }

    //mi restituisce tutte le destinazioni disponibili per un certo mezzo di trasporto e una certa partenza
    @GetMapping("/destinazioni")
    public String getDestinazioni(@RequestParam("mezzo") String mezzo, @RequestParam("partenza") String partenza) {
        TrattaDao tratta = DBManager.getInstance().getTrattaDao();
        String[] destinazioni = null;
        if(mezzo.equals("aereo")) {
            destinazioni = tratta.getDestinazioni(Tratta.mezzi.AEREO, partenza);
        } else if(mezzo.equals("autobus")) {
            destinazioni = tratta.getDestinazioni(Tratta.mezzi.BUS, partenza);
        } else if(mezzo.equals("treno")) {
            destinazioni = tratta.getDestinazioni(Tratta.mezzi.TRENO, partenza);
        }
        JsonArray destinazioniArray = new JsonArray();
        for (String d : destinazioni) {
            JsonObject destinazioneJson = new JsonObject();
            destinazioneJson.addProperty("destinazione", d);
            destinazioniArray.add(destinazioneJson);
        }
        return destinazioniArray.toString();
    }
}
