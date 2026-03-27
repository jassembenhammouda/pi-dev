import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { ChatListComponent } from './chat-list';
import { ChatService } from '../chat.service';

describe('ChatListComponent', () => {
  let component: ChatListComponent;
  let fixture: ComponentFixture<ChatListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatListComponent],
      providers: [
        {
          provide: ChatService,
          useValue: {
            getUserChats: () => of([]),
            getChatDisplayName: () => '',
            getInitials: () => '',
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatListComponent);
    component = fixture.componentInstance;
    component.currentUserId = 'test-user';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
