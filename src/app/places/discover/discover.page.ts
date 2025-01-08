import { Component, OnDestroy, OnInit } from '@angular/core';
import { PlacesService } from '../places.service';
import { Place } from '../place.model';
import { MenuController, SegmentChangeEventDetail } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-discover',
  standalone: false,
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit, OnDestroy {

  loadedPlaces!: Place[];
  listLoadedPlaces!: Place[];
  relevantPlaces!: Place[];
  isLoading = false;

  private placesSub!: Subscription;
  constructor(private placesService: PlacesService, private menuCtrl: MenuController, private authService: AuthService) { }

  ngOnInit() {
    this.placesSub = this.placesService.places.subscribe(places => {
      this.loadedPlaces = places;
      this.relevantPlaces = this.loadedPlaces;
      this.listLoadedPlaces = this.relevantPlaces.slice(1);
    });
  }

  ionViewWillEnter(){
    this.isLoading = true;
    this.placesService.fetchPlaces().subscribe(()=>{
      this.isLoading = false;
    });
  }

  onFilterUpdate(event: CustomEvent<SegmentChangeEventDetail>){
    if(event.detail.value === 'all'){
      this.relevantPlaces = this.loadedPlaces;
      this.listLoadedPlaces = this.relevantPlaces.slice(1);
    }
    else{
      this.relevantPlaces = this.loadedPlaces.filter(place => place.userId !== this.authService.userId);
      this.listLoadedPlaces = this.relevantPlaces.slice(1);
    }
    console.log(event.detail);
  }

  ngOnDestroy(): void {
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }
}
