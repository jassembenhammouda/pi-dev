import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StripeRequest } from '@shared/models/stripe-request';
import { Observable } from 'rxjs';
import { StripeResponse } from '@shared/models/stripe-response';

@Injectable({
  providedIn: 'root'
})
export class StripeService {
  
  

  constructor(private http: HttpClient) {}

  private stripeUrl = 'http://localhost:8080/paiement'; 

  checkout(request: StripeRequest): Observable<StripeResponse> {
    return this.http.post<StripeResponse>(`${this.stripeUrl}/checkout`, request);
  }

}
