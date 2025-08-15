import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

   private apiUrl = 'http://localhost:8083/api/applications/login'; 

  constructor(private http: HttpClient) {}

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(this.apiUrl, credentials);
  }

  saveToken(token: string , role : string): void {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  envoyerCode(email: string) {
  return this.http.post<{ message?: string; error?: string }>(
    'http://localhost:8083/api/applications/sendcode',
    { email }
  );
}
verifierCode(email: string, code: string) {
  return this.http.post<{ message?: string; error?: string }>(
    'http://localhost:8083/api/applications/verifycode',
    { email, code }
  );
}

resetPassword(email: string, code: string, nouveauMotDePasse: string) {
  return this.http.post<{ message?: string; error?: string }>(
    'http://localhost:8083/api/applications/resetpassword',
    { email, code, nouveauMotDePasse }
  );
}

}

