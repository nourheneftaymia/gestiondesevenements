package projetstage.projetstage.Controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import projetstage.projetstage.DTO.InvitationDTO;
import projetstage.projetstage.DTO.TauxParticipationParEvenement;
import projetstage.projetstage.Service.InvitationService;
import projetstage.projetstage.entities.Invitation;
import projetstage.projetstage.entities.Priorite;

import java.util.List;

@RestController
@RequestMapping("/api/invitations")
@RequiredArgsConstructor
public class InvitationController {

    private final InvitationService invitationService;

    // ✅ Envoyer une invitation (par un RH)
    @PreAuthorize("hasAuthority('RESPONSABLE_RH')")
    @PostMapping("/envoyer")
    public ResponseEntity<InvitationDTO> envoyerInvitation(@RequestBody InvitationDTO invitationDTO) {
        InvitationDTO invitationCreee = invitationService.envoyerInvitation(invitationDTO);
        return ResponseEntity.ok(invitationCreee);
    }
    @PreAuthorize("hasAuthority('RESPONSABLE_RH')")
    @GetMapping("/invitationsSend")
    public List<Invitation> getAllInvitations() {
        return invitationService.getAllInvitations();
    }


    // ✅ ✅ Endpoint pour récupérer les invitations par utilisateur
    @PreAuthorize("hasAuthority('SUPERIEUR_HEARARCHIQUE')")
    @GetMapping("/utilisateurInvitation/{idUser}")
    public ResponseEntity<List<InvitationDTO>> getInvitationsByUser(@PathVariable Long idUser) {
        List<InvitationDTO> invitations = invitationService.getInvitationsByUser(idUser);
        if (invitations.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(invitations);
    }

    // ✅ Valider une invitation
    @PreAuthorize("hasAuthority('SUPERIEUR_HEARARCHIQUE')")
    @PutMapping("/validerInvitation/{idInvitation}")
    public ResponseEntity<InvitationDTO> validerInvitation(@PathVariable Long idInvitation) {
        InvitationDTO invitationValidee = invitationService.mettreAJourStatutInvitation(idInvitation, "VALIDEE");
        return ResponseEntity.ok(invitationValidee);
    }

    // ✅ Rejeter une invitation
    @PreAuthorize("hasAuthority('SUPERIEUR_HEARARCHIQUE')")
    @PutMapping("/rejeterInvitation/{idInvitation}")
    public ResponseEntity<InvitationDTO> rejeterInvitation(@PathVariable Long idInvitation) {
        InvitationDTO invitationRejetee = invitationService.mettreAJourStatutInvitation(idInvitation, "REJETEE");
        return ResponseEntity.ok(invitationRejetee);
    }


    // ➕ Modifier une invitation
    @PreAuthorize("hasAuthority('RESPONSABLE_RH')")
    @PutMapping("/modifierInvitation/{idInvitation}")
    public ResponseEntity<InvitationDTO> modifierInvitation(@PathVariable Long idInvitation,
                                                            @RequestBody InvitationDTO invitationDTO) {
        InvitationDTO invitationModifiee = invitationService.modifierInvitation(idInvitation, invitationDTO);
        return ResponseEntity.ok(invitationModifiee);
    }

    // ➕ Supprimer une invitation
    @PreAuthorize("hasAuthority('RESPONSABLE_RH')")
    @DeleteMapping("/supprimer/{idInvitation}")
    public ResponseEntity<Void> supprimerInvitation(@PathVariable Long idInvitation) {
        invitationService.supprimerInvitation(idInvitation);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasAuthority('RESPONSABLE_RH')")
    @GetMapping("/details")
    public ResponseEntity<List<InvitationDTO>> getAllInvitationsAvecDetails() {
        List<InvitationDTO> invitations = invitationService.getAllInvitationsAvecDetails();
        return ResponseEntity.ok(invitations);
    }

    @PreAuthorize("hasAuthority('SUPERIEUR_HEARARCHIQUE')")
    @GetMapping("/invitationsAcceptees")
    public List<InvitationDTO> getInvitationsAcceptees() {
        return invitationService.getInvitationsAcceptees(); // status_invitation = 1
    }

    @PreAuthorize("hasAuthority('RESPONSABLE_RH')")
    @GetMapping("/statistiques/taux-participation")
    public ResponseEntity<List<TauxParticipationParEvenement>> getTauxParticipation() {
        List<TauxParticipationParEvenement> stats = invitationService.calculerTauxParticipationParEvenement();
        return ResponseEntity.ok(stats);
    }
}
