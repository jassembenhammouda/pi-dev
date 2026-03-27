import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReservationService } from '@core/services/reservation-service';
import { ActivatedRoute, Router } from '@angular/router';
import { StripeService } from '@core/services/stripe-service';
import Swal from 'sweetalert2';
import { StripeRequest } from '@shared/models/stripe-request';
import { DiscountService } from '@core/services/discount-service';
import { of } from 'rxjs';
import { EventService } from '@core/services/event-service';

@Component({
  selector: 'app-reservation',
  standalone: false,
  templateUrl: './reservation.html',
  styleUrl: './reservation.scss'
})
export class Reservation {

  constructor(
    private res: ReservationService,
    private route: ActivatedRoute,
    private stripe: StripeService,
    private dis: DiscountService,
    private router: Router,
    private eventService: EventService
  ) {}
  id: number = 0;
  aForm: FormGroup = new FormGroup({});
  loading = false;

  // Prix
  unitPrice: number | null = null; // prix d'un seul ticket
  originalPrice: number | null = null;
  discountedPrice: number | null = null;

  // Montant et pourcentage de réduction
  get discountAmount(): number | null {
    if (
      this.originalPrice != null &&
      this.discountedPrice != null &&
      this.discountedPrice < this.originalPrice
    ) {
      return this.originalPrice - this.discountedPrice;
    }
    return null;
  }

  get discountPercent(): number | null {
    if (
      this.originalPrice != null &&
      this.discountedPrice != null &&
      this.discountedPrice < this.originalPrice &&
      this.originalPrice > 0
    ) {
      return Math.round((1 - this.discountedPrice / this.originalPrice) * 100);
    }
    return null;
  }
  ngOnInit() {

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.id = +id;

        // Charger l'événement pour récupérer le prix unitaire
        this.eventService.getEvent(this.id).subscribe({
          next: (event) => {
            this.unitPrice = event.price;
            this.updateOriginalTotal();
          }
        });
      }
    });


    this.aForm = new FormGroup({
      firstNameParticipant: new FormControl('', [Validators.required, Validators.minLength(2)]),
      lastNameParticipant: new FormControl('', [Validators.required, Validators.minLength(2)]),
      emailParticipant: new FormControl('', [Validators.required, Validators.email]),
      nbPlace: new FormControl(1, [Validators.required, Validators.min(1)]),
      discountCode: new FormControl(''),
    });

    // Recalcule le total quand le nombre de places change
    this.aForm.get('nbPlace')?.valueChanges.subscribe(() => this.updateOriginalTotal());
  }

  private updateOriginalTotal(): void {
    if (!this.aForm || this.unitPrice == null) {
      return;
    }
    const nbPlace = this.aForm.get('nbPlace')?.value || 1;
    this.originalPrice = this.unitPrice * nbPlace;
  }

  // Prévisualiser la réduction dès que l'utilisateur clique sur "Apply"
  applyDiscountPreview(): void {
    const code = this.aForm.get('discountCode')?.value;

    // Pas de code => on remet le total normal
    if (!code) {
      this.discountedPrice = null;
      return;
    }

    if (!this.originalPrice) {
      return;
    }

    this.dis.checkCode(code).subscribe({
      next: (exists: boolean) => {
        if (!exists) {
          this.discountedPrice = null;
          Swal.fire({
            title: 'Not Found',
            text: 'Invalid Discount Code.',
            icon: 'error'
          });
          return;
        }

        // Même logique que le backend : -20%
        this.discountedPrice = this.originalPrice! * 0.8;
      },
      error: () => {
        Swal.fire('Erreur', 'Impossible de vérifier le code promo.', 'error');
      }
    });
  }

  onSubmit() {
    if (this.aForm.valid) {
      const reservationData = this.aForm.value;
      const code = this.aForm.get('discountCode')?.value;
  
      // Active le spinner
      this.loading = true;
  
      const checkCode$ = code ? this.dis.checkCode(code) : of(true);
  
      checkCode$.subscribe({
        next: (exists: boolean) => {
          if (!exists) {
            this.loading = false; // stop spinner
            Swal.fire({
              title: "Not Found",
              text: "Invalid Discount Code.",
              icon: "error"
            });
            return;
          }
  
          this.res.addReservation(reservationData, this.id, code).subscribe({
            next: (reservation) => {

              // Met à jour les prix après application éventuelle du code promo
              const nbPlace = reservationData.nbPlace || 1;
              this.unitPrice = reservation.event?.price ?? this.unitPrice;
              if (this.unitPrice != null) {
                this.originalPrice = this.unitPrice * nbPlace;
              }
              this.discountedPrice = reservation.amount ?? null;

              // ✅ Sans paiement en ligne : simple confirmation
              this.loading = false;

              if (reservation.status === 'CONFIRMED') {
                Swal.fire({
                  icon: 'success',
                  title: 'Reservation confirmed',
                  text: 'Your reservation has been created successfully.',
                  confirmButtonText: 'OK'
                }).then(() => {
                  this.router.navigate(['/clientEvents']);
                });

              } else if (reservation.status === 'PENDING') {
                Swal.fire({
                  icon: 'info',
                  title: 'Waiting list',
                  text: 'Your reservation is on hold. You will be notified by email if a place becomes available.',
                  confirmButtonText: 'Ok'
                }).then(() => {
                  this.router.navigate(['/clientEvents']);
                });
              }
            },
            error: (err) => {
              this.loading = false; // stop spinner
              Swal.fire('Erreur', err.error?.error || 'Une erreur est survenue', 'error');
            }
          });
  
        },
        error: () => {
          this.loading = false; // stop spinner
          Swal.fire('Erreur', 'Impossible de vérifier le code promo.', 'error');
        }
      });
    }
  }
}
