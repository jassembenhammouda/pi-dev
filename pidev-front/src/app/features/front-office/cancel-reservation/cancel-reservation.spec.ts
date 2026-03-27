import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { CancelReservation } from './cancel-reservation';

describe('CancelReservation', () => {
  let component: CancelReservation;
  let fixture: ComponentFixture<CancelReservation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CancelReservation],
      imports: [RouterTestingModule, ReactiveFormsModule],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    })
    .compileComponents();

    fixture = TestBed.createComponent(CancelReservation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
