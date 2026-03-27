import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { EventService } from '@core/services/event-service';
import { Event } from '@shared/models/event';
import { EventRecommendation } from '@shared/models/event-recommendation';

@Component({
  selector: 'app-events-client',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './events-client.html',
  styleUrls: ['./events-client.scss']
})
export class EventsClient implements OnInit {

  constructor(
    private eventService: EventService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  events: Event[] = [];

  // ✅ Recommendations
  recommendations: EventRecommendation[] = [];
  emailParticipant: string = 'jassemhammouda@gmail.com';
  isRecLoading: boolean = false;

  // Pagination
  currentPage: number = 0;
  totalPages: number = 0;
  itemsPerPage: number = 3;
  isLoading: boolean = false;

  ngOnInit(): void {
    console.log('✅ ngOnInit EventsClient');
    this.loadRecommendations();
    this.loadEvents();
  }

  loadRecommendations(): void {
    console.log('✅ loadRecommendations called, email=', this.emailParticipant);
    this.isRecLoading = true;

    this.eventService.getRecommendations(this.emailParticipant).subscribe({
      next: (data) => {
        console.log('✅ Recommendations loaded:', data);
        this.recommendations = data ?? [];
        this.isRecLoading = false;
        this.cdr.detectChanges(); // ✅ force refresh UI
      },
      error: (err) => {
        // Recommendations are optional - don't show error alert
        console.warn('⚠️ Recommendations not available:', err);
        this.recommendations = [];
        this.isRecLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadEvents(): void {
    this.isLoading = true;

    this.eventService.getEvents(this.currentPage, this.itemsPerPage).subscribe({
      next: (data) => {
        console.log('✅ Events loaded:', data);
        this.events = data?.content ?? [];
        this.totalPages = data?.totalPages ?? 0;
        this.currentPage = data?.number ?? 0;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('❌ Events error:', err);
        this.isLoading = false;
        Swal.fire('Error', 'Failed to load events', 'error');
      }
    });
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadEvents();
    }
  }

  nextPage(): void {
    this.goToPage(this.currentPage + 1);
  }

  prevPage(): void {
    this.goToPage(this.currentPage - 1);
  }
}