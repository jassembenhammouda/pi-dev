import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY, of } from 'rxjs';

import { Chat11Component } from './chat11';
import { ChatService } from '../chat.service';
import { WebSocketService } from '../websocket.service';
import { AuthService } from '@core/services/auth-service';

describe('Chat11Component', () => {
  let component: Chat11Component;
  let fixture: ComponentFixture<Chat11Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Chat11Component],
      providers: [
        {
          provide: WebSocketService,
          useValue: {
            connect: jasmine.createSpy('connect'),
            disconnect: jasmine.createSpy('disconnect'),
            messageReceived$: EMPTY,
          },
        },
        {
          provide: ChatService,
          useValue: {
            getUserChats: () => of([]),
            createChat: () => of({ id: '1', senderId: 'a', recipientId: 'b' }),
          },
        },
        {
          provide: ActivatedRoute,
          useValue: { queryParams: of({}) },
        },
        {
          provide: AuthService,
          useValue: { getCurrentUserId: () => 'test-user' },
        },
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Chat11Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
