package Ready2road.Controller;

import Ready2road.Persistenza.DBManager;
import Ready2road.Persistenza.Dao.AdminDao;
import Ready2road.Persistenza.Dao.UtenteDao;
import Ready2road.Persistenza.Dao.VenditoreDao;
import Ready2road.Persistenza.Dao.WalletDao;
import Ready2road.Persistenza.Model.Utente;
import Ready2road.Persistenza.Model.Wallet;
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
public class ServiziUtente {
    @PostMapping("/BannaUtente")
    public void bannaUtente(@RequestBody String id, HttpServletRequest req, HttpServletResponse resp){
        JsonObject jsonObject = JsonParser.parseString(id).getAsJsonObject();
        String indirizzoEmail = jsonObject.get("indirizzoEmail").getAsString();
        UtenteDao utenteDao= DBManager.getInstance().getUtenteDao();
        utenteDao.banna(indirizzoEmail);
    }
    @PostMapping("/EliminaUtente")
    public void eliminaUtente(@RequestBody String id, HttpServletRequest req, HttpServletResponse resp){
        JsonObject jsonObject = JsonParser.parseString(id).getAsJsonObject();
        String indirizzoEmail = jsonObject.get("indirizzoEmail").getAsString();
        UtenteDao utenteDao= DBManager.getInstance().getUtenteDao();
        utenteDao.elimina(indirizzoEmail);
    }
    @GetMapping("/utente")
    public String controllaEmailGiaPresente(HttpServletRequest req){
        String email=req.getParameter("email");
        boolean value=true;
        UtenteDao utenteDao= DBManager.getInstance().getUtenteDao();
        if(utenteDao.isUtentePresente(email) ){
            value=false;
        }
        Gson gson=new Gson();
        return gson.toJson(value);
    }
    @GetMapping("/utenti")
    public String getTuttiGliUtenti(){
        Gson gson=new Gson();
        UtenteDao utenteDao= DBManager.getInstance().getUtenteDao();
        List<Utente> utenti=utenteDao.findAlLazy();
        JsonArray jsonArray=new JsonArray();
        for(Utente utente:utenti){

            jsonArray.add(utente.toJson());
        }
        return jsonArray.toString();
    }
    @PostMapping("/ModificaUtente")
    public void modificaUtente(@RequestBody String body, HttpServletRequest req, HttpServletResponse resp){
        JsonObject jsonObject = JsonParser.parseString(body).getAsJsonObject();
        Gson gson=new Gson();
        String indirizzoEmail = jsonObject.get("indirizzoEmail").getAsString();
        Utente utente=gson.fromJson(jsonObject.get("utente"),Utente.class);
        UtenteDao utenteDao= DBManager.getInstance().getUtenteDao();
        utenteDao.modifica(indirizzoEmail,utente);
    }
    @GetMapping("/getWalletUtente")
    public String getWalletUtente(HttpServletRequest req){
        String email=req.getParameter("email");
        WalletDao walletDao= DBManager.getInstance().getWalletDao();
        return walletDao.getWalletUtente(email).toJson().toString();
    }

}
