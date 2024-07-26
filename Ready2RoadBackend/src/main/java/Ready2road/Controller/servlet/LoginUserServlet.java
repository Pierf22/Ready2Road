package Ready2road.Controller.servlet;

import Ready2road.Persistenza.Dao.Postgres.AdminDaoPostgres;
import Ready2road.Persistenza.Dao.Postgres.UtenteDaoPostgres;
import Ready2road.Persistenza.Dao.Postgres.VenditoreDaoPostgres;
import Ready2road.Persistenza.Model.Admin;
import Ready2road.Persistenza.Model.Utente;
import Ready2road.Persistenza.Model.Venditore;
import com.google.gson.JsonObject;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import Ready2road.Persistenza.DBManager;

import java.io.IOException;

@WebServlet("/loginUserServlet")
public class LoginUserServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        //creo la sessione
        HttpSession session = request.getSession(true);
        session.setMaxInactiveInterval(24 * 60 * 60);   //durata max 1 giorno
        String sessionID = session.getId(); //prendo l'id della sessione

        //aggiungo la sessione al contesto
        request.getServletContext().setAttribute(sessionID, session);

        //Prendo il valore dei campi di login
        String accessType = request.getParameter("checkV");
        String username = request.getParameter("username");
        String email = request.getParameter("email");
        String password = request.getParameter("password");

        //se lo accessType è null, vuol dire che l'utente vuole accedere come utente o admin
        if(accessType == null){
            if(email != null && username == null){
                //vuole accedere come utente
                Utente utente = findUtente(email, password);
                if(utente != null && !utente.isBan()){
                    //L'utente è presente nel database, salvo i dati dell'utente nella sessione
                    JsonObject userJson = utente.toJson();
                    userJson.addProperty("tipo", "utente");
                    session.setAttribute("user", userJson);
                    session.setAttribute("wallet", utente.getWallet().toJson());

                    goToHome(response, sessionID);
                }
                else{
                    //L'utente non è presente nel database, reindirizzo al login con un messaggio di errore
                    goToLogin(response);
                }
            }
            else if(email == null && username != null){
                //vuole accedere come admin
                Admin admin = findAdmin(username, password);
                if (admin != null){
                    //L'admin è presente nel database, salvo i dati dell'admin nella sessione
                    JsonObject userJson = admin.toJson();
                    userJson.addProperty("tipo", "admin");
                    session.setAttribute("user", userJson);

                    goToDashboard(response, sessionID);
                }
                else{
                    //L'admin non è presente nel database, reindirizzo al login con un messaggio di errore
                    goToLogin(response);
                }
            }
        }
        else if(accessType.equals("vend")){
            //Implemento la logica per accesso venditore
            Venditore venditore = findVenditore(email, password);
            if(venditore != null && !venditore.isBan()){
                //L'utente è presente nel database, salvo i dati del venditore nella sessione
                JsonObject userJson = venditore.toJson();
                userJson.addProperty("tipo", "venditore");
                session.setAttribute("user", userJson);
                session.setAttribute("wallet", venditore.getWallet().toJson());

                goToDashboard(response, sessionID);
            }
            else{
                //L'utente non è presente nel database, reindirizzo al login con un messaggio di errore
                goToLogin(response);
            }
        }

    }

    //Metodo per trovare l'utente nel database
    private Utente findUtente(String email, String password){
        UtenteDaoPostgres utenteDaoPostgres = new UtenteDaoPostgres(DBManager.getInstance().getConnection());
        Utente utente = utenteDaoPostgres.findByPrimaryKey(email, password);
        return utente;
    }

    //Metodo per trovare il venditore nel database
    private Venditore findVenditore(String email, String password){
        VenditoreDaoPostgres venditoreDaoPostgres = new VenditoreDaoPostgres(DBManager.getInstance().getConnection());
        Venditore venditore = venditoreDaoPostgres.findByPrimaryKey(email, password);
        return venditore;
    }

    //Metodo per trovare l'admin nel database
    private Admin findAdmin(String username, String password){
        AdminDaoPostgres adminDaoPostgres = new AdminDaoPostgres(DBManager.getInstance().getConnection());
        Admin admin = adminDaoPostgres.findByPrimaryKey(username, password);
        return admin;
    }

    //Metodo per reindirizzare alla dashboard
    private void goToDashboard(HttpServletResponse response, String sessionID) throws IOException {
        response.setStatus(HttpServletResponse.SC_FOUND);
        response.getWriter().write(sessionID);
        response.setHeader("Location", "http://localhost:4200/dashboard?jsessionid="+sessionID);
    }

    //Metodo per reindirizzare alla home
    private void goToHome(HttpServletResponse response, String sessionID) throws IOException {
        response.setStatus(HttpServletResponse.SC_FOUND);
        response.setHeader("Location", "http://localhost:4200/home?jsessionid="+sessionID);
    }

    //Metodo per reindirizzare al login
    private void goToLogin(HttpServletResponse response){
        response.setStatus(HttpServletResponse.SC_FOUND);
        response.setHeader("Location", "http://localhost:8080/login?loginStatus=invalidCredentials");
    }
}
