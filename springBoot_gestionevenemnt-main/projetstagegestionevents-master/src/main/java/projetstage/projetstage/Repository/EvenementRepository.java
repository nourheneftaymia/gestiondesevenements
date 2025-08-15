package projetstage.projetstage.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import projetstage.projetstage.entities.Evenement;
import projetstage.projetstage.entities.StatusValidation;
import projetstage.projetstage.entities.Utilisateur;

import java.util.List;

public interface EvenementRepository extends JpaRepository<Evenement, Long> {
    List<Evenement> findByStatusValidation(StatusValidation status);

    List<Evenement> findByCreateur(Utilisateur createur);
    @Query("SELECT DISTINCT e FROM Evenement e LEFT JOIN FETCH e.fournisseurs WHERE e.statusValidation IS NULL")
    List<Evenement> findAllFinalWithFournisseurs();

    @Query("SELECT YEAR(e.dateEvenement), MONTH(e.dateEvenement), COUNT(e) " +
            "FROM Evenement e " +
            "WHERE e.dateEvenement IS NOT NULL " +
            "GROUP BY YEAR(e.dateEvenement), MONTH(e.dateEvenement) " +
            "ORDER BY YEAR(e.dateEvenement), MONTH(e.dateEvenement)")
    List<Object[]> countEvenementsRhFinalisesParMois();

    @Query("SELECT e.categorieEvenement, COUNT(e) " +
            "FROM Evenement e " +
            "WHERE e.statusValidation = projetstage.projetstage.entities.StatusValidation.VALIDEE " +
            "GROUP BY e.categorieEvenement")
    List<Object[]> countEvenementsValidesParCategorie();

    @Query("""
    SELECT e.categorieEvenement, YEAR(e.dateEvenement), MONTH(e.dateEvenement), COUNT(e)
    FROM Evenement e
    GROUP BY e.categorieEvenement, YEAR(e.dateEvenement), MONTH(e.dateEvenement)
    ORDER BY COUNT(e) DESC
""")
    List<Object[]> findCategorieEvolution();
}
