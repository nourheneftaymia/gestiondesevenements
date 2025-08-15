package projetstage.projetstage.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import projetstage.projetstage.entities.Invitation;
import projetstage.projetstage.entities.Utilisateur;

import java.util.Arrays;
import java.util.List;

@Repository
public interface InvitationRepository extends JpaRepository<Invitation, Long> {
    List<Invitation> findByUserIdUser(Long idUser);

    @Query("SELECT i FROM Invitation i WHERE i.StatusInvitation = projetstage.projetstage.entities.StatusValidation.VALIDEE")
    List<Invitation> findAllAcceptedInvitations();
}
