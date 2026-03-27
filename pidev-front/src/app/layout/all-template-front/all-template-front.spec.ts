import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

import { AllTemplateFront } from './all-template-front';

describe('AllTemplateFront', () => {
  let component: AllTemplateFront;
  let fixture: ComponentFixture<AllTemplateFront>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AllTemplateFront],
      imports: [RouterTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AllTemplateFront);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
