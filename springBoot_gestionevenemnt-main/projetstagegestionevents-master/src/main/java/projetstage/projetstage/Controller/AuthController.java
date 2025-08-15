package projetstage.projetstage.Controller;


import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import projetstage.projetstage.Secuity.JwtUtil;
import org.springframework.security.core.Authentication;
import projetstage.projetstage.Service.UtilisateurService;


import java.util.Collections;
import java.util.Map;


@RestController

@RequestMapping("/api/applications")

public class AuthController {



        private final AuthenticationManager authenticationManager;
        private final JwtUtil jwtUtil;
    private final UtilisateurService utilisateurService;
    private static final Logger log = LoggerFactory.getLogger(AuthController.class);


    public AuthController(AuthenticationManager authenticationManager, JwtUtil jwtUtil, UtilisateurService utilisateurService) {
            this.authenticationManager = authenticationManager;
            this.jwtUtil = jwtUtil;
        this.utilisateurService = utilisateurService;
    }

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody Map<String, String> user) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        user.get("email"),
                        user.get("password")
                )
        );

        String token = jwtUtil.generateToken(auth.getName());

        // Récupérer le rôle (le premier rôle si tu en as plusieurs)
        String role = auth.getAuthorities().stream()
                .findFirst()
                .map(grantedAuthority -> grantedAuthority.getAuthority())
                .orElse("UNKNOWN");

        return Map.of(
                "token", token,
                "role", role  // Exemple : "RESPONSABLE_RH"
        );
    }


    // --- Ajout des endpoints de reset password ---

    @PostMapping("/sendcode")
    public ResponseEntity<Map<String, String>> envoyerCodeReset(@RequestBody Map<String, String> request) {
        String email = request.get("email");

        try {
            utilisateurService.envoyerCodeReset(email);
            // Renvoie un objet JSON avec un message
            return ResponseEntity.ok(Map.of("message", "Code envoyé par email"));
        } catch (Exception e) {
            log.error("Erreur lors de l'envoi du code de réinitialisation : ", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/verifycode")
    public ResponseEntity<Map<String, String>> verifierCode(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String code = request.get("code");
        try {
            boolean valid = utilisateurService.verifierCode(email, code);
            if (valid) {
                return ResponseEntity.ok(Map.of("message", "Code valide"));
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Code invalide"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", e.getMessage()));
        }
    }


    @PostMapping("/resetpassword")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String code = request.get("code");
        String nouveauMotDePasse = request.get("nouveauMotDePasse");
        try {
            utilisateurService.resetPassword(email, code, nouveauMotDePasse);
            return ResponseEntity.ok(Collections.singletonMap("message", "Mot de passe modifié avec succès"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", e.getMessage()));
        }
    }
}




