import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Notification, NotificationType } from '@shared/models/notification';

@Injectable({ providedIn: 'root' })
export class NotificationApiService {
  private baseUrl = 'http://localhost:8080/api/notifications'; // adapte si besoin

  constructor(private http: HttpClient) {}

  getUserNotifications(userId: number): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.baseUrl}/user/${userId}`);
  }

  getUnreadCount(userId: number): Observable<{ unreadCount: number }> {
    return this.http.get<{ unreadCount: number }>(`${this.baseUrl}/user/${userId}/unread-count`);
  }

  markAsRead(id: number): Observable<Notification> {
    return this.http.put<Notification>(`${this.baseUrl}/${id}/read`, {});
  }

  markAllAsRead(userId: number): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.baseUrl}/user/${userId}/read-all`, {});
  }

  deleteNotification(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`);
  }

  // (optionnel) filtrer par type via backend
  getByType(userId: number, type: NotificationType): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.baseUrl}/user/${userId}/type/${type}`);
  }
}