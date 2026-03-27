import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ListParticipant } from './list-participant';

describe('ListParticipant', () => {
  let component: ListParticipant;
  let fixture: ComponentFixture<ListParticipant>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListParticipant],
      imports: [RouterTestingModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ActivatedRoute, useValue: { paramMap: of(convertToParamMap({})) } },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListParticipant);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
