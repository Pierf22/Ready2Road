package Ready2road.Controller;

import Ready2road.Persistenza.DBManager;
import Ready2road.Persistenza.Dao.Postgres.TappeDaoPostgres;
import Ready2road.Persistenza.Dao.TappeDao;
import Ready2road.Persistenza.Dao.TrattaDao;
import Ready2road.Persistenza.Model.Tappe;
import Ready2road.Persistenza.Model.Tratta;
import Ready2road.Persistenza.Model.Venditore;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@CrossOrigin("http://localhost:4200/")
public class ServiziTratte {
    @GetMapping("/partenzeDestinazioni")
    public String getPartenzeDestinazioni(HttpServletRequest req){
        TrattaDao trattaDao= DBManager.getInstance().getTrattaDao();
        Gson gson=new Gson();
return gson.toJson(trattaDao.getPartenzeDestinazioniVenditori());

    }

    @GetMapping("/tratte/{id}/venditore")
    public String getVenditore(HttpServletRequest req, @PathVariable String id){

        TrattaDao trattaDao= DBManager.getInstance().getTrattaDao();
        Venditore venditore=trattaDao.getVenditore(id);
        return venditore.toJson().toString();
    }
    @GetMapping("/tratte")
    public String getTratteVenditore(HttpServletRequest req){
        String partenza=req.getParameter("partenza");
        String destinazione=req.getParameter("destinazione");
        String nomeVenditore=req.getParameter("nomeSocieta");
        TrattaDao trattaDao= DBManager.getInstance().getTrattaDao();
        Tratta[] tratte=new Tratta[0];
        if(nomeVenditore==null){
             tratte=trattaDao.getTratteLazy(partenza,destinazione);

        }else {
            tratte=trattaDao.getTratteDiUnVenditoreLazy(partenza,destinazione, nomeVenditore);
        }
        JsonArray jsonArray=new JsonArray();
        for (Tratta tratta:tratte){
            jsonArray.add(tratta.toJson());
        }
        return jsonArray.toString();
    }
    @PostMapping("/ModificaTratta")
    public void modificaTratta(@RequestBody String data, HttpServletRequest req, HttpServletResponse resp){
        Gson gson=new Gson();
        JsonObject jsonObject=gson.fromJson(data,JsonObject.class);
        String id=jsonObject.get("id").getAsString();
        Tratta tratta=new Tratta(jsonObject.get("tratta").getAsJsonObject());
        TrattaDao trattaDao= DBManager.getInstance().getTrattaDao();
        trattaDao.modifica(id,tratta);
    }
    @PostMapping("/EliminaTratta")
    public void eliminaTratta(@RequestBody String data, HttpServletRequest req, HttpServletResponse resp){
        Gson gson=new Gson();
        JsonObject jsonObject=gson.fromJson(data,JsonObject.class);
        String id=jsonObject.get("id").getAsString();
        TrattaDao trattaDao= DBManager.getInstance().getTrattaDao();
        trattaDao.elimina(id);
    }

    @PostMapping("/AggiungiTratta")
    public void aggiungiTratta(@RequestBody String data, HttpServletRequest req, HttpServletResponse resp){
        Gson gson=new Gson();
        JsonObject jsonObject=gson.fromJson(data,JsonObject.class);
        String nomeVenditore=jsonObject.get("nomeVenditore").getAsString();

        Tratta tratta=new Tratta(jsonObject);
        TrattaDao trattaDao= DBManager.getInstance().getTrattaDao();
        TappeDao tappeDao= DBManager.getInstance().getTappeDao();
        trattaDao.salva(tratta, nomeVenditore);
        JsonArray jsonArray=jsonObject.get("tappeIntermedie").getAsJsonArray();
        List<String> tappeList=new ArrayList<>();
        for (int i=0;i<jsonArray.size();i++){
            tappeList.add(jsonArray.get(i).getAsString());
        }
        tappeDao.salva(tratta.getId(), tappeList);
    }

    @GetMapping("/tracciamento/{id}")
    public String getTratta(HttpServletRequest req, @PathVariable String id){
        TrattaDao trattaDao = DBManager.getInstance().getTrattaDao();
        JsonElement ob = trattaDao.findByPrimaryKey(id);

        if(ob != null)
            return ob.toString();

        return null;
    }

    @GetMapping("/tappe/{id}")
    public String getTappe(HttpServletRequest req, @PathVariable String id){
        TappeDao tappeDao = DBManager.getInstance().getTappeDao();
        Tappe tappe = tappeDao.getTappe(id);

        if(tappe != null)
            return tappe.toJson().toString();

        return null;
    }

    @GetMapping("/tratteAttive")
    public String getTratteAttiveVenditore(HttpServletRequest req){
        String nomeVenditore=req.getParameter("nomeVenditore");
        TrattaDao trattaDao= DBManager.getInstance().getTrattaDao();
        Tratta[] tratte=new Tratta[0];
        tratte=trattaDao.getTratteAttiveDiUnVenditoreLazy(nomeVenditore);
        JsonArray jsonArray=new JsonArray();
        for (Tratta tratta:tratte){
            jsonArray.add(tratta.toJson());
        }
        return jsonArray.toString();
    }

    @GetMapping("/trattaDaID")
    public String getTrattaDaID(HttpServletRequest req){
        String idTratta=req.getParameter("IdTratta");
        TrattaDao trattaDao= DBManager.getInstance().getTrattaDao();
        return trattaDao.findByPrimaryKey(idTratta).toString();
    }
}
