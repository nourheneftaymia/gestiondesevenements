package projetstage.projetstage.Secuity;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletRequestWrapper;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.web.firewall.HttpFirewall;
import org.springframework.security.web.firewall.StrictHttpFirewall;
import org.springframework.security.web.firewall.FirewalledRequest;

/**
 * Classe personnalisée de HttpFirewall permettant de filtrer certaines séquences de caractères
 * potentiellement malicieuses (comme "%0A" qui représente un saut de ligne) dans les URLs.
 */
public class CustomHttpFirewall implements HttpFirewall {

    // Délégué de base : StrictHttpFirewall fourni par Spring Security
    private final StrictHttpFirewall delegate = new StrictHttpFirewall();

    /**
     * Nettoie les caractères spéciaux indésirables dans l'URI et le chemin du servlet
     * avant que la requête ne soit traitée par le firewall.
     */
    @Override
    public FirewalledRequest getFirewalledRequest(HttpServletRequest request) {
        HttpServletRequest wrappedRequest = new HttpServletRequestWrapper(request) {
            @Override
            public String getRequestURI() {
                String uri = super.getRequestURI();
                if (uri != null) {
                    // Supprime les sauts de ligne encodés dans l'URI
                    uri = uri.replace("%0A", "").replace("\n", "");
                }
                return uri;
            }

            @Override
            public String getServletPath() {
                String path = super.getServletPath();
                if (path != null) {
                    // Supprime les sauts de ligne encodés dans le chemin du servlet
                    path = path.replace("%0A", "").replace("\n", "");
                }
                return path;
            }
        };

        // Passe la requête filtrée au firewall standard
        return delegate.getFirewalledRequest(wrappedRequest);
    }

    /**
     * Retourne la réponse telle quelle (pas de modification du côté réponse).
     */
    @Override
    public HttpServletResponse getFirewalledResponse(HttpServletResponse response) {
        return response;
    }
}
