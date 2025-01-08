import { Injectable } from '@angular/core';
import { Place } from './place.model';
import { AuthService } from '../auth/auth.service';
import {
  BehaviorSubject,
  delay,
  map,
  Observable,
  of,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { HttpClient } from '@angular/common/http';

interface PlaceData{
  availableFrom: string,
  availableTo: string,
  description: string,
  imageUrl: string,
  price: number,
  title: string,
  userId: string
}

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private _places = new BehaviorSubject<Place[]>([]);

  get places() {
    return this._places.asObservable();
  }

  fetchPlaces() {
    return this.httpClient
      .get<{ [key: string]: Place }>(
        'https://places-app-d15fb-default-rtdb.firebaseio.com/offered-places.json'
      )
      .pipe(
        map((resData) => {
          const places = [];
          for (const key in resData) {
            if (resData.hasOwnProperty(key)) {
              const availableFrom = resData[key].availableFrom
                ? new Date(resData[key].availableFrom)
                : new Date();
              const availableTo = resData[key].availableTo
                ? new Date(resData[key].availableTo)
                : new Date();
              places.push(
                new Place(
                  key,
                  resData[key].title,
                  resData[key].description,
                  resData[key].imageUrl,
                  resData[key].price,
                  availableFrom,
                  availableTo,
                  resData[key].userId
                )
              );
            }
          }
          return places;
        }),
        tap((places) => {
          this._places.next(places);
        })
      );
  }

  constructor(
    private authService: AuthService,
    private httpClient: HttpClient
  ) {}

  getPlace(id: string) {
    return this.httpClient
      .get<PlaceData>(
        `https://places-app-d15fb-default-rtdb.firebaseio.com/offered-places/${id}.json`
      )
      .pipe(
        map((placeData) => {
          const availableFrom = placeData.availableFrom
            ? new Date(placeData.availableFrom)
            : new Date(); // Default to current date if undefined
          const availableTo = placeData.availableTo
            ? new Date(placeData.availableTo)
            : new Date(); // Default to current date if undefined
          return new Place(
            id,
            placeData.title,
            placeData.description,
            placeData.imageUrl,
            placeData.price,
            new Date(availableFrom),
            new Date(availableTo),
            placeData.userId
          );
        })
      );
  }

  addPlace(
    title: string,
    description: string,
    price: number,
    dateFrom: Date,
    dateTo: Date
  ): Observable<Place[]> {
    let generatedId: string;
    const newPlace = new Place(
      Math.random().toString(),
      title,
      description,
      'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Luchtfoto_van_Lower_Manhattan.jpg/800px-Luchtfoto_van_Lower_Manhattan.jpg',
      price,
      dateFrom,
      dateTo,
      this.authService.userId
    );
    return this.httpClient
      .post<{ name: string }>(
        'https://places-app-d15fb-default-rtdb.firebaseio.com/offered-places.json',
        {
          ...newPlace,
          id: null,
        }
      )
      .pipe(
        switchMap((resData) => {
          generatedId = resData.name;
          return this.places;
        }),
        take(1),
        tap((places) => {
          newPlace.id = generatedId;
          this._places.next(places.concat(newPlace));
        })
      );
    // return this.places.pipe(
    //   take(1),
    //   delay(1000),
    //   tap((places) => {
    //     this._places.next(places.concat(newPlace));
    //   })
    // );
  }

  updateOffer(placeId?: string, title?: string, description?: string) {
    let updatedPlaces: Place[];
    return this.places.pipe(
      take(1),
      switchMap((places) => {
        if(!places || places.length<=0){
          return this.fetchPlaces();
        }
        else{
          return of(places);
        }
        
      }),
      switchMap(places=>{
        const updatedPlaceIndex = places.findIndex((pl) => pl.id === placeId);
        updatedPlaces = [...places];
        const oldPlace = updatedPlaces[updatedPlaceIndex];
        updatedPlaces[updatedPlaceIndex] = new Place(
          oldPlace.id,
          title,
          description,
          oldPlace.imageUrl,
          oldPlace.price,
          oldPlace.availableFrom,
          oldPlace.availableTo,
          oldPlace.userId
        );
        return this.httpClient.put(
          `https://places-app-d15fb-default-rtdb.firebaseio.com/offered-places/${placeId}.json`,
          { ...updatedPlaces[updatedPlaceIndex], id: null }
        );
      }),
      tap(() => {
        this._places.next(updatedPlaces);
      })
    );
    //   delay(1000),
    //   tap((places) => {
    //     const updatedPlaceIndex = places.findIndex((pl) => pl.id === placeId);
    //     const updatedPlaces = [...places];
    //     const oldPlace = updatedPlaces[updatedPlaceIndex];
    //     updatedPlaces[updatedPlaceIndex] = new Place(
    //       oldPlace.id,
    //       title,
    //       description,
    //       oldPlace.imageUrl,
    //       oldPlace.price,
    //       oldPlace.availableFrom,
    //       oldPlace.availableTo,
    //       oldPlace.userId
    //     );
    //     this._places.next(updatedPlaces);
    //   })
    // );
  }
}
