import { Component } from '@angular/core';
import { ReservationService } from '@core/services/reservation-service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cancel-reservation',
  standalone: false,
  templateUrl: './cancel-reservation.html',
  styleUrl: './cancel-reservation.scss'
})
export class CancelReservation {

  constructor(private res : ReservationService, private router: Router) { }

  aForm: FormGroup = new FormGroup({});

  ngOnInit() {

    this.aForm = new FormGroup(
      {
        
        emailParticipant: new FormControl('', [Validators.required, Validators.email]),
        cancelCode : new FormControl('', Validators.required),
      }); 
  }

  onSubmit() {
    if (this.aForm.valid) {
      const cancelData = this.aForm.value;
  
      // Vérifier d’abord si la réservation existe
      this.res.checkReservation(cancelData).subscribe({
        next: (exists: boolean) => {
          if (!exists) {
            Swal.fire({
              title: "Not Found",
              text: "No reservation found with this email and cancel code.",
              icon: "error"
            });
          } else {
            // Confirmation avant annulation
            Swal.fire({
              title: "Are you sure?",
              text: "Do you really want to cancel your reservation?",
              icon: "warning",
              showCancelButton: true,
              confirmButtonColor: "#3085d6",
              cancelButtonColor: "#d33",
              confirmButtonText: "Yes, cancel it!"
            }).then((result) => {
              if (result.isConfirmed) {
                this.res.cancelReservation(cancelData).subscribe({
                  next: (response) => {
                    console.log("Reservation cancelled successfully:", response);
                    Swal.fire({
                      title: "Cancelled!",
                      text: "Your reservation has been cancelled.",
                      icon: "success"
                    });
                    this.router.navigate(['/clientEvents']);
                  },
                  error: (error) => {
                    console.error("Error cancelling reservation:", error);
                    Swal.fire({
                      title: "Error!",
                      text: "Failed to cancel your reservation.",
                      icon: "error"
                    });
                  }
                });
              }
            });
          }
        },
        error: (err) => {
          console.error("Error checking reservation:", err);
          Swal.fire({
            title: "Error!",
            text: "Something went wrong while checking reservation.",
            icon: "error"
          });
        }
      });
  
    } else {
      Swal.fire({
        title: "Invalid Form",
        text: "Please fill out all required fields correctly.",
        icon: "warning"
      });
    }
  }
  




}