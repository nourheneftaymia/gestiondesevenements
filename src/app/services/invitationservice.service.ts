import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthServiceService } from './auth-service.service';
import { TauxParticipationParEvenement } from '../Models/TauxParticipationParEvenement';

@Injectable({
  providedIn: 'root'
})
export class InvitationserviceService {

   private apiUrl = 'http://localhost:8083/api/invitations';

  constructor(private http: HttpClient, private authService: AuthServiceService) {}

  private getAuthHeaders() {
    const token = this.authService.getToken();
    return token
      ? { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) }
      : {};
  }

  //  Envoyer une invitation
  envoyerInvitation(invitation: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/envoyer`, invitation, this.getAuthHeaders());
  }
  // Récupérer toutes les invitations envoyées
  getAllInvitations(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/invitationsSend`, this.getAuthHeaders());
  }

  //  Récupérer les invitations d’un utilisateur
  getParUtilisateur(idUser: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/utilisateur/${idUser}`, this.getAuthHeaders());
  }

  //  Valider une invitation
  validerInvitation(idInvitation: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/validerInvitation/${idInvitation}`, null, this.getAuthHeaders());
  }

  //  Rejeter une invitation
  rejeterInvitation(idInvitation: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/rejeterInvitation/${idInvitation}`, null, this.getAuthHeaders());
  }

  //  Récupérer toutes les invitations avec détails
  getAllInvitationsAvecDetails(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/details`, this.getAuthHeaders());
  }

  //  Modifier une invitation
  modifierInvitation(invitation: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/modifierInvitation/${invitation.idInvitation}`, invitation, this.getAuthHeaders());
  }

  //  Récupérer les invitations d’un utilisateur avec un autre endpoint
  getInvitationsByUser(idUser: number): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/utilisateurInvitation/${idUser}`, this.getAuthHeaders());
  }

  //  Supprimer une invitation
  supprimerInvitation(idInvitation: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/supprimer/${idInvitation}`, this.getAuthHeaders());
  }

  //  Récupérer les invitations acceptées
  getInvitationsAcceptees(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/invitationsAcceptees`, this.getAuthHeaders());
  }

  
  getTauxParticipation(): Observable<TauxParticipationParEvenement[]> {
    return this.http.get<TauxParticipationParEvenement[]>(`${this.apiUrl}/statistiques/taux-participation`, this.getAuthHeaders());
  }
}