import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EMPTY } from 'rxjs';

import { ChatWindowComponent } from './chat-window';
import { ChatService } from '../chat.service';
import { WebSocketService } from '../websocket.service';

describe('ChatWindowComponent', () => {
  let component: ChatWindowComponent;
  let fixture: ComponentFixture<ChatWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatWindowComponent],
      providers: [
        {
          provide: ChatService,
          useValue: {
            getChatMessages: () => EMPTY,
            markAsRead: () => EMPTY,
            uploadMedia: () => EMPTY,
          },
        },
        {
          provide: WebSocketService,
          useValue: {
            messageReceived$: EMPTY,
            sendMessage: jasmine.createSpy('sendMessage'),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatWindowComponent);
    component = fixture.componentInstance;
    component.currentUserId = 'test-user';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
