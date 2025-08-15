package projetstage.projetstage.entities;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import projetstage.projetstage.DTO.UtilisateurDTO;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Setter
@Getter


@NoArgsConstructor
@ToString
@Entity
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "evenement")
public class Evenement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idEvenement;
    private String titre;
    private String description;
    private LocalDate dateDebut;
    private LocalDate dateFin;
    private String imageEvenement;
    private String imageParticipation;
    private String lieu;
    private String degreImportance;
    private Double budgetEstime;
    private LocalDate dateEvenement;
    private String lieuEvenement;
    private double cout;
    @Enumerated(EnumType.STRING)
    private StatusValidation statusValidation;
    @Enumerated(EnumType.STRING)
    private CategorieEvenement categorieEvenement;


    @ManyToOne
    private Utilisateur createur;

    @Enumerated(EnumType.STRING)
    private StatusValidation statut; // EN_ATTENTE, VALIDEE, REJETEE

    private String commentaireRh; // 📝 commentaire en cas de rejet


    // ✅ Liste des participants (utilisateurs sélectionnés)
    @ManyToMany
    @JoinTable(
            name = "evenement_participants",
            joinColumns = @JoinColumn(name = "evenement_id_evenement"),
            inverseJoinColumns = @JoinColumn(name = "participants_id_user")
    )
    List<Utilisateur> participants;

    // ✅ Liste des fournisseurs (prestataires de services liés à l'événement)
    @OneToMany
    List<Fournisseur> fournisseurs;

    // ✅ Calcul automatique du nombre de participants
    @Transient
    public int getNbParticipants() {
        return participants != null ? participants.size() : 0;
    }



}
