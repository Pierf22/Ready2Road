package Ready2road.Controller.servlet;

import Ready2road.Persistenza.DBManager;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

@WebServlet("/verificaNomeSellerServlet")
public class VerificaNomeSellerServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String nameToCheck = request.getParameter("name");

        // Esegui il controllo sull'email
        boolean isNameTaken = DBManager.getInstance().getVenditoreDao().isNomePresent(nameToCheck);

        // Invia la risposta al client
        response.setContentType("text/plain");
        if (!isNameTaken) {
            response.getWriter().write("disponibile");
        } else {
            response.getWriter().write("non_disponibile");
        }
    }
}
