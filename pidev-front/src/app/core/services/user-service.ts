import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '@shared/models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  private authUrl = 'http://localhost:8080/api/auth';

  register(user: User): Observable<User> {
    return this.http.post<User>(`${this.authUrl}/register`, user);
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.authUrl}/login`, { email, password });
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.authUrl}/me`);
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.authUrl}/users`);
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.authUrl}/users/${id}`);
  }

  addUser(user: User): Observable<User> {
    // Pour création depuis interface admin, on utilise le endpoint register
    return this.http.post<User>(`${this.authUrl}/register`, user);
  }

  updateUser(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.authUrl}/users/${id}`, user);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.authUrl}/users/${id}`);
  }
}