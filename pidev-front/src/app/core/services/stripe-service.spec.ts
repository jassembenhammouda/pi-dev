import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { StripeService } from './stripe-service';

describe('StripeService', () => {
  let service: StripeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(StripeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
