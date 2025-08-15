package projetstage.projetstage.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import projetstage.projetstage.entities.DocumentFournisseur;

import java.util.List;

public interface DocumentFournisseurRepository extends JpaRepository<DocumentFournisseur , Long> {
    List<DocumentFournisseur> findByFournisseurId(Long fournisseurId);
}
