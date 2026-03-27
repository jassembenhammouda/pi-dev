import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ReservationService } from '@core/services/reservation-service';
import { EventService } from '@core/services/event-service';
import { ActivatedRoute } from '@angular/router';
import { Feedback } from '@shared/models/feedback';
import { FeedbackService } from '@core/services/feedback-service';
import { Chart, registerables } from 'chart.js';
import { DiscountService } from '@core/services/discount-service';
import Swal from 'sweetalert2';

Chart.register(...registerables);


@Component({
  selector: 'app-statistique',
  standalone: false,
  templateUrl: './statistique.html',
  styleUrl: './statistique.scss'
})
export class Statistique implements OnInit, AfterViewInit {
  @ViewChild('reservationChart', { static: false }) chartRef!: ElementRef;





  constructor(private res : ReservationService, private event : EventService, 
    private route : ActivatedRoute , private feedbackService: FeedbackService,
    private dis : DiscountService
  
  ) { }

  confirmedCount: number = 0;
  pendingCount: number = 0;
  eventCount: number = 0;
  topParticipant: any [] = [];
  countReservation: [string, number][] = [];
  totalReservations: number = 0;
  feedbacks : Feedback[] = [];
  averageRating: number = 0;
  incomeEvent: number = 0;
  totalIncome: number = 0;
  id : number = 0;
  reservationChart: any;


  ngAfterViewInit() {
    // Le graphique sera initialisé une fois que les données seront chargées
  }


  ngOnInit() {

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.id = +id; 
    this.loadConfirmedCount(this.id);
    this.loadPendingCount(this.id);
    this.loadTopParticipants();
    this.loadReservationCounts();
    this.loadEventCount();
    this.loadFeedbacks(this.id);
    this.getIncomeByEvent(this.id);
    this.getTotalIncome();
    
      }
   }); 

   
   
  

  
  
  }

  initializeChart() {
    const ctx = this.chartRef.nativeElement.getContext('2d');
    this.reservationChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Confirmed', 'Waiting'],
        datasets: [{
          data: [this.confirmedCount, this.pendingCount],
          backgroundColor: [
            '#2ecc71',
            '#f39c12'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  }


  loadConfirmedCount(id: number) {
    this.res.confirmReservation(id).subscribe({
      next: (data) => {
        this.confirmedCount = data;
        if (this.pendingCount !== undefined) {
          this.initializeChart();
        }
        
        console.log("Confirmed count loaded:", this.confirmedCount);
      },
      error: (err) => {
        console.error("Failed to load confirmed count:", err);
      }
    });
  }

  loadPendingCount(id: number) {
    this.res.pendingReservation(id).subscribe({
      next: (data) => {
        this.pendingCount = data;
        if (this.confirmedCount !== undefined) {
          this.initializeChart();
        }
        console.log("Pending count loaded:", this.pendingCount);
      },
      error: (err) => {
        console.error("Failed to load pending count:", err);
      }
    });
  }
  loadTopParticipants() {
    this.res.topParticipant().subscribe({
      next: (data : any[]) => {
        this.topParticipant = data;
        this.topParticipant = data.map(row => ({
          emailParticipant: row[0],
          firstNameParticipant: row[1],
          lastNameParticipant: row[2],
          total: row[3]
        }));
        
        console.log("Top participants loaded:", this.topParticipant);
      },
      error: (err) => {
        console.error("Failed to load top participants:", err);
      }
    });
  }

  loadReservationCounts() {
    this.res.countAllReservation().subscribe({
      next: (data : any) => {
        this.countReservation = data;

        console.log("Reservation counts loaded:", this.countReservation);
      },
      error: (err) => {
        console.error("Failed to load reservation counts:", err);
      }
    });
  }

  loadEventCount() {
    this.event.countAllEvent().subscribe({
      next: (data) => {
        this.eventCount = data;
        console.log("Event count loaded:", this.eventCount);
      },
      error: (err) => {
        console.error("Failed to load event count:", err);
      }
    });
  }

  loadFeedbacks(id: number) {
    this.feedbackService.getFeedbacksByEvent(id).subscribe(res => this.feedbacks = res);
    this.feedbackService.getAverageRating(id).subscribe(res => this.averageRating = res);
  }

  getIncomeByEvent(id: number) {  
    this.res.incomeByEvent(id).subscribe({
      next: (data) => {
        this.incomeEvent = data;
        console.log("Income for event loaded:", this.incomeEvent);
      },
      error: (err) => {
        console.error("Failed to load income for event:", err);
      }
    });
  }

  getTotalIncome() {
    this.res.totalIncome().subscribe({
      next: (data) => {
        this.totalIncome = data;
        console.log("Total income loaded:", this.totalIncome);
      },
      error: (err) => {
        console.error("Failed to load total income:", err);
      }
    });
  }

  
sendDiscount(participant: any) {
  const data = {
    emailParticipant: participant.emailParticipant,
    firstNameParticipant: participant.firstNameParticipant,
    lastNameParticipant: participant.lastNameParticipant
  };

  this.dis.createDiscount(data).subscribe({
    next: (response) => {
      console.log("Discount code sent successfully:", response);
      Swal.fire('Success', 'Discount code sent!', 'success');
    },
    error: (err) => {
      console.error("Failed to send discount:", err);
      Swal.fire('Error', 'Failed to send discount code.', 'error');
    }
  });
}

sendFreeAccess(participant: any) {
  const data = {
    emailParticipant: participant.emailParticipant,
    firstNameParticipant: participant.firstNameParticipant,
    lastNameParticipant: participant.lastNameParticipant
  };

  this.dis.sendFreeAccessMail(data).subscribe({
    next: (response) => {
      console.log("Free access sent successfully:", response);
      Swal.fire('Success', 'Free access sent!', 'success');
    },
    error: (err) => {
      console.error("Failed to send free access:", err);
      Swal.fire('Error', 'Failed to send free access.', 'error');
    }
  });

} 

downloadCsv() {
  this.event.exportCsv().subscribe((blob: Blob) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'events_dataset.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  });
}
}
