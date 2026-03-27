import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DiscountService {
  
  constructor(private http: HttpClient) { }

  private discountUrl = 'http://localhost:8080/discount'; 

  

  checkCode(code: any)  : Observable<boolean> {
    return this.http.post<boolean>(`${this.discountUrl}/checkCode`, code);
}


  createDiscount(data: any): Observable<any> {
      return this.http.post<any>(`${this.discountUrl}/create`, data);
}
  sendFreeAccessMail(data: any): Observable<any> {
      return this.http.post<any>(`${this.discountUrl}/SendFreeAccessMail`, data);
}

}
