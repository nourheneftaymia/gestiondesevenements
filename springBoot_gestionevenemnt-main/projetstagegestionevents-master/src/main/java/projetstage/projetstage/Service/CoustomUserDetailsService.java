package projetstage.projetstage.Service;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import projetstage.projetstage.Repository.UtilisateurRepository;
import projetstage.projetstage.entities.Utilisateur;

import java.util.Collections;

@Service

    public class CoustomUserDetailsService implements UserDetailsService {

        private final UtilisateurRepository utilisateurRepository;

        public CoustomUserDetailsService(UtilisateurRepository utilisateurRepository) {
            this.utilisateurRepository = utilisateurRepository;
        }

        @Override
        public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
            // Si c'est le RH, retourne l'utilisateur codé en dur
            if (username.equals("rh@mail.com")) {
                return new User("rh@mail.com", "123456",
                        Collections.singletonList(new SimpleGrantedAuthority("RESPONSABLE_RH")));
            }
            // Sinon cherche en base (pour Supérieurs, Employés, etc.)
            Utilisateur user = utilisateurRepository.findByEmail(username)
                    .orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé"));
            return new User(user.getEmail(), user.getPassword(),
                    Collections.singletonList(new SimpleGrantedAuthority(user.getRole().name())));
        }
    }



