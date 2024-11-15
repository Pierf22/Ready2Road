package Ready2road.Controller.servlet;

import Ready2road.Persistenza.DBManager;
import Ready2road.Persistenza.Model.Utente;
import Ready2road.Persistenza.Model.Wallet;
import com.google.gson.Gson;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.BufferedReader;
import java.io.IOException;

@WebServlet("/registerUserServlet")
public class RegisterUserServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        BufferedReader reader = request.getReader();
        StringBuilder sb = new StringBuilder();
        String line;

        while ((line = reader.readLine()) != null) {
            sb.append(line);
        }

        // Converti il corpo della richiesta in un oggetto Java usando Gson
        Gson gson = new Gson();
        Utente utente = gson.fromJson(sb.toString(), Utente.class);


        DBManager.getInstance().getUtenteDao().registraUtente(utente);


        Cookie emailCookie = new Cookie("email", utente.getIndirizzoEmail());
        emailCookie.setMaxAge(86400); // Imposta la durata del cookie in secondi (1 giorno)
        response.addCookie(emailCookie);

        //Dopo aver salvato tutto nella session, reindirizzo alla home
        response.setContentType("text/plain");
        response.getWriter().write("OK");
    }
}
