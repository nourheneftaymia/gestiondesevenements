package projetstage.projetstage.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StatCategorieDTO {
    private String categorie;
    private long count;
    private double percentage;
}
