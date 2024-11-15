package Ready2road.Controller;

import Ready2road.Persistenza.DBManager;
import Ready2road.Persistenza.Dao.Postgres.UtenteDaoPostgres;
import Ready2road.Persistenza.Dao.Postgres.VenditoreDaoPostgres;
import Ready2road.Persistenza.Model.Utente;
import Ready2road.Persistenza.Model.Venditore;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "http://localhost:4200/")
@RestController
public class AuthenticationPoint {
    @GetMapping("/getUser")
    public String getUser(@RequestParam("jsessionid") String sessionID, HttpServletRequest request) {
        //controllo se la sessione è valida
        if (checkSession(sessionID, request)) {
            //se è valida, ritorno l'utente
            HttpSession session = (HttpSession) request.getServletContext().getAttribute(sessionID);
            if (session != null)
                return session.getAttribute("user").toString();
        }

        //se non corrispondono o l'utente risulta cancellato/bannato, invalido la sessione
        HttpSession session = (HttpSession) request.getServletContext().getAttribute(sessionID);
        if(session != null)
            session.invalidate();

        return null;
    }

    //metodo che serve per validare la sessione
    public boolean checkSession(String id, HttpServletRequest request){
        //prendo la sessione attiva dal contesto
        HttpSession session = (HttpSession) request.getServletContext().getAttribute(id);

        //se la sessione attiva è uguale a quella passata, valida l'utente
        if(session != null && session.getId().equals(id) && !session.isNew()){
            Object user = session.getAttribute("user");

            //controllo se è un utente o venditore se è bannato o no
            if(user instanceof Utente){
                UtenteDaoPostgres utenteDaoPostgres = new UtenteDaoPostgres(DBManager.getInstance().getConnection());
                if(utenteDaoPostgres.eBannato(((Utente) user).getIndirizzoEmail()))
                    return false;
            }
            if(user instanceof Venditore){
                VenditoreDaoPostgres venditoreDaoPostgres = new VenditoreDaoPostgres(DBManager.getInstance().getConnection());
                if(venditoreDaoPostgres.eBannato(((Venditore) user).getIndirizzoEmail()))
                    return false;
            }

            return true;
        }

        //se la sessione attiva non è uguale a quella passata, invalida
        return false;
    }
}
