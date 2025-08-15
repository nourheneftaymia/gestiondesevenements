package projetstage.projetstage.Service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import projetstage.projetstage.Repository.DocumentFournisseurRepository;
import projetstage.projetstage.Repository.FournisseurRepository;
import projetstage.projetstage.entities.DocumentFournisseur;
import projetstage.projetstage.entities.Fournisseur;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class FournisseurService {

    @Autowired
    private FournisseurRepository fournisseurRepository;

    @Autowired
    private DocumentFournisseurRepository documentRepository;

    public Fournisseur ajouterFournisseur(Fournisseur f) {
        return fournisseurRepository.save(f);
    }

    public List<Fournisseur> getAllFournisseurs() {
        return fournisseurRepository.findAll();
    }

    public Optional<Fournisseur> getFournisseurById(Long id) {
        return fournisseurRepository.findById(id);
    }

    public DocumentFournisseur ajouterDocument(Long fournisseurId, MultipartFile file, String commentaire) throws IOException {
        Fournisseur fournisseur = fournisseurRepository.findById(fournisseurId)
                .orElseThrow(() -> new IllegalArgumentException("Fournisseur introuvable"));

        // Sauvegarder le fichier dans un dossier local
        String nomFichier = file.getOriginalFilename();
        Path dossier = Paths.get("uploads/fournisseurs/" + fournisseurId);
        Files.createDirectories(dossier);
        Path cheminFichier = dossier.resolve(nomFichier);
        Files.write(cheminFichier, file.getBytes(), StandardOpenOption.CREATE);

        // Enregistrer dans la base
        DocumentFournisseur doc = new DocumentFournisseur();
        doc.setFournisseur(fournisseur);
        doc.setNomFichier(nomFichier);
        doc.setCommentaire(commentaire);
        doc.setDateAjout(LocalDateTime.now());

        return documentRepository.save(doc);
    }

    public List<DocumentFournisseur> getDocumentsByFournisseur(Long fournisseurId) {
        return documentRepository.findByFournisseurId(fournisseurId);
    }
}
