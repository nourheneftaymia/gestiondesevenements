package projetstage.projetstage.Service;

import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import projetstage.projetstage.DTO.UtilisateurDTO;
import projetstage.projetstage.Repository.ResetPasswordTokenRepository;
import projetstage.projetstage.Repository.UtilisateurRepository;
import projetstage.projetstage.entities.ResetPasswordToken;
import projetstage.projetstage.entities.Utilisateur;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
public class UtilisateurService {
    private final EmailService emailService;
    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder ;
    private final ResetPasswordTokenRepository resetPasswordTokenRepository;
    public UtilisateurService (EmailService emailService, UtilisateurRepository utilisateurRepository , PasswordEncoder passwordEncoder, ResetPasswordTokenRepository resetPasswordTokenRepository){
        this.emailService = emailService;
        this.utilisateurRepository = utilisateurRepository;
        this.passwordEncoder = passwordEncoder;
        this.resetPasswordTokenRepository = resetPasswordTokenRepository;


    }


    public void ajouterUtilisateur(UtilisateurDTO dto) {
        Utilisateur user = new Utilisateur();
        user.setNom(dto.getNom());
        user.setPrenom(dto.getPrenom());
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setRole(dto.getRole());

        if (dto.getIdParent() != null) {
            Utilisateur parent = utilisateurRepository.findById(dto.getIdParent())
                    .orElseThrow(() -> new RuntimeException("Parent non trouvé"));
            user.setParent(parent);
        }

        utilisateurRepository.save(user);
    }

    public void updateUtilisateur(Long id, UtilisateurDTO dto) {
        Utilisateur user = utilisateurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        user.setNom(dto.getNom());        // ✅ Ajouté
        user.setPrenom(dto.getPrenom());  // ✅ Ajouté
        user.setEmail(dto.getEmail());
        user.setPhoto(dto.getPhoto());

        if (dto.getPassword() != null && !dto.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(dto.getPassword()));
        }

        user.setRole(dto.getRole());

        if (dto.getIdParent() != null) {
            Utilisateur parent = utilisateurRepository.findById(dto.getIdParent())
                    .orElseThrow(() -> new RuntimeException("Parent non trouvé"));
            user.setParent(parent);
        } else {
            user.setParent(null); // facultatif : retire le parent si aucun idParent fourni
        }

        utilisateurRepository.save(user);
    }

    public void deleteUtilisateur(Long id) {
        utilisateurRepository.deleteById(id);
    }

    public List<Utilisateur> getAllUtilisateurs() {
        return utilisateurRepository.findAll();
    }


    public Utilisateur findByEmail(String email) {
        return utilisateurRepository.findByEmail(email)
                .orElse(null);  // ou lancer une exception selon ta gestion d’erreur
    }
    public void savePhoto(Long id, MultipartFile file) throws IOException {
        Utilisateur utilisateur = utilisateurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        String fileName = "user_" + id + "_" + file.getOriginalFilename();
        Path filePath = Paths.get("uploads", fileName);

        // Assure-toi que le dossier uploads existe
        Files.createDirectories(filePath.getParent());
        Files.write(filePath, file.getBytes());

        utilisateur.setPhoto(fileName);
        utilisateurRepository.save(utilisateur);
    }


//Reset Password
    public void envoyerCodeReset(String email) {
        Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Email non trouvé"));

        String code = String.valueOf((int)(Math.random() * 900000 + 100000)); // ex : 726491

        ResetPasswordToken resetToken = new ResetPasswordToken();
        resetToken.setUtilisateur(utilisateur);
        resetToken.setToken(code); // c’est ton OTP
        resetToken.setExpirationDate(new Date(System.currentTimeMillis() + 10 * 60 * 1000)); // 10 min

        resetPasswordTokenRepository.save(resetToken);

        emailService.sendResetCode(utilisateur.getEmail(), code); // méthode à créer
    }

    public boolean verifierCode(String email, String code) {
        ResetPasswordToken resetToken = resetPasswordTokenRepository.findByToken(code)
                .orElseThrow(() -> new IllegalArgumentException("Code invalide"));

        if (resetToken.getExpirationDate().before(new Date())) {
            throw new IllegalArgumentException("Code expiré");
        }

        if (!resetToken.getUtilisateur().getEmail().equals(email)) {
            throw new IllegalArgumentException("Ce code ne correspond pas à cet email");
        }

        return true; // Code valide, prêt à changer le mot de passe
    }


    public void resetPassword(String email, String code, String nouveauMotDePasse) {
        ResetPasswordToken resetToken = resetPasswordTokenRepository.findByToken(code)
                .orElseThrow(() -> new IllegalArgumentException("Code invalide"));

        if (resetToken.getExpirationDate().before(new Date())) {
            throw new IllegalArgumentException("Code expiré");
        }

        if (!resetToken.getUtilisateur().getEmail().equals(email)) {
            throw new IllegalArgumentException("Email ne correspond pas au code");
        }

        Utilisateur utilisateur = resetToken.getUtilisateur();
        utilisateur.setPassword(passwordEncoder.encode(nouveauMotDePasse));
        utilisateurRepository.save(utilisateur);

        resetPasswordTokenRepository.delete(resetToken); // on supprime le code utilisé
        emailService.sendPasswordChangedEmail(utilisateur.getEmail()); // optionnel
    }


}
