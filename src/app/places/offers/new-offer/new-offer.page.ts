import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PlacesService } from '../../places.service';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-new-offer',
  standalone: false,
  templateUrl: './new-offer.page.html',
  styleUrls: ['./new-offer.page.scss'],
})
export class NewOfferPage implements OnInit {
  form!: FormGroup;
  private placesSub!: Subscription;

  constructor(
    private placesService: PlacesService,
    private router: Router,
    private loadCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      description: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(180)],
      }),
      price: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(1)],
      }),
      dateFrom: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      dateTo: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
    });
  }

  onCreateOffer() {
    if (!this.form.valid) {
      return;
    }

    // Present loading spinner
    this.loadCtrl
      .create({
        message: 'Creating place...',
      })
      .then((loadingEl) => {
        loadingEl.present();

        // Call addPlace and subscribe to handle success
        this.placesService
          .addPlace(
            this.form.value.title,
            this.form.value.description,
            +this.form.value.price,
            new Date(this.form.value.dateFrom),
            new Date(this.form.value.dateTo)
          )
          .subscribe({
            next: () => {
              loadingEl.dismiss(); // Dismiss loading spinner
              this.form.reset(); // Reset form after submission
              this.router.navigate(['/places/tabs/offers']); // Navigate to offers page
            },
            error: (error) => {
              loadingEl.dismiss(); // Dismiss loading spinner in case of error
              console.error('Error creating place:', error); // Log any error
            },
          });
      });
  }

  // Optional: Unsubscribe from placesSub if you want to manually handle the subscription
  ngOnDestroy() {
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }
}
