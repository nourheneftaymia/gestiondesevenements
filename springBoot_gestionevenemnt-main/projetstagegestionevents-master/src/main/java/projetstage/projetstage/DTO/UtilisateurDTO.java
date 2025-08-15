package projetstage.projetstage.DTO;

import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import projetstage.projetstage.entities.Role;

@Getter
@Setter
@Data
@NoArgsConstructor
public class UtilisateurDTO {
    private Long idUser;
    private String nom;
    private String prenom;
    private String email;
    private String password;
    private Role role;
    private Long idParent;
    private String photo;


    public UtilisateurDTO(Long idUser, String nom, String prenom,String email,String password, Role role , String photo ) {
        this.idUser = idUser;
        this.nom = nom;
        this.prenom = prenom;
        this.email = email;
        this.password=password;
        this.role = role;
        this.photo= photo;
    }

    // Constructor to set all fields
    public UtilisateurDTO(Long idUser, String email, String nom, String prenom, Role role) {
        this.idUser = idUser;
        this.nom = nom;
        this.prenom = prenom;
        this.email = email;
        this.password = password;
        this.role = role;
        this.idParent = idParent;
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



}
