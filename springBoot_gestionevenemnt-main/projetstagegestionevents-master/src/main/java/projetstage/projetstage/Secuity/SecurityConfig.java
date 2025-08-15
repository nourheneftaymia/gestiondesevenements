package projetstage.projetstage.Secuity;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.firewall.HttpFirewall;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import projetstage.projetstage.Service.CoustomUserDetailsService;

import java.util.List;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    private final CoustomUserDetailsService userDetailsService;

    public SecurityConfig(CoustomUserDetailsService userDetailsService) {
        this.userDetailsService = userDetailsService;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return NoOpPasswordEncoder.getInstance(); // à ne pas utiliser en production
    }

    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
        AuthenticationManagerBuilder builder = http.getSharedObject(AuthenticationManagerBuilder.class);
        builder.userDetailsService(userDetailsService).passwordEncoder(passwordEncoder());
        return builder.build();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        JwtAuthentificationFilter jwtFilter = new JwtAuthentificationFilter(jwtUtil(), userDetailsService);

        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // ✅ Config CORS ici
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/applications/login").permitAll()
                        .requestMatchers("/api/applications/sendcode").permitAll()
                        .requestMatchers("/api/applications/resetpassword").permitAll()
                        .requestMatchers("/api/applications/verifycode").permitAll()

                        .requestMatchers(HttpMethod.POST, "/api/utilisateurs/ajouter").hasAuthority("RESPONSABLE_RH")
                        .requestMatchers(HttpMethod.PUT, "/api/utilisateurs/modifier/*").hasAuthority("RESPONSABLE_RH")
                        .requestMatchers(HttpMethod.DELETE, "/api/utilisateurs/supprimer/*").hasAuthority("RESPONSABLE_RH")

                        .requestMatchers("/api/evenements/demanderEvenement").hasAuthority("SUPERIEUR_HEARARCHIQUE")
                        .requestMatchers("/api/evenements/modifierEvenement/**").hasAuthority("SUPERIEUR_HEARARCHIQUE")
                        .requestMatchers("/api/evenements/mes-demandes").hasAuthority("SUPERIEUR_HEARARCHIQUE")
                        .requestMatchers("/api/evenements/supprimerEvenement/**").hasAuthority("SUPERIEUR_HEARARCHIQUE")
                        .requestMatchers("/api/evenements/getDemandesEnAttente").hasAuthority("RESPONSABLE_RH")
                        .requestMatchers("/api/evenements/*/validerDemande").hasAuthority("RESPONSABLE_RH")
                        .requestMatchers("/api/evenements/getEvenementsRejetes").hasAuthority("RESPONSABLE_RH")
                        .requestMatchers("/api/evenements/getEvenementsValides").hasAuthority("RESPONSABLE_RH")
                        .requestMatchers("/api/evenements/*/validerAvecInfos").hasAuthority("RESPONSABLE_RH")


                        .requestMatchers(HttpMethod.PUT, "/api/evenements/*/rejeterDemande").hasAuthority("RESPONSABLE_RH")

                        .requestMatchers("/api/invitations/envoyer").hasAuthority("RESPONSABLE_RH")
                        .requestMatchers("/api/invitations/invitationsSend").hasAuthority("RESPONSABLE_RH")
                        .requestMatchers("/api/invitations/modifierInvitation/**").hasAuthority("RESPONSABLE_RH")
                        .requestMatchers("/api/invitations/supprimer/**").hasAuthority("RESPONSABLE_RH")

                        .requestMatchers("/api/fournisseurs/ajouter").hasAuthority("RESPONSABLE_RH")
                        .requestMatchers(HttpMethod.GET, "/api/fournisseurs/**").hasAuthority("RESPONSABLE_RH")
                        .requestMatchers(HttpMethod.POST, "/api/fournisseurs/*/documents").hasAuthority("RESPONSABLE_RH")


                        .requestMatchers("/api/evenements/mes-demandes").hasAuthority("SUPERIEUR_HEARARCHIQUE")
                        .requestMatchers("/api/evenements/supprimerEvenement/**").hasAuthority("SUPERIEUR_HEARARCHIQUE")
                        .requestMatchers("/api/evenements/getDemandesEnAttente").hasAuthority("RESPONSABLE_RH")
                        .requestMatchers("/api/invitations/envoyer").hasAuthority("RESPONSABLE_RH")
                        .requestMatchers("/api/invitations/invitationsSend").hasAuthority("RESPONSABLE_RH")
                        .requestMatchers("/api/invitations/modifier/**").hasAuthority("RESPONSABLE_RH")
                        .requestMatchers("/api/invitations/supprimer/**").hasAuthority("RESPONSABLE_RH")
                        .requestMatchers("/api/evenements/getEvenementsValides").permitAll()

                        .requestMatchers("/api/utilisateurs/liste").hasAuthority("RESPONSABLE_RH")
                        .requestMatchers("/api/invitations/details").hasAuthority("RESPONSABLE_RH")
                        .requestMatchers("/api/evenements/getById/**").hasAuthority("RESPONSABLE_RH")
                        .requestMatchers("/api/invitations/invitationsAcceptees").hasAuthority("SUPERIEUR_HEARARCHIQUE")
                        .requestMatchers("/api/invitations/validerInvitation/**").hasAuthority("SUPERIEUR_HEARARCHIQUE")
                        .requestMatchers("/api/invitations/rejeterInvitation/**").hasAuthority("SUPERIEUR_HEARARCHIQUE")
                        .requestMatchers("/api/invitations/utilisateurInvitation/**").hasAuthority("SUPERIEUR_HEARARCHIQUE")
                        .requestMatchers("/api/utilisateurs/upload-photo/**").hasAuthority("RESPONSABLE_RH")
                        .requestMatchers("/api/utilisateurs/photo/**").hasAuthority("RESPONSABLE_RH")
                        .requestMatchers("/api/utilisateurs/photo/**").permitAll()
                        .requestMatchers("/api/evenements/final").hasAuthority("RESPONSABLE_RH")
                        .requestMatchers("/api/evenements/finalcreate").hasAuthority("RESPONSABLE_RH")
                        .requestMatchers("/api/evenements/finalupdate").hasAuthority("RESPONSABLE_RH")
                        .requestMatchers("/api/evenements/finaldelete").hasAuthority("RESPONSABLE_RH")
                        .requestMatchers("api/evenements/finalListe").permitAll()
                        .requestMatchers("/api/evenements/updateFinal/**").hasAuthority("RESPONSABLE_RH")
                        .requestMatchers("/uploads/**").permitAll()
                        .requestMatchers("/api/evenements/statistiques/par-mois").hasAuthority("RESPONSABLE_RH")
                        .requestMatchers("/api/evenements/statistiques/categorie-pourcentage").hasAuthority("RESPONSABLE_RH")
                        .requestMatchers("/api/evenements/statistiques/evolution-top-categorie").hasAuthority("RESPONSABLE_RH")
                        .requestMatchers("/api/evenements/stats/fournisseurs").hasAuthority("RESPONSABLE_RH")
                        .requestMatchers("/api/evenements/plus-cher").hasAuthority("RESPONSABLE_RH")
                        .requestMatchers("/api/invitations/statistiques/taux-participation").hasAuthority("RESPONSABLE_RH")
                        .requestMatchers("/api/evenements/delete/**").hasAuthority("RESPONSABLE_RH")
                        .requestMatchers("/api/utilisateurs/current").authenticated()

                )
                .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:4200"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public HttpFirewall customHttpFirewall() {
        return new CustomHttpFirewall();
    }

    @Bean
    public WebSecurityCustomizer webSecurityCustomizer(HttpFirewall httpFirewall) {
        return (web) -> web.httpFirewall(httpFirewall);
    }

    @Bean
    public JwtUtil jwtUtil() {
        return new JwtUtil();
    }
}
