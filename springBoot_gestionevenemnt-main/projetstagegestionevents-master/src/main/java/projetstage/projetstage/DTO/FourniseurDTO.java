package projetstage.projetstage.DTO;

import lombok.Getter;
import lombok.Setter;
import projetstage.projetstage.entities.DocumentFournisseur;
import projetstage.projetstage.entities.TypeFournisuer;

import java.util.List;
@Getter
@Setter
public class FourniseurDTO {
    private Long id;
    private String nom;
    private String prenom;
    private String email;
    private String numero;
    private TypeFournisuer type;
    private List<DocumentFournisseur> documents;
}
