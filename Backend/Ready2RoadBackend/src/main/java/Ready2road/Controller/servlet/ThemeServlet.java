package Ready2road.Controller.servlet;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
public class ThemeServlet extends HttpServlet{
    @GetMapping("/getTheme")
    protected void getTheme(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // ottengo la sessione corrente
        HttpSession session = request.getSession();
        String theme = (String) session.getAttribute("theme");  // recupero il valore del tema dalla sessione

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write("{\"theme\": \"" + theme + "\"}");   // restituisco il valore del tema in formato JSON
    }

    @GetMapping("/setTheme")
    protected void setTheme(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // ottengo la sessione corrente
        HttpSession session = request.getSession();
        String theme = request.getParameter("theme");   // recupero il valore del tema dalla richiesta
        if (theme != null) {
            session.setAttribute("theme", theme);   //se non è nullo, lo salvo nella sessione
        }
    }
}
