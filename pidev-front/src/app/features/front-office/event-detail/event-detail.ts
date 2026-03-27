import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventService } from '@core/services/event-service';
import { FeedbackService } from '@core/services/feedback-service';
import { Event } from '@shared/models/event';
import { Feedback } from '@shared/models/feedback';

@Component({
  selector: 'app-event-detail',
  standalone: false,
  templateUrl: './event-detail.html',
  styleUrls: ['./event-detail.scss']
})
export class EventDetail implements OnInit {

  constructor(
    private event: EventService,
    private route: ActivatedRoute,
    private feedbackService: FeedbackService
  ) {}

  stars: number[] = [1,2,3,4,5];
  newFeedback: Feedback = { rating: 0 };
  feedbacks: Feedback[] = [];
  id: number = 0;

  eventData?: Event;
  averageRating: number = 0;

  // ✅ QR (OBLIGATOIRE)
  qrBase64: string = '';
  isQrLoading: boolean = false;

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.id = +id;
        this.loadEventData(this.id);
        this.loadFeedbacks(this.id);
      }
    });
  }

  loadEventData(id: number) {
    this.isQrLoading = true;

    this.event.getEvent(id).subscribe({
      next: (data: any) => {
        console.log("Event data loaded:", data);
        console.log("QR raw value:", data?.qrCodeBase64);
        
        this.eventData = data;

        // ✅ Nettoyage complet du QR (espaces, newlines, retours à la ligne)
        if (data?.qrCodeBase64 && typeof data.qrCodeBase64 === 'string') {
          this.qrBase64 = data.qrCodeBase64
            .trim()
            .replace(/\s/g, '')
            .replace(/\n/g, '')
            .replace(/\r/g, '')
            .replace(/\t/g, '');
        } else {
          this.qrBase64 = '';
        }
        this.isQrLoading = false;

        console.log("QR cleaned length:", this.qrBase64.length);
        console.log("QR cleaned preview:", this.qrBase64.substring(0, 100));
        console.log("QR ready to display:", !!this.qrBase64);
      },
      error: (err) => {
        console.error("Failed to load event data:", err);
        this.isQrLoading = false;
      }
    });
  }

  setRating(value: number) {
    this.newFeedback.rating = value;
    this.feedbackService.addFeedback(this.newFeedback, this.id).subscribe(() => {
      this.loadFeedbacks(this.id);
      this.newFeedback = { rating: 0 };
    });
  }

  loadFeedbacks(id: number) {
    this.feedbackService.getFeedbacksByEvent(id).subscribe(res => this.feedbacks = res);
    this.feedbackService.getAverageRating(id).subscribe(res => this.averageRating = res);
  }

  onQrImageError() {
    console.error("Failed to load QR image");
    console.log("QR value causing error:", this.qrBase64.substring(0, 100));
  }
}