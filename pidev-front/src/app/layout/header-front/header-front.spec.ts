import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { EMPTY, of } from 'rxjs';

import { HeaderFront } from './header-front';
import { WebSocketService } from '@features/messaging/websocket.service';
import { StockService } from '@core/services/stock-service';
import { AuthService } from '@core/services/auth-service';

describe('HeaderFront', () => {
  let component: HeaderFront;
  let fixture: ComponentFixture<HeaderFront>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeaderFront],
      imports: [RouterTestingModule],
      providers: [
        {
          provide: WebSocketService,
          useValue: {
            connect: jasmine.createSpy('connect'),
            alertReceived$: EMPTY,
          },
        },
        {
          provide: StockService,
          useValue: {
            getAlerts: () => of([]),
            markAlertRead: () => of(void 0),
          },
        },
        {
          provide: AuthService,
          useValue: { isAdmin: () => false, isLoggedIn: () => false },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderFront);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
