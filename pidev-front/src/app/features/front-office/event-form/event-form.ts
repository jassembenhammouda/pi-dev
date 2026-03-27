import { Component } from '@angular/core';
import { EventService } from '@core/services/event-service';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Event } from '@shared/models/event';
import { EventPrediction } from '@shared/models/event-prediction';

@Component({
  selector: 'app-event-form',
  standalone: false,
  templateUrl: './event-form.html',
  styleUrl: './event-form.scss'
})
export class EventForm {

  constructor(private event: EventService,private route: ActivatedRoute,
    private router: Router
  ) { }

  prediction: EventPrediction = { success_prediction: 0, probability_success: 0 };

  aForm: FormGroup = new FormGroup({});
  eventData: Event = new Event();
  ngOnInit() {
    this.aForm = new FormGroup(
      {
        title: new FormControl('', [Validators.required, Validators.minLength(3),Validators.pattern('^[a-zA-Z ]*$')]),
        description: new FormControl('', [Validators.required, Validators.minLength(10)]),
        startDate: new FormControl('', [Validators.required]),
        endDate: new FormControl('', [Validators.required]),
        place: new FormControl('', [Validators.required, Validators.minLength(3),Validators.pattern('^[a-zA-Z-, ]*$')]),
        capacityMax: new FormControl('', [Validators.required, Validators.min(1)]),
        price : new FormControl('', [Validators.required, Validators.min(0)]),
      },
      { validators: this.dateValidator } // Ajout du validateur global
    );

    this.route.queryParams.subscribe(params => {
      if (params['id']) {
        this.loadEventData(params['id']);
      }
    });
  }

  // Validateur personnalisé pour vérifier les dates
  dateValidator(group: AbstractControl): { [key: string]: boolean } | null {
    const start = group.get('startDate')?.value;
    const end = group.get('endDate')?.value;

    if (start && end && new Date(start) > new Date(end)) {
      return { dateInvalid: true };
    }
    return null;
  }
  
  loadEventData(id: number) {
    this.event.getEvent(id).subscribe(data => {
      this.eventData = data;
      this.aForm!.patchValue(data);
      
      console.log(this.aForm!.value);
      console.log(this.aForm!.valid);
      
    });
  } 

 
  
  addEvent() {
    if (this.aForm!.valid) {
      const Data = this.aForm!.value;
  
      // Vérifier si on est en mode update ou ajout
      if (this.eventData.id) {
        // Mode Update
        this.event.updateEvent(Data,this.eventData.id).subscribe({
          next: () => {
            Swal.fire(
              'Your informations!',
              'Event updated successfully ✅',
              'success'
            );
            this.router.navigate(['/listEvents']);
          },
          error: (err) => {
            console.error("Erreur lors de la mise à jour :", err);
            Swal.fire(
              'Error!',
              err.error.message || 'An error occurred while updating event.',
              'error'
            );
          }
        });
  
      } else {
        // Mode Add
        this.event.addEvent(Data).subscribe({
          next: (data) => {
            Swal.fire(
              'Your informations!',
              'Event added successfully 🎉',
              'success'
            );
  
            console.log("Event added:", data);
            this.router.navigate(['/listEvents']);
          },
          error: (err) => {
            if (err.status === 409) {
              Swal.fire(
                'Conflict!',
                err.error?.message || 'Conflict detected!',
                'error'
              );
            } else if (err.status === 500) {
              Swal.fire(
                'Server Error!',
                err.error?.error || 'Unexpected server error.',
                'error'
              );
            } else {
              Swal.fire(
                'Invalid form',
                'Please complete all required fields correctly.',
                'warning'
              );
            }
            
          }
        });
      }
    } else {
      Swal.fire(
        'Invalid form',
        'Please complete all required fields correctly.',
        'warning'
      );
    }
  }
  
  predictEvent() {
    if (this.aForm.valid) {
      // Préparer les données depuis le formulaire
      const eventData = {
        title: this.aForm.get('title')?.value,
        description: this.aForm.get('description')?.value,
        place: this.aForm.get('place')?.value,
        startDate: this.aForm.get('startDate')?.value,
        endDate: this.aForm.get('endDate')?.value,
        capacityMax: this.aForm.get('capacityMax')?.value,
        price: this.aForm.get('price')?.value
      };
  
      // Appel du service FastAPI
      this.event.predictEvent(eventData).subscribe(
        res => {
          this.prediction = res;
  
          // Construire le message
          const status = res.success_prediction === 1 ? 'Successful 🎉' : 'Not Successful ❌';
          const prob = (res.probability_success * 100).toFixed(2);
  
          // Affichage popup
          Swal.fire(
            'Event Prediction',
            `This event is predicted as: <b>${status}</b><br>Probability: <b>${prob}%</b>`,
            res.success_prediction === 1 ? 'success' : 'error'
          );
        },
        err => {
          console.error('Erreur prediction:', err);
          Swal.fire('Error', 'Impossible de faire la prédiction 🚨', 'error');
        }
      );
    } else {
      console.warn('Formulaire invalide !');
      Swal.fire('Invalid Form', 'Veuillez remplir tous les champs correctement.', 'warning');
    }
  }
  
}