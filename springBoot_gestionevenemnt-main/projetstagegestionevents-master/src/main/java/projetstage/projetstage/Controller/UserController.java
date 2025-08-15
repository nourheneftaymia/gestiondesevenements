package projetstage.projetstage.Controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import projetstage.projetstage.DTO.ModifierMotPasseDTO;
import projetstage.projetstage.DTO.UtilisateurDTO;
import projetstage.projetstage.Repository.UtilisateurRepository;
import projetstage.projetstage.Service.UtilisateurService;
import projetstage.projetstage.entities.Utilisateur;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/utilisateurs")
@CrossOrigin
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    private final UtilisateurService utilisateurService;
    private final UtilisateurRepository utilisateurRepository;

    // Dossier des photos
    private final Path photoDirectory = Paths.get("uploads");

    public UserController(UtilisateurService utilisateurService, UtilisateurRepository utilisateurRepository) {
        this.utilisateurService = utilisateurService;
        this.utilisateurRepository = utilisateurRepository;
    }

    @GetMapping("/current")
    public ResponseEntity<UtilisateurDTO> getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            logger.warn("Accès non authentifié à getCurrentUser");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String email = authentication.getName();
        logger.info("Requête getCurrentUser pour email : {}", email);

        Utilisateur utilisateur = utilisateurService.findByEmail(email);
        if (utilisateur == null) {
            logger.warn("Aucun utilisateur trouvé avec l'email : {}", email);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        UtilisateurDTO dto = new UtilisateurDTO(
                utilisateur.getIdUser(),
                utilisateur.getEmail(),
                utilisateur.getNom(),
                utilisateur.getPrenom(),
                utilisateur.getRole()
        );

        return ResponseEntity.ok(dto);
    }

    @PostMapping("/ajouter")
    @PreAuthorize("hasAuthority('RESPONSABLE_RH')")
    public ResponseEntity<?> ajouterUtilisateur(@RequestBody UtilisateurDTO dto) {
        utilisateurService.ajouterUtilisateur(dto);
        return ResponseEntity.ok(Map.of("message", "Utilisateur ajouté avec succès"));
    }

    @PutMapping("modifier/{id}")
    @PreAuthorize("hasAuthority('RESPONSABLE_RH')")
    public ResponseEntity<Map<String, String>> modifierUtilisateur(@PathVariable Long id, @RequestBody UtilisateurDTO utilisateurDto) {
        utilisateurService.updateUtilisateur(id, utilisateurDto);
        return ResponseEntity.ok(Collections.singletonMap("message", "Utilisateur mis à jour avec succès"));
    }

    @DeleteMapping("supprimer/{id}")
    @PreAuthorize("hasAuthority('RESPONSABLE_RH')")
    public ResponseEntity<?> deleteUtilisateur(@PathVariable Long id) {
        utilisateurService.deleteUtilisateur(id);
        return ResponseEntity.ok(Map.of("message", "Utilisateur supprimé avec succès"));
    }


    @GetMapping("/liste")
    @PreAuthorize("hasAuthority('RESPONSABLE_RH')")
    public ResponseEntity<List<Utilisateur>> getAllUtilisateurs() {
        return ResponseEntity.ok(utilisateurService.getAllUtilisateurs());
    }

    @PostMapping("/upload-photo/{id}")
    @PreAuthorize("hasAuthority('RESPONSABLE_RH')")
    public ResponseEntity<Map<String, String>> uploadPhoto(@PathVariable Long id, @RequestParam("photo") MultipartFile file) {
        try {
            utilisateurService.savePhoto(id, file); // 📌 La méthode est dans le service
            return ResponseEntity.ok(Collections.singletonMap("message", "Photo uploadée !"));
        } catch (IOException e) {
            logger.error("Erreur lors de l'upload de la photo : {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", "Erreur lors de l'upload"));
        }
    }

    @GetMapping("/photo/{fileName}")
    public ResponseEntity<Resource> getUserPhoto(@PathVariable("fileName") String fileName, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            logger.warn("Tentative d'accès non autorisé à une photo utilisateur");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        try {
            Path filePath = photoDirectory.resolve(fileName).normalize();
            UrlResource resource = new UrlResource(filePath.toUri());

            if (!resource.exists() || !resource.isReadable()) {
                logger.warn("Photo non trouvée ou illisible : {}", fileName);
                return ResponseEntity.notFound().build();
            }

            String contentType = Files.probeContentType(filePath);
            if (contentType == null) {
                contentType = "application/octet-stream";
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(org.springframework.http.HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);

        } catch (MalformedURLException e) {
            logger.error("URL malformée pour la photo : {}", fileName, e);
            return ResponseEntity.badRequest().build();
        } catch (IOException e) {
            logger.error("Erreur lecture type MIME pour la photo : {}", fileName, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    //Reset Password

}
