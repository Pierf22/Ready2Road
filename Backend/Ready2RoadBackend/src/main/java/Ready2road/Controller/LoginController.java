package Ready2road.Controller;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.security.SecureRandom;

@Controller
public class LoginController {
    @GetMapping("/login")
    public String login(HttpServletRequest request, Model model) {
        HttpSession session = request.getSession(false);

        //verifichiamo che i dati esistono nella sessione e salvo l'email/username nel model
        if(session != null && session.getAttribute("user") != null){
            String user = session.getAttribute("user").toString();
            JsonObject userData = JsonParser.parseString(user).getAsJsonObject();
            if (userData.has("username"))
                model.addAttribute("username", userData.get("username").getAsString());
            else if (userData.has("indirizzoEmail"))
                model.addAttribute("email", userData.get("indirizzoEmail").getAsString());
        }

        //genero il captcha e lo aggiungo al model
        model.addAttribute("captcha", generateCaptcha());

        return "login"; // Ritorna il nome della vista Thymeleaf
    }

    //Funzione per generare il captcha
    public static String generateCaptcha() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        StringBuilder captcha = new StringBuilder();

        SecureRandom random = new SecureRandom();

        for (int i = 0; i < 7; i++) {
            int index = random.nextInt(chars.length());
            captcha.append(chars.charAt(index));
        }

        return captcha.toString();
    }
}
