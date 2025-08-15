package projetstage.projetstage.entities;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Setter
@Getter
public class Fournisseur {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String nom;
    private String prenom;
    private String email;
    private String numero;

    @Enumerated(EnumType.STRING)
    private TypeFournisuer type;
    @OneToMany(mappedBy = "fournisseur", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<DocumentFournisseur> documents;


    public Fournisseur(TypeFournisuer type, String numero, String email, String prenom, String nom, List<DocumentFournisseur> documents) {
        this.type = type;
        this.numero = numero;
        this.email = email;
        this.prenom = prenom;
        this.nom = nom;
        this.documents = documents;

    }

    public Fournisseur() {

    }
}

