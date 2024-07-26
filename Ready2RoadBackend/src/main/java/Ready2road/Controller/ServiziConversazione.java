package Ready2road.Controller;

import Ready2road.Persistenza.DBManager;
import Ready2road.Persistenza.Dao.ConversazioneDao;
import Ready2road.Persistenza.Dao.MessaggioDao;
import Ready2road.Persistenza.Model.Conversazione;
import Ready2road.Persistenza.Model.Messaggio;
import Ready2road.Util.PusherUtil;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.pusher.rest.Pusher;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@RestController
@CrossOrigin("http://localhost:4200/")
public class ServiziConversazione {
    @GetMapping("conversazioni/Admin")
    public String getConversazioniAdmin(HttpServletRequest req){
        String username=req.getParameter("username");
        ConversazioneDao conversazioneDao= DBManager.getInstance().getConversazioneDao();
        JsonArray jsonArray=new JsonArray();
        List<Conversazione> conversaziones=conversazioneDao.getConversazioniAdmin(username);
        for (Conversazione conversazione:conversaziones){
            jsonArray.add(conversazione.toJson());
        }
        return jsonArray.toString();
    }
    @GetMapping("conversazioni/Venditore")
    public String getConversazioniVenditore(HttpServletRequest req){
        String nomeSocieta=req.getParameter("nomeSocieta");
        ConversazioneDao conversazioneDao= DBManager.getInstance().getConversazioneDao();
        JsonArray jsonArray=new JsonArray();
        List<Conversazione> conversaziones=conversazioneDao.getConversazioniVenditore(nomeSocieta);
        for (Conversazione conversazione:conversaziones){
            jsonArray.add(conversazione.toJson());
        }
        return jsonArray.toString();
    }
    @GetMapping("messaggi")
    public String getMessaggiDiUnaConversazione(HttpServletRequest req){
        String nomeConversazione=req.getParameter("conversazione");
        ConversazioneDao conversazioneDao= DBManager.getInstance().getConversazioneDao();
        List<Messaggio> conversazione=conversazioneDao.getMessaggiDiUnaConversazione(nomeConversazione);
        JsonArray jsonArray=new JsonArray();
        for (Messaggio messaggio:conversazione){
            jsonArray.add(messaggio.toJson());
        }
        return jsonArray.toString();
    }
    @PostMapping("inviaMessaggio")
    public void inviaMessaggio(@RequestBody String data, HttpServletRequest req, HttpServletResponse resp){
        Gson gson=new Gson();
        JsonObject jsonObject=gson.fromJson(data,JsonObject.class);
        MessaggioDao messaggioDao= DBManager.getInstance().getMessaggioDao();
        Long id=messaggioDao.creaMessaggio(jsonObject.get("testo").getAsString(),jsonObject.get("mittente").getAsString(),jsonObject.get("conversazione").getAsString(), jsonObject.get("data").getAsString());
        Messaggio messaggio=messaggioDao.findMessaggio(id);
        PusherUtil.getInstance().inviaEvento(jsonObject.get("conversazione").getAsString(), "messaggio", messaggio.toJson());


    }
    @GetMapping("conversazioni/Utente")
    public String getConversazioniUtente(HttpServletRequest req){
        String indirizzoEmail=req.getParameter("indirizzoEmail");
        ConversazioneDao conversazioneDao= DBManager.getInstance().getConversazioneDao();
        JsonArray jsonArray=new JsonArray();
        List<Conversazione> conversaziones=conversazioneDao.getConversazioniUtente(indirizzoEmail);
        for (Conversazione conversazione:conversaziones){
            jsonArray.add(conversazione.toJson());
        }
        return jsonArray.toString();
    }
    @GetMapping("creaConversazioneUtenteVenditore")
    public String creaConversazioneUtenteVenditore(HttpServletRequest req){
        String nomeSocieta=req.getParameter("nomeSocieta");
        String indirizzoEmail=req.getParameter("indirizzoEmail");
        ConversazioneDao conversazioneDao=DBManager.getInstance().getConversazioneDao();
        Conversazione conversazione=conversazioneDao.creaConversazioneUtenteVenditore(nomeSocieta, indirizzoEmail);
        PusherUtil.getInstance().inviaEvento(nomeSocieta,"nuovaConversazione", conversazione.toJson() );
        return conversazione.toJson().toString();
    }
    @GetMapping("/creaConversazioneUtenteAdmin")
    public String creaConversazioneUtenteAdmin(HttpServletRequest req){
        String username=req.getParameter("username");
        String indirizzoEmail=req.getParameter("indirizzoEmail");
        ConversazioneDao conversazioneDao=DBManager.getInstance().getConversazioneDao();
        Conversazione conversazione=conversazioneDao.creaConversazioneUtenteAdmin(username, indirizzoEmail);
        PusherUtil.getInstance().inviaEvento(username,"nuovaConversazione",conversazione.toJson() );

        return conversazione.toJson().toString();
    }
    @GetMapping("/eliminaConversazione")
    public void eliminaConversazione(HttpServletRequest req){
        String nomeConversazione=req.getParameter("nome");
        String altroPartecipante=req.getParameter("altroPartecipante");
        ConversazioneDao conversazioneDao=DBManager.getInstance().getConversazioneDao();
        conversazioneDao.eliminaConversazione(nomeConversazione);
        PusherUtil.getInstance().inviaEvento(altroPartecipante,"eliminaConversazione", nomeConversazione );

    }

}
