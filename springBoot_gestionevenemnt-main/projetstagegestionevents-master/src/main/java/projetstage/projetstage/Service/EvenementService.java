package projetstage.projetstage.Service;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import projetstage.projetstage.DTO.EvenementDTO;
import projetstage.projetstage.DTO.FourniseurDTO;
import projetstage.projetstage.DTO.StatCategorieDTO;
import projetstage.projetstage.DTO.UtilisateurDTO;
import projetstage.projetstage.Repository.EvenementRepository;
import projetstage.projetstage.Repository.FournisseurRepository;
import projetstage.projetstage.Repository.UtilisateurRepository;
import projetstage.projetstage.entities.*;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.Month;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class EvenementService {
    private final EvenementRepository evenementRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final FournisseurRepository fournisseurRepository;
    private final FournisseurService fournisseurService;

    public EvenementService(EvenementRepository evenementRepository,
                            UtilisateurRepository utilisateurRepository, FournisseurRepository fournisseurRepository, FournisseurService fournisseurService) {
        this.evenementRepository = evenementRepository;
        this.utilisateurRepository = utilisateurRepository;
        this.fournisseurRepository=fournisseurRepository;
        this.fournisseurService = fournisseurService;
    }

    // 1. Créer une demande d'événement (statut par défaut = EN_ATTENTE)
    public void demanderEvenement(EvenementDTO dto, String emailCreateur) {
        Utilisateur createur = utilisateurRepository.findByEmail(emailCreateur)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        Evenement evenement = new Evenement();
        evenement.setTitre(dto.getTitre());
        evenement.setDescription(dto.getDescription());
        evenement.setDateDebut(dto.getDateDebut());
        evenement.setDateFin(dto.getDateFin());
        evenement.setLieu(dto.getLieu());
        evenement.setDegreImportance(dto.getDegreImportance());
        evenement.setCout(dto.getCout());
        evenement.setCategorieEvenement(dto.getCategorieEvenement());
        evenement.setCreateur(createur);
        evenement.setStatusValidation(StatusValidation.EN_ATTENTE); // statut initial

        evenementRepository.save(evenement);
    }

    // 2. Modifier un événement si c'est le créateur
    public boolean modifierEvenement(Long id, EvenementDTO dto, String emailCreateur) {
        Optional<Evenement> optionalEvent = evenementRepository.findById(id);
        if (optionalEvent.isEmpty()) return false;

        Evenement event = optionalEvent.get();
        if (!event.getCreateur().getEmail().equals(emailCreateur)) {
            return false;
        }

        event.setTitre(dto.getTitre());
        event.setDescription(dto.getDescription());
        event.setDateDebut(dto.getDateDebut());
        event.setDateFin(dto.getDateFin());
        event.setLieu(dto.getLieu());
        event.setCout(dto.getCout());
        event.setCategorieEvenement(dto.getCategorieEvenement());
        event.setDegreImportance(dto.getDegreImportance());

        evenementRepository.save(event);
        return true;
    }

    // 3. Supprimer un événement (si c’est le créateur)
    public boolean supprimerEvenement(Long id, String emailUser) {
        Optional<Evenement> optionalEvent = evenementRepository.findById(id);
        if (optionalEvent.isEmpty()) return false;

        Evenement event = optionalEvent.get();
        if (!event.getCreateur().getEmail().equals(emailUser)) {
            return false;
        }

        evenementRepository.delete(event);
        return true;
    }

    // 4. Changer uniquement le statut d’un événement
    public void changerStatut(Long id, StatusValidation statut) {
        Evenement e = evenementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Événement non trouvé avec id : " + id));
        e.setStatusValidation(statut);
        evenementRepository.save(e);
    }

    // 5. Changer le statut et ajouter un commentaire RH si rejeté
    public void changerStatutEtCommentaire(Long id, StatusValidation statut, String commentaireRh) {
        Evenement evenement = evenementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Événement introuvable"));

        evenement.setStatusValidation(statut);

        if (statut == StatusValidation.REJETEE) {
            evenement.setCommentaireRh(commentaireRh);
        } else {
            evenement.setCommentaireRh(null);
        }

        evenementRepository.save(evenement);
    }

    // 6. Obtenir tous les événements par statut (retourne entités)
    public List<Evenement> getEvenementsParStatut(StatusValidation statut) {
        return evenementRepository.findByStatusValidation(statut);
    }

    // 7. Obtenir tous les événements créés par un utilisateur (retourne entités)
    public List<Evenement> getEvenementsDuCreateur(String email) {
        Utilisateur createur = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec email : " + email));
        return evenementRepository.findByCreateur(createur);
    }

    // --- PARTIE DTO ---

    // Convertir Evenement en EvenementDTO avec informations créateur
    public EvenementDTO toDTO(Evenement evenement) {
        EvenementDTO dto = new EvenementDTO();

        dto.setIdEvenement(evenement.getIdEvenement());
        dto.setTitre(evenement.getTitre());
        dto.setDescription(evenement.getDescription());
        dto.setDateDebut(evenement.getDateDebut());
        dto.setDateFin(evenement.getDateFin());
        dto.setLieu(evenement.getLieu());
        dto.setImageEvenement(evenement.getImageEvenement());
        dto.setDegreImportance(evenement.getDegreImportance());
        dto.setCout(evenement.getCout());
        dto.setCategorieEvenement(evenement.getCategorieEvenement());
        dto.setStatusValidation(evenement.getStatusValidation());
        dto.setCommentaireRh(evenement.getCommentaireRh());

        Utilisateur createur = evenement.getCreateur();
        if (createur != null) {
            UtilisateurDTO createurDTO = new UtilisateurDTO();
            createurDTO.setIdUser(createur.getIdUser());
            createurDTO.setNom(createur.getNom());
            createurDTO.setPrenom(createur.getPrenom());
            createurDTO.setEmail(createur.getEmail());
            createurDTO.setRole(createur.getRole());
            if (createur.getParent() != null) {
                createurDTO.setIdParent(createur.getParent().getIdUser());
            }
            dto.setCreateur(createurDTO);
        }

        return dto;
    }

    // Méthode qui retourne une liste DTO des événements filtrés par statut
    public List<EvenementDTO> getEvenementsParStatutAvecCreateur(StatusValidation statut) {
        List<Evenement> evenements = evenementRepository.findByStatusValidation(statut);
        return evenements.stream()
                .map(this::toDTO)
                .toList();
    }




    public void validerAvecInfos(Long id, EvenementDTO dto) {
        Evenement evenement = evenementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Événement introuvable"));

        // Mise à jour des champs
        evenement.setLieu(dto.getLieu());
        evenement.setDateDebut(dto.getDateDebut());
        evenement.setDateFin(dto.getDateFin());
        evenement.setCout(dto.getCout());
        evenement.setCommentaireRh(dto.getCommentaireRh());

        // Changement du statut
        evenement.setStatusValidation(StatusValidation.VALIDEE);

        // Sauvegarde dans la base de données
        evenementRepository.save(evenement);
    }

    public Evenement getEvenementById(Long id) {
        return evenementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Événement non trouvé avec l'ID : " + id));
    }


    @Transactional
    public void createEvenementFinalWithFiles(EvenementDTO dto, List<MultipartFile> fichiers) throws IOException {
        Evenement evenement = new Evenement();
        evenement.setTitre(dto.getTitre());
        evenement.setDescription(dto.getDescription());
        evenement.setDateEvenement(dto.getDateEvenement());
        evenement.setLieuEvenement(dto.getLieuEvenement());
        evenement.setCout(dto.getCout());

        // 🟢 Gestion de l'image de l'événement : si un fichier est fourni dans fichiers, on le sauvegarde
        if (fichiers != null && !fichiers.isEmpty()) {
            MultipartFile imageFile = fichiers.get(0);  // Supposons que la première image est celle de l'événement
            if (imageFile != null && !imageFile.isEmpty()) {
                // Sauvegarde fichier sur disque
                String filename = saveImageFile(imageFile);
                // Stocke uniquement le nom/fichier dans la colonne (pas le contenu base64)
                evenement.setImageEvenement(filename);
            }
        }

        if (fichiers != null && !fichiers.isEmpty()) {
            MultipartFile imageFile = fichiers.get(0);  // Supposons que la première image est celle de l'événement
            if (imageFile != null && !imageFile.isEmpty()) {
                // Sauvegarde fichier sur disque
                String filename = saveImageFile(imageFile);
                // Stocke uniquement le nom/fichier dans la colonne (pas le contenu base64)
                evenement.setImageParticipation(filename);
            }
        }

        // Participants - récupérer utilisateurs par email
        List<Utilisateur> participants = new ArrayList<>();
        if (dto.getParticipants() != null) {
            for (UtilisateurDTO participantDTO : dto.getParticipants()) {
                Optional<Utilisateur> user = utilisateurRepository.findByEmail(participantDTO.getEmail());
                if (user.isPresent()) {
                    participants.add(user.get());
                } else {
                    // Optionnel : gérer le cas où l'utilisateur n'existe pas
                    System.out.println("Utilisateur non trouvé avec email: " + participantDTO.getEmail());
                }
            }
        }
        evenement.setParticipants(participants);


        // Fournisseurs
        List<Fournisseur> fournisseurs = new ArrayList<>();
        List<FourniseurDTO> fournisseurDTOs = dto.getFournisseurs();

        // On démarre à partir de l'index 1 pour les fichiers car index 0 est l'image événement
        for (int i = 0; i < fournisseurDTOs.size(); i++) {
            FourniseurDTO fDto = fournisseurDTOs.get(i);

            Fournisseur f = new Fournisseur();
            f.setNom(fDto.getNom());
            f.setPrenom(fDto.getPrenom());
            f.setEmail(fDto.getEmail());
            f.setNumero(fDto.getNumero());
            f.setType(fDto.getType());

            fournisseurRepository.save(f);

            // Associer fichier au fournisseur : fichiers à partir de l’index 1 + i
            int fileIndex = i + 1;
            if (fichiers != null && fichiers.size() > fileIndex) {
                MultipartFile file = fichiers.get(fileIndex);
                if (file != null && !file.isEmpty()) {
                    fournisseurService.ajouterDocument(f.getId(), file, null);
                }
            }

            fournisseurs.add(f);
        }

        evenement.setFournisseurs(fournisseurs);

        // Sauvegarder l’événement
        evenementRepository.save(evenement);
    }

    // Méthode pour sauvegarder l'image sur disque
    private String saveImageFile(MultipartFile file) throws IOException {
        String uploadDir = "uploads/images";
        File dir = new File(uploadDir);
        if (!dir.exists()) dir.mkdirs();

        String filename = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Path filePath = Paths.get(uploadDir, filename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        return filename;
    }
    @Transactional
    public void updateEvenementFinalWithFiles(Long evenementId, EvenementDTO dto, List<MultipartFile> fichiers) throws IOException {
        // 1. Charger l'événement existant
        Evenement evenement = evenementRepository.findById(evenementId)
                .orElseThrow(() -> new EntityNotFoundException("Événement non trouvé"));

        // 2. Mise à jour des champs simples
        evenement.setTitre(dto.getTitre());
        evenement.setDescription(dto.getDescription());
        evenement.setDateEvenement(dto.getDateEvenement());
        evenement.setLieuEvenement(dto.getLieuEvenement());
        evenement.setCout(dto.getCout());

        // 3. Mise à jour de l'image de l'événement si un nouveau fichier est fourni
        if (fichiers != null && !fichiers.isEmpty()) {
            MultipartFile imageFile = fichiers.get(0);
            if (imageFile != null && !imageFile.isEmpty()) {
                String filename = saveImageFile(imageFile);
                evenement.setImageEvenement(filename);
            }
        }

        // 4. Mise à jour des participants
        List<Utilisateur> participants = utilisateurRepository.findAllById(dto.getParticipantsIds());
        evenement.setParticipants(participants);

        // 5. Mise à jour des fournisseurs
        List<FourniseurDTO> fournisseurDTOs = dto.getFournisseurs();
        List<Fournisseur> fournisseursExistants = evenement.getFournisseurs();
        List<Fournisseur> fournisseursMisAJour = new ArrayList<>();

        // Supposons que fournisseurDTOs ont un champ id pour identifier fournisseur existant ou nouveau
        for (int i = 0; i < fournisseurDTOs.size(); i++) {
            FourniseurDTO fDto = fournisseurDTOs.get(i);
            Fournisseur fournisseur;

            if (fDto.getId() != null) {
                // Modifie un fournisseur existant
                fournisseur = fournisseurRepository.findById(fDto.getId())
                        .orElseThrow(() -> new EntityNotFoundException("Fournisseur non trouvé"));
            } else {
                // Nouveau fournisseur
                fournisseur = new Fournisseur();
            }

            // Met à jour les champs du fournisseur
            fournisseur.setNom(fDto.getNom());
            fournisseur.setPrenom(fDto.getPrenom());
            fournisseur.setEmail(fDto.getEmail());
            fournisseur.setNumero(fDto.getNumero());
            fournisseur.setType(fDto.getType());

            fournisseurRepository.save(fournisseur);

            // Associer fichier au fournisseur : fichiers à partir de l’index 1 + i
            int fileIndex = i + 1;
            if (fichiers != null && fichiers.size() > fileIndex) {
                MultipartFile file = fichiers.get(fileIndex);
                if (file != null && !file.isEmpty()) {
                    fournisseurService.ajouterDocument(fournisseur.getId(), file, null);
                }
            }

            fournisseursMisAJour.add(fournisseur);
        }

        // Optionnel : gérer suppression des fournisseurs non dans la liste mise à jour
        // Par exemple supprimer ceux qui existent mais ne sont plus dans fournisseurDTOs

        evenement.setFournisseurs(fournisseursMisAJour);

        // 6. Sauvegarder l'événement mis à jour
        evenementRepository.save(evenement);
    }


    public void deleteEvenementFinal(Long idEvenement) {
        if (!evenementRepository.existsById(idEvenement)) {
            throw new RuntimeException("Événement introuvable avec ID : " + idEvenement);
        }

        Evenement evenement = evenementRepository.findById(idEvenement).get();

        // Supprimer les fournisseurs liés
        List<Fournisseur> fournisseurs = evenement.getFournisseurs();
        if (fournisseurs != null && !fournisseurs.isEmpty()) {
            fournisseurRepository.deleteAll(fournisseurs);
        }

        // Supprimer l'événement
        evenementRepository.deleteById(idEvenement);
    }



    public List<Evenement> getAllEvenementsFinal() {
        return evenementRepository.findAllFinalWithFournisseurs();
    }


    //Stat
    public Map<String, Long> getStatistiquesEvenementsRhFinalises() {
        List<Object[]> result = evenementRepository.countEvenementsRhFinalisesParMois();

        Map<String, Long> stats = new LinkedHashMap<>();
        for (Object[] row : result) {
            Integer annee = (Integer) row[0];
            Integer mois = (Integer) row[1];
            Long total = (Long) row[2];

            // Exemple : Août 2025
            String label = Month.of(mois).getDisplayName(TextStyle.FULL, Locale.FRENCH) + " " + annee;
            stats.put(label, total);
        }

        return stats;
    }




    public List<StatCategorieDTO> getStatsCategorieAvecPourcentage() {
        List<Object[]> result = evenementRepository.countEvenementsValidesParCategorie();

        long total = result.stream()
                .mapToLong(row -> (Long) row[1])
                .sum();

        List<StatCategorieDTO> stats = new ArrayList<>();

        for (Object[] row : result) {
            CategorieEvenement categorie = (CategorieEvenement) row[0];
            long count = (Long) row[1];
            double percentage = total > 0 ? (count * 100.0) / total : 0;

            stats.add(new StatCategorieDTO(categorie.name(), count, Math.round(percentage * 100.0) / 100.0)); // arrondi à 2 décimales
        }

        return stats;
    }
    public Map<String, Long> getEvolutionTopCategorieParMois() {
        List<Object[]> raw = evenementRepository.findCategorieEvolution();

        // Compter globalement toutes les catégories pour trouver la plus utilisée
        Map<CategorieEvenement, Long> totalByCategory = raw.stream()
                .collect(Collectors.groupingBy(
                        r -> (CategorieEvenement) r[0],
                        Collectors.summingLong(r -> (Long) r[3])
                ));

        // Catégorie la plus utilisée
        CategorieEvenement topCategory = totalByCategory.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse(null);

        if (topCategory == null) return Collections.emptyMap();

        // Filtrer uniquement les mois de la catégorie dominante
        return raw.stream()
                .filter(r -> r[0] == topCategory)
                .collect(Collectors.toMap(
                        r -> r[1] + "-" + String.format("%02d", r[2]), // clé "2025-08"
                        r -> (Long) r[3],
                        (a, b) -> a,
                        LinkedHashMap::new
                ));
    }
    public Map<String, Long> getStatsFournisseursUtilisation() {
        List<Evenement> evenements = evenementRepository.findAllFinalWithFournisseurs();

        // Map pour compter par nom de fournisseur
        Map<String, Long> stats = evenements.stream()
                .flatMap(ev -> ev.getFournisseurs().stream()) // récupérer tous les fournisseurs
                .collect(Collectors.groupingBy(
                        Fournisseur::getNom, // groupement par nom
                        Collectors.counting() // compter les occurrences
                ));

        // Trier du plus utilisé au moins utilisé
        return stats.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        Map.Entry::getValue,
                        (a, b) -> a,
                        LinkedHashMap::new
                ));
    }

    public Optional<Evenement> getEvenementLePlusCher() {
        return evenementRepository.findAll().stream()
                .max(Comparator.comparing(Evenement::getCout));
    }
    public Map<String, Double> getRepartitionCoutEvenementLePlusCher() {
        Optional<Evenement> evenementOpt = getEvenementLePlusCher();
        if (evenementOpt.isEmpty()) {
            return Collections.emptyMap();
        }

        Evenement evenement = evenementOpt.get();
        // Juste afficher le coût total sans le diviser
        return Map.of("Total", evenement.getCout());
    }



    public boolean deleteEvenementById(Long id) {
        Optional<Evenement> evt = evenementRepository.findById(id);
        if (evt.isPresent()) {
            // Supprimer fichiers liés si nécessaire
            Evenement evenement = evt.get();
            deleteFiles(evenement); // méthode pour supprimer les fichiers du disque
            evenementRepository.delete(evenement);
            return true;
        }
        return false;
    }

    private void deleteFiles(Evenement evenement) {
        // Exemple : supprimer imageEvenement
        if (evenement.getImageEvenement() != null) {
            Path imagePath = Paths.get("uploads/images/" + evenement.getImageEvenement());
            try { Files.deleteIfExists(imagePath); } catch (IOException e) { e.printStackTrace(); }
        }

        // Supprimer fichiers fournisseurs si nécessaire
        if (evenement.getFournisseurs() != null) {
            evenement.getFournisseurs().forEach(f -> {
                if (f.getDocuments() != null) {
                    f.getDocuments().forEach(doc -> {
                        Path docPath = Paths.get("uploads/" + doc.getNomFichier());
                        try { Files.deleteIfExists(docPath); } catch (IOException e) { e.printStackTrace(); }
                    });
                }
            });
        }
    }

}
