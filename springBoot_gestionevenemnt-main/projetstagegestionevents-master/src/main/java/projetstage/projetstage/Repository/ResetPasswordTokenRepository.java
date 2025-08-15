package projetstage.projetstage.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import projetstage.projetstage.entities.ResetPasswordToken;

import java.util.Optional;

public interface ResetPasswordTokenRepository extends JpaRepository<ResetPasswordToken, Long> {
    Optional<ResetPasswordToken> findByToken(String token);
}
