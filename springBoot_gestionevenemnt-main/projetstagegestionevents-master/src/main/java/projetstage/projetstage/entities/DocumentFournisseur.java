package projetstage.projetstage.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter


public class DocumentFournisseur {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nomFichier;
    private String commentaire;
    private LocalDateTime dateAjout;

    @ManyToOne
    @JoinColumn(name = "fournisseur_id")
    @JsonBackReference
    private Fournisseur fournisseur;

}