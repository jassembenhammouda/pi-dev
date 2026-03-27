import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

/** Réponse login / register : alignée sur l’entité User backend (id UUID string). */
export interface AuthResponse {
  token?: string;
  type?: string;
  id: string;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private authUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.authUrl}/login`, { email, password }).pipe(
      tap((res) => this.persistSession(res)),
    );
  }

  /** À appeler après login réussi (y compris auto-login après inscription). */
  persistSession(res: AuthResponse): void {
    if (res.token != null && res.token !== '') {
      localStorage.setItem('authToken', res.token);
    }
    if (res.role != null) {
      localStorage.setItem('authRole', res.role);
    }
    if (res.email != null) {
      localStorage.setItem('authEmail', res.email);
    }
    if (res.id != null && String(res.id).length > 0) {
      localStorage.setItem('authUserId', String(res.id));
    }
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authRole');
    localStorage.removeItem('authEmail');
    localStorage.removeItem('authUserId');
  }

  getToken(): string | null { return localStorage.getItem('authToken'); }

  /** Identifiant utilisateur pour le chat et les topics STOMP (même string que senderId côté API). */
  getCurrentUserId(): string | null {
    return localStorage.getItem('authUserId');
  }
  isAdmin(): boolean {
    const role = localStorage.getItem('authRole');
    return role != null && role.toUpperCase() === 'ADMIN';
  }
  isLoggedIn(): boolean {
    const t = this.getToken();
    if (t && t !== 'undefined' && t !== 'null') {
      return true;
    }
    return !!(this.getCurrentUserId() && localStorage.getItem('authEmail'));
  }
}
