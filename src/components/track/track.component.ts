import './track.css';

import { RoadComponent } from '@/components/road/road.component';
import { Car } from '@/models/garage.model';
import { GarageService } from '@/services/garage.service';
import { RaceService } from '@/services/race.service';
import { Component } from '@/utils/component';
import type { EventEmitter } from '@/utils/event-emmiter';

export class TrackComponent extends Component {
  private cars: Car[] = [];

  constructor(
    private readonly garageService: GarageService,
    private readonly raceService: RaceService,
    private readonly eventEmitter: EventEmitter,
  ) {
    super({ tag: 'section', className: 'track' });
  }

  updateCars(cars: Car[]) {
    this.cars = cars;
    const roads = this.cars.map(car => new RoadComponent(car, this.garageService, this.raceService, this.eventEmitter));
    this.removeChildren();
    this.appendChildren(roads);
  }
}
