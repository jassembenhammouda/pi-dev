import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chat } from '../chat.models';
import { ChatService } from '../chat.service';

@Component({
  selector: 'app-chat-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chat-list.html',
  styleUrls: ['./chat-list.scss'],
})
export class ChatListComponent implements OnInit {
  @Input() currentUserId!: string;
  @Output() chatSelected = new EventEmitter<Chat>();

  chats: Chat[] = [];
  selected: Chat | null = null;
  loading = true;

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.chatService.getUserChats(this.currentUserId).subscribe({
      next: (chats) => { this.chats = chats; this.loading = false; },
      error: () => (this.loading = false),
    });
  }

  select(chat: Chat): void {
    this.selected = chat;
    this.chatSelected.emit(chat);
  }

  displayName(chat: Chat): string {
    return this.chatService.getChatDisplayName(chat, this.currentUserId);
  }

  initials(chat: Chat): string {
    return this.chatService.getInitials(this.displayName(chat));
  }
}
