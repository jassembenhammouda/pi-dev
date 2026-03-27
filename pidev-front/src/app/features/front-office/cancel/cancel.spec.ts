import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { Cancel } from './cancel';

describe('Cancel', () => {
  let component: Cancel;
  let fixture: ComponentFixture<Cancel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Cancel],
      imports: [RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(Cancel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
