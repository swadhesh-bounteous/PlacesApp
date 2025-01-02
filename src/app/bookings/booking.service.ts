import { Injectable } from '@angular/core';
import { Booking } from './booking.model';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private _bookings: Booking[] = [
    {
      id:'xyz',
      placeId: 'p1',
      userId: 'abc',
      placeTitle:'Chennai',
      guestNumber: 2
    }
  ];

  constructor() { }

  get bookings(){
    return [...this._bookings];
  }
}
