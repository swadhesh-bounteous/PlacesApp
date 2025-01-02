import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-new-offer',
  templateUrl: './new-offer.page.html',
  standalone:false,
  styleUrls: ['./new-offer.page.scss'],
})
export class NewOfferPage implements OnInit {

  cards = Array(12).fill(0);
  constructor() { }

  ngOnInit() {
  }

}
