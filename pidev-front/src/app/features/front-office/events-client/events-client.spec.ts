import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { EventsClient } from './events-client';

describe('EventsClient', () => {
  let component: EventsClient;
  let fixture: ComponentFixture<EventsClient>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventsClient, RouterTestingModule],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(EventsClient);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
