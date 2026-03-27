import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface FoodItem {
  id?: number;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  expirationDate: string;
  receivedDate?: string;
  donorName: string;
  estimatedValue: number;
}

export interface StockAlert {
  id: number;
  foodItem: FoodItem;
  type: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface Distribution {
  id?: number;
  foodItemId: number;
  quantity: number;
  association: string;
}

export interface AssociationNeed {
  id?: number;
  associationName: string;
  category: string;
  quantityRequested: number;
  quantitySatisfied: number;
  priority: string;
  createdAt?: string;
  satisfied: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class StockService {
  private baseUrl = 'http://localhost:8080/api/stock';

  constructor(private http: HttpClient) {}

  getAllStock(): Observable<FoodItem[]> {
    return this.http.get<FoodItem[]>(`${this.baseUrl}/all`);
  }

  addFoodItem(item: FoodItem): Observable<FoodItem> {
    return this.http.post<FoodItem>(`${this.baseUrl}/add`, item);
  }

  distributeFood(distribution: Distribution): Observable<any> {
    return this.http.post(`${this.baseUrl}/distribute`, null, {
      params: {
        itemId: distribution.foodItemId.toString(),
        quantity: distribution.quantity.toString(),
        association: distribution.association
      }
    });
  }

  getAlerts(): Observable<StockAlert[]> {
    return this.http.get<StockAlert[]>(`${this.baseUrl}/alerts`);
  }

  markAlertRead(id: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/alerts/${id}/read`, null);
  }

  getStatistics(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/statistics`);
  }

  triggerAlertCheck(): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/check-alerts`, null);
  }

  getNeeds(): Observable<AssociationNeed[]> {
    return this.http.get<AssociationNeed[]>(`${this.baseUrl}/needs`);
  }

  createNeed(need: AssociationNeed): Observable<AssociationNeed> {
    return this.http.post<AssociationNeed>(`${this.baseUrl}/needs`, need);
  }
}
