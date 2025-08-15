package projetstage.projetstage.DTO;

import lombok.*;
import projetstage.projetstage.entities.Priorite;
import projetstage.projetstage.entities.StatusValidation;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@ToString
public class InvitationDTO {
    private Long idInvitation;
    private Long idUser;
    private Long idEvenement;
    private StatusValidation statusInvitation;
    private String message;
    private String email;
    private String titre;
    private String nom;
    private String prenom;
    private String lieu;
    private LocalDate dateDebut;
    private LocalDate dateFin;
    private String description;

    public InvitationDTO(Long idInvitation, Long idUser, Long idEvenement, StatusValidation statusInvitation,
                         String message, String email, String titre, String nom, String prenom, String lieu, LocalDate dateDebut, LocalDate dateFin, String description) {
        this.idInvitation = idInvitation;
        this.idUser = idUser;
        this.idEvenement = idEvenement;
        this.statusInvitation = statusInvitation;
        this.message = message;
        this.email = email;
        this.nom = nom;
        this.titre = titre;
        this.prenom = prenom;
        this.lieu = lieu;
        this.dateDebut = dateDebut;
        this.dateFin = dateFin;
        this.description=description;

    }

    public InvitationDTO(String titre, LocalDate dateDebut, LocalDate dateFin) {
        this.titre = titre;
        this.dateDebut = dateDebut;
        this.dateFin = dateFin;
    }
}