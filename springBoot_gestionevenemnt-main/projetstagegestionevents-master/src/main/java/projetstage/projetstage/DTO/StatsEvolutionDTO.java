package projetstage.projetstage.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class StatsEvolutionDTO {
    private String categorie;
    private String moisAnnee; // Exemple : "Août 2025"
    private Long count;}

