package Ready2road.Controller;

import Ready2road.Persistenza.DBManager;
import Ready2road.Persistenza.Dao.BuonoDao;
import Ready2road.Persistenza.Dao.ConversazioneDao;
import Ready2road.Persistenza.Dao.MessaggioDao;
import Ready2road.Persistenza.Model.Conversazione;
import Ready2road.Persistenza.Model.Messaggio;
import Ready2road.Persistenza.Model.MetodiPagamento.Buono;
import Ready2road.Util.PusherUtil;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@CrossOrigin("http://localhost:4200/")
public class ServiziSconti {
    @GetMapping("getSconto")
    public String getSconto(HttpServletRequest req){
        String codice=req.getParameter("codice");
        BuonoDao buonoDao= DBManager.getInstance().getBuonoDao();
        Buono buono=buonoDao.findByPrimaryKey(codice);
        JsonElement jsonElement = new JsonObject();
        jsonElement.getAsJsonObject().addProperty("valore", buono.getValore());
        return jsonElement.toString();
    }

    @GetMapping("eliminaBuono")
    public void eliminaBuono(HttpServletRequest req){
        String codice=req.getParameter("buono");
        BuonoDao buonoDao= DBManager.getInstance().getBuonoDao();
        buonoDao.rimuoviBuono(codice);
    }
}