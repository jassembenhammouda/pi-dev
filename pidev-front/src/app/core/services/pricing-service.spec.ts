import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { PricingService } from './pricing-service';

describe('PricingService', () => {
  let service: PricingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(PricingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
