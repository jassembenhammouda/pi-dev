import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { EventDetail } from './event-detail';

describe('EventDetail', () => {
  let component: EventDetail;
  let fixture: ComponentFixture<EventDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EventDetail],
      imports: [RouterTestingModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ActivatedRoute, useValue: { paramMap: of(convertToParamMap({})) } },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
