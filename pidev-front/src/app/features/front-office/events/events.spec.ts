import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';

import { Events } from './events';

describe('Events', () => {
  let component: Events;
  let fixture: ComponentFixture<Events>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Events],
      imports: [RouterTestingModule, FormsModule],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    })
    .compileComponents();

    fixture = TestBed.createComponent(Events);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
