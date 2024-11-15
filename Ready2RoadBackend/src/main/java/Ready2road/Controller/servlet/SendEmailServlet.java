package Ready2road.Controller.servlet;

import jakarta.mail.*;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;
import java.util.Properties;

@WebServlet("/sendEmail")
public class SendEmailServlet extends HttpServlet {
    private String emailGoogle = "YOUR GOOGLE EMAIL";   //email account
    private String password = "YOUR GOOGLE PASSWORD";    //password per app non password account

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String email = request.getParameter("email");   //email dell'utente

        //creo la sessione di recupero password
        HttpSession jsession = request.getSession(true);
        jsession.setAttribute("email", email);
        jsession.setMaxInactiveInterval(2 * 60 * 60); //2 ore di validità del link

        //parametri di configurazione, uso gmail
        Properties properties = new Properties();
        properties.put("mail.smtp.host", "smtp.gmail.com");
        properties.put("mail.smtp.port", "587");
        properties.put("mail.smtp.auth", "true");
        properties.put("mail.smtp.starttls.enable", "true");

        //autenticazione dell'account mail per usare il servizio smtp di gmail
        Authenticator authenticator = new Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(emailGoogle, password);
            }
        };

        //creo la sessione di invio email
        Session session = Session.getInstance(properties, authenticator);

        try {
            // Corpo dell'email
            String emailContent = "Ciao,\n\n"
                    + "Hai richiesto il recupero della password per il tuo account. "
                    + "Per reimpostare la tua password, clicca sul link sottostante:\n\n"
                    + "Link per il recupero password: http://localhost:8080/recoveryPassword?request=" + jsession.getId() + "\n\n"
                    + "Se non hai richiesto il recupero della password, puoi ignorare questa email. "
                    + "Il tuo account rimarrà sicuro.\n\n"
                    + "Grazie,\n"
                    + "Il tuo team di supporto.";

            // Creazione del messaggio email
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress("YOUR GOOGLE EMAIL"));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(email));
            message.setSubject("Recupero password");
            message.setText(emailContent);

            // Invio dell'email
            Transport.send(message);

        } catch (MessagingException e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            e.printStackTrace();
        }
    }
}
