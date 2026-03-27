import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { FooterFront } from './footer-front';
import { AuthService } from '@core/services/auth-service';

describe('FooterFront', () => {
  let component: FooterFront;
  let fixture: ComponentFixture<FooterFront>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FooterFront],
      imports: [RouterTestingModule],
      providers: [
        { provide: AuthService, useValue: { isAdmin: () => false } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FooterFront);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
