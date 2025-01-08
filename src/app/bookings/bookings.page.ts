import { Component, OnInit } from '@angular/core';
import { BookingService } from './booking.service';
import { Booking } from './booking.model';
import { IonItemSliding, LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-bookings',
  standalone:false,
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit {
  loadedBookings!: Booking[];
  private bookingSub!: Subscription;

  constructor(private bookingService: BookingService, private loadingController: LoadingController) { }

  ngOnInit() {
    this.bookingSub = this.bookingService.bookings.subscribe(bookings =>{
      this.loadedBookings = bookings;
    });
  }

  onCancelBooking(bookingId: string | undefined, slidingBooking: IonItemSliding){
    slidingBooking.close();
    this.loadingController.create({message: 'Cancelling...'}).then(loadingEl =>{
      loadingEl.present();
      this.bookingService.cancelBooking(bookingId).subscribe(() =>{
        loadingEl.dismiss();
      });
    });

  }

  ngOnDestroy(){
    if(this.bookingSub){
      this.bookingSub.unsubscribe();
    }
  }

}
