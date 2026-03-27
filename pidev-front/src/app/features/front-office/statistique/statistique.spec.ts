import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { Statistique } from './statistique';

describe('Statistique', () => {
  let component: Statistique;
  let fixture: ComponentFixture<Statistique>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Statistique],
      imports: [RouterTestingModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ActivatedRoute, useValue: { paramMap: of(convertToParamMap({})) } },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(Statistique);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
