import { Injectable } from '@angular/core';
import { Place } from './place.model';
@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  private _places: Place[] = [
    new Place('p1', 'Manhattan Mansion', 'In the heart of New York City.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Luchtfoto_van_Lower_Manhattan.jpg/800px-Luchtfoto_van_Lower_Manhattan.jpg', 149.99),
    new Place('p2', 'Sunny Beach House', 'A beautiful beach house in Miami, Florida.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Luchtfoto_van_Lower_Manhattan.jpg/800px-Luchtfoto_van_Lower_Manhattan.jpg', 199.99),
    new Place('p3', 'Mountain Retreat', 'A cozy cabin in the Rocky Mountains.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Luchtfoto_van_Lower_Manhattan.jpg/800px-Luchtfoto_van_Lower_Manhattan.jpg', 120.00),
    new Place('p4', 'Modern Downtown Loft', 'Stylish loft in the heart of Chicago.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Luchtfoto_van_Lower_Manhattan.jpg/800px-Luchtfoto_van_Lower_Manhattan.jpg', 180.50),
    new Place('p5', 'Parisian Apartment', 'Charming apartment overlooking the Eiffel Tower.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Luchtfoto_van_Lower_Manhattan.jpg/800px-Luchtfoto_van_Lower_Manhattan.jpg', 220.75)
  ]; 

  get places(){
    return [...this._places];
  }

  constructor() { }

  getPlace(id: string){
    return {
      ...this._places.find(p => p.id === id)
    };
  }
}
