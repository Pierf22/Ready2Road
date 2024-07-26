package Ready2road.Controller;

import Ready2road.Persistenza.DBManager;
import Ready2road.Persistenza.Dao.BigliettoDao;
import Ready2road.Persistenza.Dao.Postgres.BigliettoDaoPostgres;
import Ready2road.Persistenza.Dao.Postgres.TappeDaoPostgres;
import Ready2road.Persistenza.Dao.TappeDao;
import Ready2road.Persistenza.Dao.TrattaDao;
import Ready2road.Persistenza.Dao.UtenteDao;
import Ready2road.Persistenza.Model.*;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;


import java.util.ArrayList;
import java.util.List;

@RestController
@CrossOrigin("http://localhost:4200/")
public class ServiziOfferte {

    @GetMapping("/trovaOfferte")
    public String trovaOfferte(@RequestParam("email") String utente){


        Tratta partenzaObj = new Tratta();
        Tratta destinazioneObj = new Tratta();


        BigliettoDao bigliettoDao= DBManager.getInstance().getBigliettoDao();
        List<Biglietto> biglietti=bigliettoDao.getBigliettiDiUnUtente(utente);

        TrattaDao trattaDao= DBManager.getInstance().getTrattaDao();

        //crea ashmap con chiave partenza e destinazione e valore contatore
        Map<String,Integer> map=new HashMap<>();
        for(Biglietto biglietto:biglietti){
            Tratta tratta=biglietto.getTratta();
            String key=tratta.getPartenza()+"-"+tratta.getDestinazione();
            if(map.containsKey(key)){
                map.put(key,map.get(key)+1);
            }else{
                map.put(key,1);
            }
        }
        //prendi la chiave con il valore più alto
        Integer max=0;
        String chiave="";
        for(String key:map.keySet()){
            if(map.get(key)>max){
                max=map.get(key);
                chiave=key;
            }
        }
        //se non ci sono biglietti
        if(max==0){
            System.out.println("non ci sono biglietti");
            return null;
        }
        //se ci sono biglietti dividi la chiave in partenza e destinazione
        String[] parti=chiave.split("-");
        String partenza=parti[0];
        String destinazione=parti[1];
        //cerca le tratte con partenza e destinazione e che abbiano dei bilgietti scontati
        Tratta[] tratte=trattaDao.getTratteLazy(partenza,destinazione);
        LocalDateTime now=LocalDateTime.now();
        Boolean found=false;
        LocalDateTime partenzaDataOra = LocalDateTime.now();
        for(Tratta tratta:tratte){
            if(tratta.getDataOra().isAfter(now) && tratta.getPostiDisponibili()>0){
                partenzaObj=tratta;
                found=true;
                partenzaDataOra = tratta.getDataOra();
                break;
            }
        }
        if(!found){
            System.out.println("non ci sono tratte andata disponibili a partire da "+ partenza+ " per "+destinazione);
            return null;
        }
        found=false;
        tratte=trattaDao.getTratteLazy(destinazione,partenza);
        for(Tratta tratta:tratte){
            if(tratta.getDataOra().isAfter(partenzaDataOra.plusDays(1)) && tratta.getPostiDisponibili()>0){
                destinazioneObj=tratta;
                found=true;
                break;
            }
        }
        if(!found){
            System.out.println("non ci sono tratte ritorno disponibili a partire da "+ destinazione+ " per "+partenza);
            return null;
        }
        JsonObject tratta = createJSON(partenzaObj,destinazioneObj);
        System.out.println("tratte trovate");
        return tratta.toString();
    }

    public JsonObject createJSON(Tratta partenza, Tratta destinazione){


        JsonObject trattaJson = new JsonObject();
        trattaJson.addProperty("idPartenza", partenza.getId());
        trattaJson.addProperty("dataOraPartenza", partenza.getDataOra().toString());
        trattaJson.addProperty("partenzaPartenza", partenza.getPartenza());
        trattaJson.addProperty("destinazionePartenza", partenza.getDestinazione());
        trattaJson.addProperty("tipoMezzoPartenza", partenza.getTipoMezzo().toString());
        trattaJson.addProperty("venditorePartenza", partenza.getVenditore().getNomeSocieta());
        trattaJson.addProperty("capienzaPartenza", partenza.getCapienza());
        trattaJson.addProperty("postiDisponibiliPartenza", partenza.getPostiDisponibili());
        trattaJson.addProperty("prezzoPartenza",partenza.getPrezzo());
        trattaJson.addProperty("scontoPartenza",partenza.getSconto());
        trattaJson.addProperty("bigliettiScontatiPartenza",partenza.getBigliettiScontati());

        trattaJson.addProperty("idDestinazione", destinazione.getId());
        trattaJson.addProperty("dataOraDestinazione", destinazione.getDataOra().toString());
        trattaJson.addProperty("partenzaDestinazione", destinazione.getPartenza());
        trattaJson.addProperty("destinazioneDestinazione", destinazione.getDestinazione());
        trattaJson.addProperty("tipoMezzoDestinazione", destinazione.getTipoMezzo().toString());
        trattaJson.addProperty("venditoreDestinazione", destinazione.getVenditore().getNomeSocieta());
        trattaJson.addProperty("capienzaDestinazione", destinazione.getCapienza());
        trattaJson.addProperty("postiDisponibiliDestinazione", destinazione.getPostiDisponibili());
        trattaJson.addProperty("prezzoDestinazione",destinazione.getPrezzo());
        trattaJson.addProperty("scontoDestinazione",destinazione.getSconto());
        trattaJson.addProperty("bigliettiScontatiDestinazione",destinazione.getBigliettiScontati());

        return trattaJson;
    }
}