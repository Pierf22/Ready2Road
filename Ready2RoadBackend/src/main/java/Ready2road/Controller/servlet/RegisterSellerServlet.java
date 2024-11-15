package Ready2road.Controller.servlet;

import Ready2road.Persistenza.DBManager;
import Ready2road.Persistenza.Model.Utente;
import Ready2road.Persistenza.Model.Venditore;
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

@WebServlet("/registerSellerServlet")
public class RegisterSellerServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        BufferedReader reader = request.getReader();
        StringBuilder sb = new StringBuilder();
        String line;

        while ((line = reader.readLine()) != null) {
            sb.append(line);
        }

        // Converti il corpo della richiesta in un oggetto Java usando Gson
        Gson gson = new Gson();
        Venditore venditore = gson.fromJson(sb.toString(), Venditore.class);


        DBManager.getInstance().getVenditoreDao().registraVenditore(venditore);


        // Invia una risposta al client
        //salvo l'email in un cookie
        Cookie emailCookie = new Cookie("email", venditore.getIndirizzoEmail());
        emailCookie.setMaxAge(86400); // Imposta la durata del cookie in secondi (1 giorno)
        response.addCookie(emailCookie);

        //Dopo aver salvato tutto nella session, reindirizzo alla home
        response.setContentType("text/plain");
        response.getWriter().write("OK");

    }
}
