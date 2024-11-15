package Ready2road.Controller;

import Ready2road.Persistenza.DBManager;
import Ready2road.Persistenza.Dao.AdminDao;
import Ready2road.Persistenza.Dao.UtenteDao;
import Ready2road.Persistenza.Dao.VenditoreDao;
import Ready2road.Persistenza.Dao.WalletDao;
import Ready2road.Persistenza.Model.Venditore;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("http://localhost:4200/")
public class ServiziVenditore {
    @PostMapping("/BannaVenditore")
    public void bannaVenditore(@RequestBody String id, HttpServletRequest req, HttpServletResponse resp){
        JsonObject jsonObject = JsonParser.parseString(id).getAsJsonObject();
        String indirizzoEmail = jsonObject.get("nomeSocieta").getAsString();
        VenditoreDao venditoreDao= DBManager.getInstance().getVenditoreDao();
        venditoreDao.banna(indirizzoEmail);
    }
    @PostMapping("/EliminaVenditore")
    public void eliminaVenditore(@RequestBody String id, HttpServletRequest req, HttpServletResponse resp){
        JsonObject jsonObject = JsonParser.parseString(id).getAsJsonObject();
        String nomeSocieta = jsonObject.get("nomeSocieta").getAsString();
        VenditoreDao venditoreDao= DBManager.getInstance().getVenditoreDao();
        venditoreDao.elimina(nomeSocieta);
    }
    @GetMapping("/venditori")
    public String getTuttiiVenditori(){
        Gson gson=new Gson();
        VenditoreDao venditoreDao= DBManager.getInstance().getVenditoreDao();
        List<Venditore> venditori=venditoreDao.findAlLazy();
        JsonArray jsonArray=new JsonArray();
        for(Venditore venditore:venditori){

            jsonArray.add(venditore.toJson());
        }
        return jsonArray.toString();
    }
    @PostMapping("/ModificaVenditore")
    public void modificaVenditore(@RequestBody String body, HttpServletRequest req, HttpServletResponse resp){
        JsonObject jsonObject = JsonParser.parseString(body).getAsJsonObject();
        Gson gson=new Gson();
        String nomeSocieta = jsonObject.get("nomeSocieta").getAsString();
        Venditore venditore=gson.fromJson(jsonObject.get("venditore"),Venditore.class);
        VenditoreDao venditoreDao= DBManager.getInstance().getVenditoreDao();
        venditoreDao.modifica(nomeSocieta,venditore);
    }
    @GetMapping("/venditore")
    public String controllaEmailGiaPresente(HttpServletRequest req){
        String email=req.getParameter("email");
        String nomeSocieta=req.getParameter("nomeSocieta");
        boolean value=true;
        VenditoreDao venditoreDao=DBManager.getInstance().getVenditoreDao();
        if(venditoreDao.isVenditorePresente(email, nomeSocieta) ){
            value=false;
        }
        Gson gson=new Gson();
        return gson.toJson(value);
    }
    @GetMapping("/getWalletVenditore")
    public String getWalletVenditore(HttpServletRequest req){
        String email=req.getParameter("email");
        WalletDao walletDao= DBManager.getInstance().getWalletDao();
        return walletDao.getWalletVenditore(email).toJson().toString();
    }
}