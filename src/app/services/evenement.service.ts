import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { EvenementDTO } from '../Models/EvenementDTO';
import { AuthServiceService } from './auth-service.service';
@Injectable({
  providedIn: 'root'
})
export class EvenementService {

  private baseUrl = 'http://localhost:8083/api/evenements';

  constructor(private http: HttpClient,private authService: AuthServiceService) {
  }

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }),
    };
  }


 // ⚠️ NE PAS ajouter 'Content-Type' ici !
  getAuthHeadersForFormData() {
    const token = this.authService.getToken();

    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };
  }

  // 1. Demander un événement (SUPERIEUR)
  demanderEvenement(evenement: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/demanderEvenement`, evenement, this.getAuthHeaders());
  }

  // 2. Obtenir les demandes de l'utilisateur connecté (SUPERIEUR)
  getMesDemandes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/mes-demandes`, this.getAuthHeaders());
  }

  // 3. Modifier un événement
  updateEvenement(id: number, evenement: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/modifierEvenement/${id}`, evenement, this.getAuthHeaders());
  }

  // 4. Supprimer un événement
  supprimerEvenement(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/supprimerEvenement/${id}`, this.getAuthHeaders());
  }
  

  // 5. RH: récupérer les demandes en attente
  getDemandesEnAttente(): Observable<EvenementDTO[]> {
    return this.http.get<EvenementDTO[]>(`${this.baseUrl}/getDemandesEnAttente`, this.getAuthHeaders());
  }

  // 6. RH: valider une demande sans infos supplémentaires
  validerDemande(id: number): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/${id}/validerDemande`,
      null,
      { ...this.getAuthHeaders(), responseType: 'text' as 'json' }
    );
  }

  // 7. RH: rejeter une demande avec commentaire
  rejeterDemande(id: number, commentaire: string): Observable<any> {
    const body = { commentaireRh: commentaire };
    return this.http.put(`${this.baseUrl}/${id}/rejeterDemande`, body, {
      ...this.getAuthHeaders(),
      responseType: 'text' as 'json'
    });
  }

  // 8. RH: obtenir les événements validés
  getEvenementsValides(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/getEvenementsValides`, this.getAuthHeaders());
  }

  // 9. RH: obtenir les événements rejetés
  getEvenementsRejetes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/getEvenementsRejetes`, this.getAuthHeaders());
  }

  // 10. RH: valider une demande avec infos (budget, lieu, date, etc.)
// 10. RH: valider une demande avec infos (budget, lieu, date, etc.)
validerDemandeAvecInfos(id: number, dto: any): Observable<any> {
  return this.http.put(`${this.baseUrl}/${id}/validerAvecInfos`, dto, this.getAuthHeaders());
}

getEvenementById(id: number): Observable<any> {
  return this.http.get<any>(`${this.baseUrl}/getById/${id}`, this.getAuthHeaders());
}



updateEvenementFinal(id: number, evenement: any): Observable<any> {
  return this.http.put(`${this.baseUrl}/updateFinal/${id}`, evenement, this.getAuthHeaders());}




deleteEvenementFinal(id: number): Observable<any> {
  return this.http.delete(`${this.baseUrl}/deleteFinal/${id}`, this.getAuthHeaders());}


getAllEvenementsFinal(): Observable<any[]> {
  return this.http.get<any[]>(`${this.baseUrl}/finalListe`, this.getAuthHeaders());
}


createEvenementFinal(data: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/finalcreate`, data, this.getAuthHeadersForFormData());
  }

getStatsFinalisesParRh(): Observable<{ [key: string]: number }> {
  const headers = new HttpHeaders({
    Authorization: `Bearer ${this.authService.getToken()}`
  });
  return this.http.get<{ [key: string]: number }>(
    `${this.baseUrl}/statistiques/par-mois`,
    { headers }
  );
}
getStatsPourcentageCategorie(): Observable<any[]> {
  return this.http.get<any[]>(
    `${this.baseUrl}/statistiques/categorie-pourcentage`,
    this.getAuthHeaders()
  );
}
getEvolutionTopCategorie(): Observable<{ [key: string]: number }> {
  return this.http.get<{ [key: string]: number }>(
    `${this.baseUrl}/statistiques/evolution-top-categorie`,
    this.getAuthHeaders()
  );
}

getStatsFournisseursUtilisation(): Observable<{ [key: string]: number }> {
  return this.http.get<{ [key: string]: number }>(
    `${this.baseUrl}/stats/fournisseurs`,
    this.getAuthHeaders()
  );
}

 getEvenementPlusCherAvecRepartition(): Observable<any> {
    return this.http.get(`${this.baseUrl}/plus-cher` ,this.getAuthHeaders());
  }
  countEvenementsParRh(): Observable<number> {
  return this.http.get<number>(`${this.baseUrl}/countByRh` ,this.getAuthHeaders());
  
  

}
  deleteEvenement(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/delete/${id}`, this.getAuthHeaders());
  }



}
