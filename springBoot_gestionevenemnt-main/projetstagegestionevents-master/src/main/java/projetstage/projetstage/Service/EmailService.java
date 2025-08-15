package projetstage.projetstage.Service;

import com.mysql.cj.Session;
import com.mysql.cj.protocol.Message;
import jakarta.mail.MessagingException;
import jakarta.mail.Transport;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.net.Authenticator;
import java.net.PasswordAuthentication;
import java.util.Properties;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendResetCode(String toEmail, String code) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("🔐 Code de réinitialisation de mot de passe");
        message.setText("Bonjour,\n\nVoici votre code de réinitialisation : " + code +
                "\n\nCe code expire dans 10 minutes." +
                "\n\nSi vous n'avez pas demandé cette action, ignorez ce message.");

        mailSender.send(message);
    }

    public void sendPasswordChangedEmail(String toEmail) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("✅ Votre mot de passe a été modifié");
        message.setText("Bonjour,\n\nVotre mot de passe a bien été changé avec succès." +
                "\n\nSi vous n'êtes pas à l'origine de cette modification, contactez le support immédiatement.");

        mailSender.send(message);
    }




}
