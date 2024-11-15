package Ready2road.Controller;

import Ready2road.Persistenza.DBManager;
import Ready2road.Persistenza.Dao.UtenteDao;
import Ready2road.Persistenza.Dao.VenditoreDao;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class RecoveryPasswordController {
    @GetMapping("/recoveryPassword")
    public String recoveryPassword(@RequestParam("request") String jsessionid, HttpServletRequest request, Model model, HttpServletResponse response) {
        //controllo se la sessione è valida
        HttpSession session = request.getSession(false);
        if (session != null && session.getId().equals(jsessionid)) {
            model.addAttribute("jsessionid", "true"); //sessione valida
            model.addAttribute("email", session.getAttribute("email")); //email dell'utente
        }
        else{
            model.addAttribute("jsessionid", "false");  //sessione non valida
            response.setStatus(HttpServletResponse.SC_FOUND);
            response.setHeader("Location", "http://localhost:4200/operationError"); //rimando alla pagoina di errore
        }

        return "recoveryPassword";
    }

    @GetMapping("/updatePassword") @ResponseBody
    public String updatePassword(@RequestParam("password") String password, @RequestParam("email") String email, HttpServletRequest request) {
        //creo sia un oggetto utente che venditore
        UtenteDao utente = DBManager.getInstance().getUtenteDao();
        VenditoreDao venditore = DBManager.getInstance().getVenditoreDao();
        //se l'email è presente nel db sia relativamente agli utenti o ai venditori posso procedere con il cambio password
        if((utente.isEmailPresent(email) && !venditore.isEmailPresent(email)) || (!utente.isEmailPresent(email) && venditore.isEmailPresent(email))) {
            //cambio la password sia del venditore che dell'utente. Infatti essendo l'email univoca può essere presente o come venditore o come utente, quindi non c'è il rischio di cambiare la password a due account diversi. Restituisco, inoltre, un messaggio di errore o di successo
            if(utente.changePassword(email, password) || venditore.changePassword(email, password)) {
                HttpSession session = request.getSession(false);
                session.invalidate();
                return "success";
            } else
                return "error";
        }
        else
            return "error";
    }
}
