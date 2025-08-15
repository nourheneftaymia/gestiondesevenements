package projetstage.projetstage.entities;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Setter
@Getter


@NoArgsConstructor
@ToString
@Entity
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Invitation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idInvitation;

    @ManyToOne
    @JoinColumn(name="user_id_user")
    private Utilisateur user;

    @ManyToOne
    @JoinColumn(name="evenement_id_evenement")
    private Evenement evenement;

    private StatusValidation StatusInvitation;

    private String message;






}
