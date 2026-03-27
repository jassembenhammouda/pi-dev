import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Chat, Message } from './chat.models';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private readonly base = 'http://localhost:8080/api/chats';

  constructor(private http: HttpClient) {}

  getUserChats(userId: string): Observable<Chat[]> {
    return this.http.get<Chat[]>(`${this.base}/user/${userId}`);
  }

  getChatMessages(chatId: string): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.base}/${chatId}/messages`);
  }

  createChat(senderId: string, recipientId: string): Observable<Chat> {
    return this.http.post<Chat>(`${this.base}/create`, null, {
      params: { senderId, recipientId },
    });
  }

  markAsRead(messageId: number): Observable<void> {
    return this.http.put<void>(`${this.base}/messages/${messageId}/read`, null);
  }

  uploadMedia(file: File): Observable<{ mediaFilePath: string }> {
    const form = new FormData();
    form.append('file', file);
    return this.http.post<{ mediaFilePath: string }>(`${this.base}/upload-media`, form);
  }

  getChatDisplayName(chat: Chat, currentUserId: string): string {
    return chat.senderId === currentUserId ? chat.recipientId : chat.senderId;
  }

  getInitials(name: string): string {
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  }
}
