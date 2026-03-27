import { Component } from '@angular/core';
import { EventService } from '@core/services/event-service';
import { Event } from '@shared/models/event';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-events',
  standalone: false,
  templateUrl: './events.html',
  styleUrl: './events.scss'
})
export class Events {

  constructor(private event : EventService, private router: Router,) { }

  events: Event[] = [];
  currentPage: number = 0;
  totalPages: number = 0;
  itemsPerPage: number = 3;
  isLoading: boolean = false;
  searchTerm: string = '';

  ngOnInit() {
    this.loadEvents();
    // Initialisation ou logique spécifique pour le composant Events
  }

  loadEvents() {
    this.isLoading = true;
    this.event.getEvents(this.currentPage, this.itemsPerPage).subscribe({
      next: (data) => {
        this.events = data.content;
        this.totalPages = data.totalPages;
        this.currentPage = data.number;
        this.isLoading = false;
        console.log("Events loaded:", this.events);
      },
      error: (err) => {
        this.isLoading = false;
        Swal.fire("Error", "Failed to load events", "error");
        console.error(err);
      }
    });
  }

  goToPage(page: number) {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadEvents();
    }
  }

  nextPage() {
    this.goToPage(this.currentPage + 1);
  }

  prevPage() {
    this.goToPage(this.currentPage - 1);
  }

  filteredEvents() : Event[] {
    if (!this.searchTerm) {
      return this.events;
    }
    return this.events.filter(e =>
      e.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      e.description.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      e.place.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

 

editEvent(id: number) {
    this.router.navigate(['/event-form'], { queryParams: { id } });
  } 
  
   deleteEvent(id: number) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.event.deleteEvent(id).subscribe({
          next: () => {
            this.loadEvents();
            Swal.fire({
              title: "Deleted!",
              text: "Your file has been deleted.",
              icon: "success"
            });
          },
          error: (err) => {
            console.error('Error deleting Event:', err);
            Swal.fire({
              title: "Error!",
              text: "Failed to delete the Event.",
              icon: "error"
            });
          }
        });
      }
    });
  }
  
  
  
}
