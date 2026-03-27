import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';

import { EventForm } from './event-form';

describe('EventForm', () => {
  let component: EventForm;
  let fixture: ComponentFixture<EventForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EventForm],
      imports: [RouterTestingModule, ReactiveFormsModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({})),
            queryParams: of({}),
          },
        },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
