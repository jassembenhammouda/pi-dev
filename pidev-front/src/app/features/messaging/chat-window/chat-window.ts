import {
  Component, OnInit, OnDestroy, Input, OnChanges,
  SimpleChanges, ViewChild, ElementRef, AfterViewChecked
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Chat, Message, MessageType } from '../chat.models';
import { ChatService } from '../chat.service';
import { WebSocketService } from '../websocket.service';
import RecordRTC from 'recordrtc';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-chat-window',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-window.html',
  styleUrls: ['./chat-window.scss'],
})
export class ChatWindowComponent implements OnInit, OnDestroy, OnChanges, AfterViewChecked {
  @Input() chat: Chat | null = null;
  @Input() currentUserId!: string;
  @ViewChild('messagesEnd') private messagesEnd!: ElementRef;

  messages: Message[] = [];
  text = '';
  uploading = false;
  loading = false;
  isRecording = false;
  isStarting = false;
  private pendingStop = false;
  recordingTime = 0;
  private timer: any;
  private recorder: RecordRTC | null = null;
  private stream: MediaStream | null = null;
  private sub!: Subscription;
  private shouldScroll = false;

  constructor(
    private chatService: ChatService,
    private wsService: WebSocketService,
  ) {}

  ngOnInit(): void {
    this.sub = this.wsService.messageReceived$.subscribe((msg) => {
      if (this.chat && this.isForCurrentChat(msg)) {
        // Avoid duplicate: if we already have an optimistic message with same content or mediaFilePath from us, replace it
        if (msg.senderId === this.currentUserId) {
          const idx = this.messages.findIndex((m) => {
            const isOptimistic = m.id == null || (typeof m.id === 'number' && m.id < 0);
            if (!isOptimistic) return false;

            if (msg.type === 'TEXT') {
              return m.content === msg.content;
            } else {
              // Match media by checking if the actual mediaFilePath ends with the filename we uploaded
              // or just match by the temporary ID we gave it.
              return m.type === msg.type && (
                m.mediaFilePath === msg.mediaFilePath || 
                (m.mediaFilePath && msg.mediaFilePath && msg.mediaFilePath.includes(m.mediaFilePath.split('/').pop()!))
              );
            }
          });

          if (idx !== -1) {
            this.messages = this.messages.map((m, i) => (i === idx ? msg : m));
            this.shouldScroll = true;
            return;
          }
        }
        this.messages = [msg, ...this.messages];
        this.shouldScroll = true;
        if (msg.receiverId === this.currentUserId && msg.id) {
          this.chatService.markAsRead(msg.id).subscribe();
        }
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['chat'] && this.chat?.id) {
      this.loadMessages();
    }
  }

  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  private loadMessages(): void {
    if (!this.chat) return;
    this.loading = true;
    this.chatService.getChatMessages(this.chat.id).subscribe({
      next: (msgs) => { this.messages = msgs; this.loading = false; this.shouldScroll = true; },
      error: () => (this.loading = false),
    });
  }

  send(): void {
    const content = this.text.trim();
    if (!content || !this.chat) return;
    const recipientId = this.recipientId;
    this.wsService.sendMessage({
      chatId: this.chat.id,
      senderId: this.currentUserId,
      receiverId: recipientId,
      content,
      type: 'TEXT' as MessageType,
    });
    this.text = '';
    // Show sent message immediately (optimistic update)
    const optimisticMsg: Message = {
      id: -Date.now(),
      chatId: this.chat.id,
      senderId: this.currentUserId,
      receiverId: recipientId,
      content,
      type: 'TEXT',
      state: 'SENT',
      createdDate: new Date().toISOString(),
    };
    this.messages = [optimisticMsg, ...this.messages];
    this.shouldScroll = true;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    const file = input.files[0];
    this.uploadFile(file);
  }

  private uploadFile(file: File | Blob, customType?: MessageType): void {
    const fileToUpload = file instanceof File ? file : new File([file], 'voice-message.webm', { type: 'audio/webm' });
    this.uploading = true;
    this.chatService.uploadMedia(fileToUpload).subscribe({
      next: ({ mediaFilePath }) => {
        if (!this.chat) {
          this.uploading = false;
          return;
        }
        const type = customType || this.detectType(fileToUpload);
        this.wsService.sendMessage({
          chatId: this.chat.id,
          senderId: this.currentUserId,
          receiverId: this.recipientId,
          type,
          mediaFilePath,
        });

        // Optimistic update for media
        const optimisticMsg: Message = {
          id: -Date.now(),
          chatId: this.chat.id,
          senderId: this.currentUserId,
          receiverId: this.recipientId,
          type,
          mediaFilePath,
          state: 'SENT',
          createdDate: new Date().toISOString(),
        };
        this.messages = [optimisticMsg, ...this.messages];
        this.shouldScroll = true;
        this.uploading = false;
      },
      error: () => (this.uploading = false),
    });
  }

  async startRecording(): Promise<void> {
    if (this.isStarting || this.isRecording) return;
    this.isStarting = true;
    this.pendingStop = false;
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.recorder = new RecordRTC(this.stream, {
        type: 'audio',
        mimeType: 'audio/webm',
        recorderType: (RecordRTC as any).StereoAudioRecorder,
        numberOfAudioChannels: 1,
        desiredSampRate: 16000
      });

      if (this.recorder) {
        this.recorder.startRecording();
        this.isRecording = true;
        this.recordingTime = 0;
        this.timer = setInterval(() => this.recordingTime++, 1000);
      }
      
      // If user released the button before startRecording finished
      if (this.pendingStop) {
        this.stopRecording();
      }
    } catch (err) {
      console.error('Could not start recording', err);
    } finally {
      this.isStarting = false;
    }
  }

  stopRecording(): void {
    if (this.isStarting) {
      this.pendingStop = true;
      return;
    }
    if (this.recorder && this.isRecording) {
      this.isRecording = false;
      this.pendingStop = false;
      clearInterval(this.timer);
      const duration = this.recordingTime;

      this.recorder.stopRecording(() => {
        const audioBlob = this.recorder!.getBlob();
        console.log('Voice recorded, blob size:', audioBlob.size, 'duration:', duration);

        if (duration >= 1 && audioBlob.size > 0) {
          this.uploadFile(audioBlob, 'AUDIO');
        } else if (duration < 1) {
          console.warn('Recording discarded: too short');
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'warning',
            title: 'Hold to record (min 1s)',
            showConfirmButton: false,
            timer: 1500
          });
        }

        this.cleanupRecording();
      });
    }
  }

  private cleanupRecording(): void {
    if (this.recorder) {
      this.recorder.destroy();
      this.recorder = null;
    }
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
  }

  get formatTime(): string {
    const mins = Math.floor(this.recordingTime / 60);
    const secs = this.recordingTime % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  get recipientId(): string {
    if (!this.chat) return '';
    return this.chat.senderId === this.currentUserId
      ? this.chat.recipientId : this.chat.senderId;
  }

  get chatName(): string {
    if (!this.chat) return '';
    return this.chatService.getChatDisplayName(this.chat, this.currentUserId);
  }

  get initials(): string {
    return this.chatService.getInitials(this.chatName);
  }

  isMine(msg: Message): boolean { return msg.senderId === this.currentUserId; }

  private isForCurrentChat(msg: Message): boolean {
    return (
      (msg.senderId === this.currentUserId && msg.receiverId === this.recipientId) ||
      (msg.receiverId === this.currentUserId && msg.senderId === this.recipientId)
    );
  }

  private detectType(file: File): MessageType {
    if (file.type.startsWith('image')) return 'IMAGE';
    if (file.type.startsWith('video')) return 'VIDEO';
    if (file.type.startsWith('audio')) return 'AUDIO';
    return 'TEXT';
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      try {
        this.messagesEnd.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
      } catch (err) {}
    }, 100);
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    if (this.timer) clearInterval(this.timer);
    this.cleanupRecording();
  }
}
