import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { Message, MessageDto } from './chat.models';
import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { StockAlert } from '@core/services/stock-service';

@Injectable({ providedIn: 'root' })
export class WebSocketService implements OnDestroy {
  private client!: Client;
  private subscriptions = new Map<string, StompSubscription>();

  private _messageReceived$ = new Subject<Message>();
  messageReceived$ = this._messageReceived$.asObservable();

  private _alertReceived$ = new Subject<StockAlert>();
  alertReceived$ = this._alertReceived$.asObservable();

  connect(userId: string): void {
    if (!userId?.trim()) {
      return;
    }
    this.disconnect();
    this.client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws-chat'),
      reconnectDelay: 5000,
      onConnect: () => {
        console.log('WebSocket connected');
        this.subscribeToUser(userId);
        this.subscribeToAlerts();
      },
      onStompError: (frame) => console.error('STOMP error', frame),
      onWebSocketError: (error) => console.error('WebSocket error', error),
      onDisconnect: () => console.log('WebSocket disconnected')
    });
    this.client.activate();
  }

  private subscribeToUser(userId: string): void {
    const topic = `/topic/messages/${userId}`;
    if (this.subscriptions.has(topic)) return;

    const sub = this.client.subscribe(topic, (msg: IMessage) => {
      const message: Message = JSON.parse(msg.body);
      this._messageReceived$.next(message);
    });
    this.subscriptions.set(topic, sub);
  }

  private subscribeToAlerts(): void {
    const topic = '/topic/alerts';
    if (this.subscriptions.has(topic)) return;

    const sub = this.client.subscribe(topic, (msg: IMessage) => {
      const alert: StockAlert = JSON.parse(msg.body);
      this._alertReceived$.next(alert);
    });
    this.subscriptions.set(topic, sub);
  }

  sendMessage(dto: MessageDto): void {
    if (!this.client?.connected) {
      console.error('WebSocket not connected');
      return;
    }
    this.client.publish({
      destination: '/app/chat',
      body: JSON.stringify(dto),
    });
  }

  disconnect(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.subscriptions.clear();
    this.client?.deactivate();
  }

  ngOnDestroy(): void {
    this.disconnect();
  }
}
