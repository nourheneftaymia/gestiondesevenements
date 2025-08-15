package projetstage.projetstage.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.w3c.dom.stylesheets.LinkStyle;
import projetstage.projetstage.Service.FournisseurService;
import projetstage.projetstage.entities.DocumentFournisseur;
import projetstage.projetstage.entities.Fournisseur;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/fournisseurs")

public class FournisseurController {

    @Autowired
    private FournisseurService fournisseurService;
    @PreAuthorize("hasAuthority('RESPONSABLE_RH')")
    @PostMapping("/ajouter")
    public ResponseEntity<Fournisseur> ajouterFournisseur(@RequestBody Fournisseur f) {
        return ResponseEntity.ok(fournisseurService.ajouterFournisseur(f));
    }
    @PreAuthorize("hasAuthority('RESPONSABLE_RH')")
    @GetMapping
    public ResponseEntity<List<Fournisseur>> getAll() {
        return ResponseEntity.ok(fournisseurService.getAllFournisseurs());
    }
    @PreAuthorize("hasAuthority('RESPONSABLE_RH')")
    @GetMapping("/{id}")
    public ResponseEntity<Fournisseur> getById(@PathVariable Long id) {
        return fournisseurService.getFournisseurById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    @PreAuthorize("hasAuthority('RESPONSABLE_RH')")
    @PostMapping("/{id}/documents")
    public ResponseEntity<?> ajouterDocument(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file,
            @RequestParam("commentaire") String commentaire) throws IOException {

        DocumentFournisseur doc = fournisseurService.ajouterDocument(id, file, commentaire);
        return ResponseEntity.ok(doc);
    }
    @PreAuthorize("hasAuthority('RESPONSABLE_RH')")
    @GetMapping("/{id}/documents")
    public ResponseEntity<List<DocumentFournisseur>> getDocuments(@PathVariable Long id) {
        return ResponseEntity.ok(fournisseurService.getDocumentsByFournisseur(id));
    }
}

