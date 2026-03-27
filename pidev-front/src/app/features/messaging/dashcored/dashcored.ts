import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Chat } from '../chat.models';
import { WebSocketService } from '../websocket.service';
import { ChatService } from '../chat.service';
import { AuthService } from '@core/services/auth-service';
import { ChatListComponent } from '../chat-list/chat-list';
import { ChatWindowComponent } from '../chat-window/chat-window';

@Component({
  selector: 'app-dashcored',
  standalone: true,
  imports: [ChatListComponent, ChatWindowComponent],
  templateUrl: './dashcored.html',
  styleUrls: ['./dashcored.scss'],
})
export class DashcoredComponent implements OnInit, OnDestroy {
  currentUserId = '';

  activeChat: Chat | null = null;

  constructor(
    private wsService: WebSocketService,
    private route: ActivatedRoute,
    private chatService: ChatService,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const uid = this.authService.getCurrentUserId();
    if (!uid) {
      void this.router.navigate(['/login']);
      return;
    }
    this.currentUserId = uid;
    this.wsService.connect(this.currentUserId);
    this.route.queryParams.subscribe((params) => {
      const withUserId = params['with'];
      if (withUserId) {
        this.openOrCreateChatWith(withUserId);
      }
    });
  }

  private openOrCreateChatWith(recipientId: string): void {
    if (!this.currentUserId) {
      return;
    }
    this.chatService.getUserChats(this.currentUserId).subscribe({
      next: (chats) => {
        const existing = chats.find(
          (c) => c.senderId === recipientId || c.recipientId === recipientId,
        );
        if (existing) {
          this.activeChat = existing;
        } else {
          this.chatService.createChat(this.currentUserId, recipientId).subscribe({
            next: (chat) => (this.activeChat = chat),
            error: () => {},
          });
        }
      },
      error: () => {},
    });
  }

  onChatSelected(chat: Chat): void {
    this.activeChat = chat;
  }

  ngOnDestroy(): void {
    this.wsService.disconnect();
  }
}
