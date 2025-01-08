import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { PlacesService } from '../../places.service';
import { Place } from '../../place.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-offer',
  standalone: false,
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit, OnDestroy {
  form!: FormGroup;
  place!: Place;
  private placesSub!: Subscription;
  isLoading= false;
  placeId!: string;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private placesService: PlacesService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl('', Validators.required),
      description: new FormControl('', [Validators.required, Validators.maxLength(180)]),
    });
  
    this.route.paramMap.subscribe((paramMap) => {
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('/places/tabs/offers');
        return;
      }
      this.placeId = paramMap.get('placeId') || '';
      this.isLoading = true;
      this.placesSub = this.placesService
        .getPlace(this.placeId)
        .subscribe(
          (place) => {
            this.place = place;
            this.form.patchValue({
              title: this.place.title,
              description: this.place.description,
            });
            this.isLoading = false;
          },
          (error) => {
            this.alertCtrl
              .create({
                message: 'Place could not be fetched... try again',
                buttons: [
                  {
                    text: 'Okay',
                    handler: () => {
                      this.router.navigate(['/places/tabs/offers']);
                    },
                  },
                ],
              })
              .then((alertEl) => {
                alertEl.present();
              });
          }
        );
    });
  }
  

  onUpdateOffer() {
    if (!this.form.valid) {
      return;
    }
    this.loadingCtrl.create({ 
      message: 'Updating place...'
    }).then(loadingEl => {
      loadingEl.present();
      this.placesService.updateOffer(this.place.id, this.form.value.title, this.form.value.description).subscribe(() => {
        loadingEl.dismiss();
        this.form.reset();
        this.router.navigateByUrl('/places/tabs/offers');
      });
    });
    
  }

  ngOnDestroy(): void {
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }
}
