package Ready2road.Controller.servlet;

import Ready2road.Persistenza.DBManager;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

@WebServlet("/verificaEmailSellerServlet")
public class VerificaEmailSellerServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String emailToCheck = request.getParameter("email");
        String nameToCheck = request.getParameter("nomeSocieta");

        // Esegui il controllo sull'email
        boolean isEmailTaken = DBManager.getInstance().getVenditoreDao().isVenditorePresente(emailToCheck, nameToCheck);

        // Invia la risposta al client
        response.setContentType("text/plain");
        if (!isEmailTaken) {
            response.getWriter().write("disponibile");
        } else {
            response.getWriter().write("non_disponibile");
        }
    }
}

