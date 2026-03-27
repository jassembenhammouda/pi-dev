import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { Success } from './success';

describe('Success', () => {
  let component: Success;
  let fixture: ComponentFixture<Success>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Success],
      imports: [RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(Success);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
