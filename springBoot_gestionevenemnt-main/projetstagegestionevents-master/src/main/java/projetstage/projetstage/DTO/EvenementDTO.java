package projetstage.projetstage.DTO;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Getter;
import lombok.Setter;
import projetstage.projetstage.entities.CategorieEvenement;
import projetstage.projetstage.entities.StatusValidation;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
@Getter
@Setter
public class EvenementDTO {

    private Long idEvenement; //
    private String titre;
    private String description;
    private LocalDate dateDebut;
    private LocalDate dateFin;
    private String imageEvenement;
    private String lieu;
    private String degreImportance;
    private double cout;
    @Enumerated(EnumType.STRING)
    private StatusValidation statusValidation;
    private CategorieEvenement categorieEvenement;
    private Double budgetEstime;
    private LocalDate dateEvenement;
    private String lieuEvenement;

    private String validationDetailsRh;
    private String commentaireRh;

    private UtilisateurDTO createur;

    // ✅ Ajouts nécessaires :
    private List<Long> participantsIds;
    private List<Long> fournisseursIds;
    private List<FourniseurDTO> fournisseurs;
    private List<UtilisateurDTO> participants;  // liste avec email + nom
    private String imageParticipation;



}