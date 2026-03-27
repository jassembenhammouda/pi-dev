import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { DiscountService } from './discount-service';

describe('DiscountService', () => {
  let service: DiscountService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(DiscountService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
