import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';

import { Reservation } from './reservation';

describe('Reservation', () => {
  let component: Reservation;
  let fixture: ComponentFixture<Reservation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Reservation],
      imports: [RouterTestingModule, ReactiveFormsModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ActivatedRoute, useValue: { paramMap: of(convertToParamMap({})) } },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(Reservation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
