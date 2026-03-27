import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Event } from '@shared/models/event';
import { Observable } from 'rxjs';
import { EventPrediction } from '@shared/models/event-prediction';
import { EventRecommendation } from '@shared/models/event-recommendation';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private http: HttpClient) { }

  private eventUrl = 'http://localhost:8080/events'; 
  private apiUrl = 'http://127.0.0.1:8000/predict';

  addEvent(event: Event) : Observable<any> {
    return this.http.post<Event>(`${this.eventUrl}/addEvent`, event);
  }
  
  getEvent(id: number) {
    return this.http.get<Event>(`${this.eventUrl}/retrieve-event/${id}`);
  }
  getEventQr(id: number): Observable<string> {
  return this.http.get(
    `${this.eventUrl}/${id}/qr`,
    { responseType: 'text' }
  );
  }
  
  getEvents(page: number = 0, size: number = 3): Observable<any> {
    return this.http.get<any>(`${this.eventUrl}/AllEvents?page=${page}&size=${size}`);
  }
  
  
  deleteEvent(id: number) {
    return this.http.delete(`${this.eventUrl}/remove-event/${id}`);
  }

  updateEvent(event: Event, id: number) {
    return this.http.put<Event>(`${this.eventUrl}/update-event/${id}`, event);

  }

  countAllEvent(): Observable<any> {
    return this.http.get<any>(`${this.eventUrl}/countAllEvents`);
  }

  exportCsv() {
    return this.http.get(`${this.eventUrl}/export`, { responseType: 'blob' });
  } 

  predictEvent(eventData: any): Observable<EventPrediction> {
    return this.http.post<EventPrediction>(this.apiUrl, eventData);
  }
  getRecommendations(email: string): Observable<EventRecommendation[]> {
  // ✅ adapte l’URL selon ton backend
  return this.http.get<EventRecommendation[]>(
    `${this.eventUrl}/recommendations?email=${encodeURIComponent(email)}`
  );
}

  /*topEvent(): Observable<any []> {
    return this.http.get<any[]>(`${this.eventUrl}/topEvent`);
  }*/
  
}
  

