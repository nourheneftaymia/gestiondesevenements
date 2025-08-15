package projetstage.projetstage.entities;

import io.swagger.v3.oas.annotations.info.Contact;
import lombok.*;
import lombok.experimental.FieldDefaults;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.List;
@Setter
@Getter


@NoArgsConstructor
@ToString
@Entity
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Utilisateur {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idUser;

    private String nom;
    private String prenom;
    private String email;
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;
    @ManyToOne
    @JoinColumn(name ="idparent",nullable = true)
    private Utilisateur parent;
    private String photo;

    // ✅ Nouveau : code de réinitialisation
    private String resetCode;

    // ✅ Nouveau : date d’expiration du code
    private LocalDateTime resetCodeExpiry;

    // ✅ Optionnel : pour savoir si la réinitialisation est confirmée
    private boolean resetConfirmed = false;


    public Utilisateur(Long idUser, String nom, String prenom, String email, String password, Role role , String photo ) {
        this.idUser = idUser;
        this.nom = nom;
        this.prenom = prenom;
        this.email = email;
        this.password = password;
        this.role = role;
        this.photo=photo;

    }

    public Long getIdUser() {
        return idUser;
    }

    public void setIdUser(Long idUser) {
        this.idUser = idUser;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getPrenom() {
        return prenom;
    }

    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }


    public Utilisateur getParent() {
        return parent;
    }

    public void setParent(Utilisateur parent) {
        this.parent = parent;
    }

}
