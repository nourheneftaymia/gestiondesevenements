import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { Fournisseur } from '../Models/Fournisseur';
import { DocumentFournisseur } from '../Models/DocumentFournisseur';

@Injectable({
  providedIn: 'root'
})
export class FournisseurServiceService {
  private API_URL = 'http://localhost:8083/api/fournisseurs';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  getAllFournisseurs(): Observable<Fournisseur[]> {
    return this.http.get<Fournisseur[]>(this.API_URL, {
      headers: this.getAuthHeaders(),
    });
  }

  ajouterFournisseur(fournisseur: Fournisseur): Observable<Fournisseur> {
    return this.http.post<Fournisseur>(`${this.API_URL}/ajouter`, fournisseur, {
      headers: this.getAuthHeaders(),
    });
  }

  getFournisseurById(id: number): Observable<Fournisseur> {
    return this.http.get<Fournisseur>(`${this.API_URL}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  uploadDocument(id: number, file: File, commentaire: string): Observable<DocumentFournisseur> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('commentaire', commentaire);
    return this.http.post<DocumentFournisseur>(`${this.API_URL}/${id}/documents`, formData, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      })
    });
  }

getDocumentsByFournisseur(id: number): Observable<DocumentFournisseur[]> {
  return this.http.get<DocumentFournisseur[]>(`${this.API_URL}/${id}/documents`, {
    headers: this.getAuthHeaders()
  });
}

}
