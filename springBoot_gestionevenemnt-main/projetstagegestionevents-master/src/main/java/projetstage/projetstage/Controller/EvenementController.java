package projetstage.projetstage.Controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import projetstage.projetstage.DTO.EvenementDTO;
import projetstage.projetstage.DTO.FourniseurDTO;
import projetstage.projetstage.DTO.StatCategorieDTO;
import projetstage.projetstage.DTO.UtilisateurDTO;
import projetstage.projetstage.Repository.EvenementRepository;
import projetstage.projetstage.Service.EvenementService;
import projetstage.projetstage.entities.CategorieEvenement;
import projetstage.projetstage.entities.Evenement;
import projetstage.projetstage.entities.Fournisseur;
import projetstage.projetstage.entities.StatusValidation;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.time.Month;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/evenements")
public class EvenementController {

    private final EvenementService evenementService;
    private final EvenementRepository evenementRepository;

    public EvenementController(EvenementService evenementService, EvenementRepository evenementRepository) {
        this.evenementService = evenementService;
        this.evenementRepository = evenementRepository;
    }


    @PreAuthorize("hasAuthority('RESPONSABLE_RH')")
    private List<FourniseurDTO> parseFournisseursJson(String json) throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        return mapper.readValue(json, new TypeReference<List<FourniseurDTO>>() {});
    }


    // Parse JSON string to List<ParticipantDTO>
    @PreAuthorize("hasAuthority('RESPONSABLE_RH')")
    private List<UtilisateurDTO> parseParticipantsJson(String json) throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        return mapper.readValue(json, new TypeReference<List<UtilisateurDTO>>() {});
    }

    //  SUPERIEUR - Créer une demande
    @PostMapping("/demanderEvenement")
    @PreAuthorize("hasAuthority('SUPERIEUR_HEARARCHIQUE')")
    public ResponseEntity<?> demanderEvenement(@RequestBody EvenementDTO dto, Authentication auth) {
        String emailCreateur = auth.getName();
        evenementService.demanderEvenement(dto, emailCreateur);
        return ResponseEntity.ok(Map.of("message", "Demande d’événement envoyée avec succès."));
    }

    // SUPERIEUR - Voir ses demandes
    @GetMapping("/mes-demandes")
    @PreAuthorize("hasAuthority('SUPERIEUR_HEARARCHIQUE')")
    public ResponseEntity<List<Evenement>> getMesDemandes(Authentication auth) {
        List<Evenement> evenements = evenementService.getEvenementsDuCreateur(auth.getName());
        return ResponseEntity.ok(evenements);
    }

    // ✅ RH - Voir les demandes en attente
    @GetMapping("/getDemandesEnAttente")
    @PreAuthorize("hasAuthority('RESPONSABLE_RH')")
    public ResponseEntity<List<EvenementDTO>> getDemandesEnAttente() {
        List<EvenementDTO> evenements = evenementService.getEvenementsParStatutAvecCreateur(StatusValidation.EN_ATTENTE);
        return ResponseEntity.ok(evenements);
    }

    // ✅ RH - Valider une demande sans infos supplémentaires
    @PutMapping("/{id}/validerDemande")
    @PreAuthorize("hasAuthority('RESPONSABLE_RH')")
    public ResponseEntity<?> validerDemande(@PathVariable Long id) {
        evenementService.changerStatutEtCommentaire(id, StatusValidation.VALIDEE, null);
        return ResponseEntity.ok(Map.of("message", "Événement validé avec succès."));
    }

    // ❌ RH - Rejeter une demande avec commentaire
    @PutMapping("/{id}/rejeterDemande")
    @PreAuthorize("hasAuthority('RESPONSABLE_RH')")
    public ResponseEntity<?> rejeterDemande(@PathVariable Long id, @RequestBody EvenementDTO dto) {
        String commentaire = dto.getCommentaireRh();
        evenementService.changerStatutEtCommentaire(id, StatusValidation.REJETEE, commentaire);
        return ResponseEntity.ok(Map.of("message", "Événement rejeté avec commentaire."));
    }

    // ✅ RH - Valider une demande avec infos (coût, date, lieu...)
    @PutMapping("/{id}/validerAvecInfos")
    @PreAuthorize("hasAuthority('RESPONSABLE_RH')")
    public ResponseEntity<?> validerDemandeAvecInfos(@PathVariable Long id, @RequestBody EvenementDTO dto) {
        evenementService.validerAvecInfos(id, dto); // appelle une nouvelle méthode dans le service
        return ResponseEntity.ok(Map.of("message", "✅ Demande validée avec les informations RH"));
    }


    // 📋 RH - Voir les événements validés
    @GetMapping("/getEvenementsValides")
    @PreAuthorize("hasAuthority('RESPONSABLE_RH')")
    public ResponseEntity<List<Evenement>> getEvenementsValides() {
        List<Evenement> evenements = evenementService.getEvenementsParStatut(StatusValidation.VALIDEE);
        return ResponseEntity.ok(evenements);
    }

    // ❌ RH - Voir les événements rejetés
    @GetMapping("/getEvenementsRejetes")
    @PreAuthorize("hasAuthority('RESPONSABLE_RH')")
    public ResponseEntity<List<Evenement>> getEvenementsRejetes() {
        List<Evenement> evenements = evenementService.getEvenementsParStatut(StatusValidation.REJETEE);
        return ResponseEntity.ok(evenements);
    }

    // SUPERIEUR - Modifier une demande
    @PutMapping("/modifierEvenement/{id}")
    @PreAuthorize("hasAuthority('SUPERIEUR_HEARARCHIQUE')")
    public ResponseEntity<?> modifierEvenement(@PathVariable Long id, @RequestBody EvenementDTO dto, Authentication auth) {
        String emailCreateur = auth.getName();
        boolean modifie = evenementService.modifierEvenement(id, dto, emailCreateur);

        if (modifie) {
            return ResponseEntity.ok(Map.of("message", "Événement modifié avec succès."));
        } else {
            return ResponseEntity.status(403).body(Map.of("message", "Modification non autorisée ou événement introuvable."));
        }
    }

    // SUPERIEUR - Supprimer une demande
    @DeleteMapping("/supprimerEvenement/{id}")
    @PreAuthorize("hasAuthority('SUPERIEUR_HEARARCHIQUE')")
    public ResponseEntity<?> supprimerEvenement(@PathVariable Long id, Authentication auth) {
        String emailUser = auth.getName();
        boolean supprime = evenementService.supprimerEvenement(id, emailUser);

        if (supprime) {
            return ResponseEntity.ok(Map.of("message", "Événement supprimé avec succès."));
        } else {
            return ResponseEntity.status(403).body(Map.of("message", "Suppression non autorisée ou événement introuvable."));
        }
    }
    @GetMapping("getById/{id}")
    @PreAuthorize("hasAuthority('RESPONSABLE_RH')")
    public ResponseEntity<Evenement> getEvenementById(@PathVariable Long id) {
        Evenement evenement = evenementService.getEvenementById(id);
        return ResponseEntity.ok(evenement);
    }


    @GetMapping("/finalListe")
    public ResponseEntity<List<Evenement>> getAllEvenementsFinal() {
        List<Evenement> evenements = evenementService.getAllEvenementsFinal();
        return ResponseEntity.ok(evenements);
    }

    // RH - Créer un événement final avec fichiers multipart
    @PostMapping(value = "/finalcreate", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    @PreAuthorize("hasAuthority('RESPONSABLE_RH')")
    public ResponseEntity<String> createEvenementFinal(
            @RequestParam("titre") String titre,
            @RequestParam("description") String description,
            @RequestParam("dateEvenement") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateEvenement,
            @RequestParam("lieuEvenement") String lieuEvenement,
            @RequestParam("cout") Double cout,
            @RequestParam("participants") String participantsJson,
            @RequestParam("fournisseurs") String fournisseursJson,
            @RequestParam(value = "imageEvenement", required = false) MultipartFile imageEvenementFile,
            @RequestParam(value = "imageParticipation", required = false) MultipartFile imageParticipationFile,
            @RequestParam(value = "files", required = false) List<MultipartFile> fichiers
    ) {
        try {
            // Sauvegarde imageEvenement
            String imageEvenementFileName = null;
            if (imageEvenementFile != null && !imageEvenementFile.isEmpty()) {
                String uploadDir = "uploads/images/";
                imageEvenementFileName = UUID.randomUUID() + "_" + imageEvenementFile.getOriginalFilename();
                Path imagePath = Paths.get(uploadDir + imageEvenementFileName);
                Files.createDirectories(imagePath.getParent());
                Files.copy(imageEvenementFile.getInputStream(), imagePath, StandardCopyOption.REPLACE_EXISTING);
            }

            // Sauvegarde imageParticipation
            String imageParticipationFileName = null;
            if (imageParticipationFile != null && !imageParticipationFile.isEmpty()) {
                String uploadDir = "uploads/images/";
                imageParticipationFileName = UUID.randomUUID() + "_" + imageParticipationFile.getOriginalFilename();
                Path imagePath = Paths.get(uploadDir + imageParticipationFileName);
                Files.createDirectories(imagePath.getParent());
                Files.copy(imageParticipationFile.getInputStream(), imagePath, StandardCopyOption.REPLACE_EXISTING);
            }

            // Construire DTO
            EvenementDTO dto = new EvenementDTO();
            dto.setTitre(titre);
            dto.setDescription(description);
            dto.setDateEvenement(dateEvenement);
            dto.setLieuEvenement(lieuEvenement);
            dto.setCout(cout);
            dto.setImageEvenement(imageEvenementFileName);
            dto.setImageParticipation(imageParticipationFileName);

            // Parse JSON pour participants et fournisseurs
            dto.setParticipants(parseParticipantsJson(participantsJson));
            dto.setFournisseurs(parseFournisseursJson(fournisseursJson));

            // Sauvegarder l’événement avec les fichiers
            evenementService.createEvenementFinalWithFiles(dto, fichiers);

            return ResponseEntity.ok("Événement créé avec succès !");
        } catch (Exception e) {
            e.printStackTrace(); // pour debugging
            return ResponseEntity.badRequest().body("Erreur : " + e.getMessage());
        }
    }

    @PutMapping(value = "/updateFinal/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAuthority('RESPONSABLE_RH')")
    public ResponseEntity<String> updateEvenementFinal(
            @PathVariable Long id,
            @RequestParam("titre") String titre,
            @RequestParam("description") String description,
            @RequestParam("dateEvenement") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateEvenement,
            @RequestParam("lieuEvenement") String lieuEvenement,
            @RequestParam("cout") Double cout,
            @RequestParam ("participants") String participantsJson,
            @RequestParam("fournisseurs") String fournisseursJson,
            @RequestParam(value = "imageEvenement", required = false) MultipartFile imageEvenementFile,
            @RequestParam(value = "imageParticipation", required = false) MultipartFile imageParticipationFile,
            @RequestParam(value = "files", required = false) List<MultipartFile> fichiers
    ) {
        try {
            // Sauvegarde imageEvenement si présente
            String imageEvenementFileName = null;
            if (imageEvenementFile != null && !imageEvenementFile.isEmpty()) {
                String uploadDir = "uploads/images/";
                imageEvenementFileName = UUID.randomUUID() + "_" + imageEvenementFile.getOriginalFilename();
                Path imagePath = Paths.get(uploadDir + imageEvenementFileName);
                Files.createDirectories(imagePath.getParent());
                Files.copy(imageEvenementFile.getInputStream(), imagePath, StandardCopyOption.REPLACE_EXISTING);
            }

            // Sauvegarde imageParticipation si présente
            String imageParticipationFileName = null;
            if (imageParticipationFile != null && !imageParticipationFile.isEmpty()) {
                String uploadDir = "uploads/images/";
                imageParticipationFileName = UUID.randomUUID() + "_" + imageParticipationFile.getOriginalFilename();
                Path imagePath = Paths.get(uploadDir + imageParticipationFileName);
                Files.createDirectories(imagePath.getParent());
                Files.copy(imageParticipationFile.getInputStream(), imagePath, StandardCopyOption.REPLACE_EXISTING);
            }

            // Construire DTO
            EvenementDTO dto = new EvenementDTO();
            dto.setTitre(titre);
            dto.setDescription(description);
            dto.setDateEvenement(dateEvenement);
            dto.setLieuEvenement(lieuEvenement);
            dto.setCout(cout);
            dto.setImageEvenement(imageEvenementFileName);
            dto.setImageParticipation(imageParticipationFileName); // si DTO a ce champ
            dto.setParticipants(parseParticipantsJson(participantsJson));
            dto.setFournisseurs(parseFournisseursJson(fournisseursJson));

            evenementService.updateEvenementFinalWithFiles(id, dto, fichiers);

            return ResponseEntity.ok("Événement mis à jour avec succès !");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erreur lors de la mise à jour : " + e.getMessage());
        }
    }


    // RH - Supprimer un événement final
    @DeleteMapping("/deleteFinal/{id}")
    @PreAuthorize("hasAuthority('RESPONSABLE_RH')")
    public ResponseEntity<String> deleteEvenementFinal(@PathVariable Long id) {
        try {
            evenementService.deleteEvenementFinal(id);
            return ResponseEntity.ok("Événement supprimé avec succès !");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erreur lors de la suppression : " + e.getMessage());
        }
    }

    @GetMapping("/statistiques/par-mois")
    @PreAuthorize("hasAuthority('RESPONSABLE_RH')")
    public ResponseEntity<Map<String, Long>> getStatsFinalisesParRh() {
        Map<String, Long> stats = evenementService.getStatistiquesEvenementsRhFinalises();
        return ResponseEntity.ok(stats);
    }
    @GetMapping("/statistiques/categorie-pourcentage")
    @PreAuthorize("hasAuthority('RESPONSABLE_RH')")
    public ResponseEntity<List<StatCategorieDTO>> getStatsPourcentageCategorie() {
        return ResponseEntity.ok(evenementService.getStatsCategorieAvecPourcentage());
    }


    @GetMapping("/statistiques/evolution-top-categorie")
    @PreAuthorize("hasAuthority('RESPONSABLE_RH')")
    public ResponseEntity<Map<String, Long>> getEvolutionTopCategorie() {
        return ResponseEntity.ok(evenementService.getEvolutionTopCategorieParMois());
    }

    @GetMapping("/stats/fournisseurs")
    @PreAuthorize("hasAuthority('RESPONSABLE_RH')")
    public ResponseEntity<Map<String, Long>> getStatsFournisseurs() {
        Map<String, Long> stats = evenementService.getStatsFournisseursUtilisation();
        return ResponseEntity.ok(stats);
    }




    @GetMapping("plus-cher")
    @PreAuthorize("hasAuthority('RESPONSABLE_RH')")
    public ResponseEntity<?> getEvenementLePlusCherAvecRepartition() {
        Optional<Evenement> evenementOpt = evenementService.getEvenementLePlusCher();
        if (evenementOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Evenement evenement = evenementOpt.get();
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("evenement", evenement);
        response.put("repartitionCout", evenementService.getRepartitionCoutEvenementLePlusCher());

        return ResponseEntity.ok(response);
    }



    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasAuthority('RESPONSABLE_RH')")
    public ResponseEntity<String> deleteEvenement(@PathVariable Long id) {
        try {
            boolean deleted = evenementService.deleteEvenementById(id);
            if (deleted) {
                return ResponseEntity.ok("Événement supprimé avec succès !");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Événement non trouvé");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erreur : " + e.getMessage());
        }
    }
}