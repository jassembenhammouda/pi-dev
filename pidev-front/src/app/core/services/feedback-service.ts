import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Feedback } from '@shared/models/feedback';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  constructor(private http: HttpClient) { }

  private feedbacktUrl = 'http://localhost:8080/feedback'; 

  addFeedback(feedback: Feedback, id: number): Observable<any> {
    return this.http.post(`${this.feedbacktUrl}/add/${id}`, feedback);

  }

  getFeedbacksByEvent(id: number): Observable<any> {
    return this.http.get(`${this.feedbacktUrl}/event/${id}`);
  }

  
  getAverageRating(id: number): Observable<any> {
    return this.http.get(`${this.feedbacktUrl}/event/${id}/average`);
  }
  
  
}
