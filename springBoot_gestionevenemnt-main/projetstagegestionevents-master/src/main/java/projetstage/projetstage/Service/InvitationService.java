package projetstage.projetstage.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import projetstage.projetstage.DTO.InvitationDTO;
import projetstage.projetstage.DTO.TauxParticipationParEvenement;
import projetstage.projetstage.Repository.EvenementRepository;
import projetstage.projetstage.Repository.InvitationRepository;
import projetstage.projetstage.Repository.UtilisateurRepository;
import projetstage.projetstage.entities.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class InvitationService {

    private final InvitationRepository invitationRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final EvenementRepository evenementRepository;

    public InvitationService(InvitationRepository invitationRepository, UtilisateurRepository utilisateurRepository, EvenementRepository evenementRepository) {
        this.invitationRepository = invitationRepository;
        this.utilisateurRepository = utilisateurRepository;
        this.evenementRepository = evenementRepository;
    }
    public List<Invitation> getInvitationsByUserId(Long userId) {
        return invitationRepository.findByUserIdUser(userId);
    }

    // Envoi invitation: on reçoit un DTO avec les infos, on retourne un DTO
    public InvitationDTO envoyerInvitation(InvitationDTO invitationDTO) {
        Utilisateur user = utilisateurRepository.findById(invitationDTO.getIdUser())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        Evenement evenement = evenementRepository.findById(invitationDTO.getIdEvenement())
                .orElseThrow(() -> new RuntimeException("Événement non trouvé"));

        Invitation invitation = new Invitation();
        invitation.setUser(user);
        invitation.setEvenement(evenement);
        invitation.setStatusInvitation(StatusValidation.EN_ATTENTE);
        invitation.setMessage(invitationDTO.getMessage()); // Ajouter le message si tu l’utilises côté entité

        Invitation saved = invitationRepository.save(invitation);
        return toDTO(saved);
    }

    // Récupération invitations d'un utilisateur sous forme DTO
    public List<InvitationDTO> getInvitationsByUser(Long IdUse) {
        List<Invitation> invitations = invitationRepository.findByUserIdUser(IdUse);

        return invitations.stream().map(invitation -> {
            Evenement evenement = invitation.getEvenement();
            Utilisateur user = invitation.getUser();

            return new InvitationDTO(
                    invitation.getIdInvitation(),
                    user.getIdUser(),
                    evenement.getIdEvenement(),
                    invitation.getStatusInvitation(),
                    invitation.getMessage(),
                    user.getEmail(),
                    evenement.getTitre(),
                    user.getNom(),
                    user.getPrenom(),
                    evenement.getLieu(),
                    evenement.getDateDebut(),
                    evenement.getDateFin(),
                    evenement.getDescription() // ⚠️ important
            );
        }).collect(Collectors.toList());
    }

    // Validation d'une invitation, retourne DTO mis à jour
    public InvitationDTO validerInvitation(Long idInvitation) {
        Invitation invitation = invitationRepository.findById(idInvitation)
                .orElseThrow(() -> new RuntimeException("Invitation introuvable"));
        invitation.setStatusInvitation(StatusValidation.VALIDEE); // Corrigé : passer à VALIDÉE
        Invitation updated = invitationRepository.save(invitation);
        return toDTO(updated);
    }

    // Mapper interne entité -> DTO
    private InvitationDTO toDTO(Invitation invitation) {
        InvitationDTO dto = new InvitationDTO();
        dto.setIdInvitation(invitation.getIdInvitation());
        dto.setIdUser(invitation.getUser().getIdUser());
        dto.setIdEvenement(invitation.getEvenement().getIdEvenement());
        dto.setStatusInvitation(invitation.getStatusInvitation());
        dto.setMessage(invitation.getMessage()); // Assure-toi que getMessage() existe
        return dto;
    }


    public InvitationDTO mettreAJourStatutInvitation(Long idInvitation, String nouveauStatut) {
        Invitation invitation = invitationRepository.findById(idInvitation)
                .orElseThrow(() -> new RuntimeException("Invitation introuvable avec ID : " + idInvitation));

        // Convertir le String en Enum
        StatusValidation statut;
        try {
            statut = StatusValidation.valueOf(nouveauStatut.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Statut invalide : " + nouveauStatut);
        }

        invitation.setStatusInvitation(statut);
        invitationRepository.save(invitation);

        // Mapper vers DTO
        InvitationDTO dto = new InvitationDTO();
        dto.setIdInvitation(invitation.getIdInvitation());
        dto.setIdUser(invitation.getUser().getIdUser());
        dto.setIdEvenement(invitation.getEvenement().getCreateur().getIdUser());
        dto.setStatusInvitation(invitation.getStatusInvitation());
        dto.setMessage(invitation.getMessage());

        return dto;
    }


    // Modifier une invitation (avec DTO, idInvitation pour cibler)
    public InvitationDTO modifierInvitation(Long idInvitation, InvitationDTO invitationDTO) {
        Invitation invitation = invitationRepository.findById(idInvitation)
                .orElseThrow(() -> new RuntimeException("Invitation introuvable avec ID : " + idInvitation));

        // Mettre à jour les champs modifiables
        if (invitationDTO.getIdUser() != null) {
            Utilisateur user = utilisateurRepository.findById(invitationDTO.getIdUser())
                    .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
            invitation.setUser(user);
        }

        if (invitationDTO.getIdEvenement() != null) {
            Evenement evenement = evenementRepository.findById(invitationDTO.getIdEvenement())
                    .orElseThrow(() -> new RuntimeException("Événement non trouvé"));
            invitation.setEvenement(evenement);
        }

        if (invitationDTO.getStatusInvitation() != null) {
            invitation.setStatusInvitation(invitationDTO.getStatusInvitation());
        }

        if (invitationDTO.getMessage() != null) {
            invitation.setMessage(invitationDTO.getMessage());
        }

        Invitation updated = invitationRepository.save(invitation);
        return toDTO(updated);
    }

    // Supprimer une invitation par son ID
    public void supprimerInvitation(Long idInvitation) {
        if (!invitationRepository.existsById(idInvitation)) {
            throw new RuntimeException("Invitation introuvable avec ID : " + idInvitation);
        }
        invitationRepository.deleteById(idInvitation);
    }


    public List<Invitation> getAllInvitations() {
        return invitationRepository.findAll();
    }


    //get les invitations envoyer par email et par titre

    public List<InvitationDTO> getAllInvitationsAvecDetails() {
        List<Invitation> invitations = invitationRepository.findAll();
        List<InvitationDTO> dtos = new ArrayList<>();

        for (Invitation inv : invitations) {
            Utilisateur user = inv.getUser();
            Evenement event = inv.getEvenement();

            String email = (user != null) ? user.getEmail() : "Utilisateur inconnu";
            String nom = (user != null) ? user.getNom() : "Nom inconnu";
            String prenom = (user != null) ? user.getPrenom() : "Prénom inconnu";
            Long idUser = (user != null) ? user.getIdUser() : null;
            String description = (event != null && event.getDescription() != null) ? event.getDescription() : "Description non disponible";

            String titre = (event != null) ? event.getTitre() : "Événement inconnu";
            String lieu = (event != null) ? event.getLieu() : "Lieu inconnu";

            LocalDate dateDebut = (event != null) ? event.getDateDebut() : null;
            LocalDate dateFin = (event != null) ? event.getDateFin() : null;
            Long idEvenement = (event != null) ? event.getIdEvenement() : null;

            InvitationDTO dto = new InvitationDTO(
                    inv.getIdInvitation(),
                    idUser,
                    idEvenement,
                    inv.getStatusInvitation(),
                    inv.getMessage(),
                    email,
                    titre,
                    nom,
                    prenom,
                    lieu,
                    dateDebut,
                    dateFin,
                    description
            );

            dtos.add(dto);
        }

        return dtos;
    }



    public List<InvitationDTO> getInvitationsAcceptees() {
        return invitationRepository.findAllAcceptedInvitations()
                .stream()
                .map(inv -> new InvitationDTO(
                        inv.getEvenement().getTitre(),
                        inv.getEvenement().getDateDebut(),
                        inv.getEvenement().getDateFin()
                ))
                .collect(Collectors.toList());
    }


    public List<TauxParticipationParEvenement> calculerTauxParticipationParEvenement() {
        List<Invitation> invitations = invitationRepository.findAll();

        // Grouper par événement
        Map<Evenement, List<Invitation>> invitationsParEvenement = invitations.stream()
                .collect(Collectors.groupingBy(Invitation::getEvenement));

        List<TauxParticipationParEvenement> stats = new ArrayList<>();

        for (Map.Entry<Evenement, List<Invitation>> entry : invitationsParEvenement.entrySet()) {
            Evenement evenement = entry.getKey();
            List<Invitation> invs = entry.getValue();

            long total = invs.size();
            long validées = invs.stream()
                    .filter(inv -> inv.getStatusInvitation() == StatusValidation.VALIDEE)
                    .count();

            double taux = total > 0 ? ((double) validées / total) * 100 : 0;

            stats.add(new TauxParticipationParEvenement(
                    evenement.getIdEvenement(),
                    evenement.getTitre(),
                    total,
                    (int) validées,
                    taux
            ));
        }

        return stats;
    }


}