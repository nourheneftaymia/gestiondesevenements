package projetstage.projetstage.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TauxParticipationParEvenement {
    private Long idEvenement;
    private String titreEvenement;
    private long nombreInvitations;
    private int nombreValidées;
    private double tauxParticipation;
}
