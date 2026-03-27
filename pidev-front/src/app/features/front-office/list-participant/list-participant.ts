import { Component } from '@angular/core';
import { ReservationService } from '@core/services/reservation-service';
import { EventService } from '@core/services/event-service';
import { Reservation } from '@shared/models/reservation';
import { Event } from '@shared/models/event';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-list-participant',
  standalone: false,
  templateUrl: './list-participant.html',
  styleUrl: './list-participant.scss'
})
export class ListParticipant {

  event: Event | null = null;

  constructor(private res : ReservationService, private route: ActivatedRoute, private eventService: EventService) { }

  Confirmedparticipants: Reservation[] = [];
  pendingParticipants: Reservation[] = [];
  id : number = 0;
  isLoading: boolean = false;
  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.id = +id; 
        this.loadEvent(this.id);
        this.loadConfirmedParticipants(this.id);
        this.loadPendingParticipants(this.id);
      }
    });

   
  }

  private loadEvent(id: number): void {
    this.eventService.getEvent(id).subscribe({
      next: (event) => {
        this.event = event;
      },
      error: (err) => {
        console.error('Impossible de charger l\'événement:', err);
      }
    });
  }

  get confirmedPlaces(): number {
    return this.Confirmedparticipants.reduce((total, r) => total + (r.nbPlace || 0), 0);
  }

  get pendingPlaces(): number {
    return this.pendingParticipants.reduce((total, r) => total + (r.nbPlace || 0), 0);
  }

  get remainingPlaces(): number {
    if (!this.event) {
      return 0;
    }
    return Math.max(this.event.capacityMax - this.confirmedPlaces, 0);
  }

  get totalPlaces(): number {
    return this.event ? this.event.capacityMax : 0;
  }

  get totalBookedPlaces(): number {
    return this.confirmedPlaces + this.pendingPlaces;
  }

  loadConfirmedParticipants(id: number) {
    this.res.listConfirmed(this.id).subscribe({
      next: (data) => {
        this.Confirmedparticipants = data;
        console.log("Confirmed participants loaded:", this.Confirmedparticipants);
      },
      error: (err) => {
        console.error("Failed to load confirmed participants:", err);
      }
    });
  }

  loadPendingParticipants(id: number) {
    this.res.listPending(this.id).subscribe({
      next: (data) => {
        this.pendingParticipants = data;
        console.log("Pending participants loaded:", this.pendingParticipants);
      },
      error: (err) => {
        console.error("Failed to load pending participants:", err);
      }
    });
  }
  
}
