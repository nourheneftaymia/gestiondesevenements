package projetstage.projetstage.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import projetstage.projetstage.entities.Fournisseur;

@Repository
public interface FournisseurRepository  extends JpaRepository<Fournisseur ,Long> {
}
