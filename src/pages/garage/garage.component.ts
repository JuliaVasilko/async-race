import './garage.css';

import { Button } from '@/components/button/button';
import { Dialog } from '@/components/dialog/dialog';
import { CreateCarComponent } from '@/components/garage-input-row/create-car.component';
import { UpdateCarComponent } from '@/components/garage-input-row/update-car.component';
import { TrackComponent } from '@/components/track/track.component';
import { BaseCar, Car } from '@/models/garage.model';
import type { GarageService } from '@/services/garage.service';
import type { RaceService } from '@/services/race.service';
import { WinnerService } from '@/services/winner.service';
import { Component } from '@/utils/component';
import type { EventEmitter } from '@/utils/event-emmiter';
import { EVENT_TYPE } from '@/utils/events';

export class GarageComponent extends Component {
  private readonly carBrands = [
    'Toyota', 'Ford', 'Honda', 'Chevrolet', 'Nissan',
    'BMW', 'Mercedes-Benz', 'Volkswagen', 'Hyundai', 'Kia',
  ];

  private readonly carModels = [
    '1', '3', '5', '7', 'X',
    'Sport', 'Light', 'Pro', 'GT', 'Turbo',
  ];
  private cars: Car[] = [];
  private page = 1;
  private limit = 7;
  private total = 0;
  private prevButton: Button;
  private nextButton: Button;
  private trackComponent: TrackComponent;
  private raceButton: Button;
  private resetButton: Button;
  private generateCarsButton: Button;
  private totalInfo: Component;
  private pageInfo: Component;
  private startRaceTime: number | null = null;
  private finishedCars = 0;


  constructor(
    private readonly garageService: GarageService,
    private readonly raceService: RaceService,
    private readonly winnerService: WinnerService,
    private readonly eventEmitter: EventEmitter,
  ) {
    super({ tag: 'div', className: 'garage-page' });
    this.prevButton = new Button({ text: 'prev', callback: this.showPrevPage.bind(this) });
    this.nextButton = new Button({ text: 'next', callback: this.showNextPage.bind(this) });
    this.trackComponent = new TrackComponent(this.garageService, this.raceService, this.eventEmitter);
    const paginationBlock = new Component({
      className: 'garage-pagination',
    }, [this.prevButton, this.nextButton]);
    this.raceButton = new Button({ text: 'Race', callback: this.startRace.bind(this) });
    this.resetButton = new Button({ text: 'Reset', callback: this.resetRace.bind(this) });
    this.resetButton.setDisabled(true);

    this.generateCarsButton = new Button({ text: 'Generate Cars', callback: this.generateCars.bind(this) });

    const controlsBlock = new Component({ className: 'garage-controls' }, [
      this.raceButton,
      this.resetButton,
      this.generateCarsButton,
    ]);

    this.totalInfo = new Component({ className: 'garage-total-info' });
    this.pageInfo = new Component({ className: 'garage-page-info' });
    const infoBlock = new Component({ className: 'garage-info-block' }, [
      this.totalInfo,
      this.pageInfo,
    ]);

    this.appendChildren([
      new CreateCarComponent({ eventEmitter: this.eventEmitter, callback: this.createCar.bind(this) }),
      new UpdateCarComponent({ eventEmitter: this.eventEmitter, callback: this.updateCar.bind(this) }),
      controlsBlock,
      infoBlock,
      this.trackComponent,
      paginationBlock,
    ]);

    this.eventEmitter.subscribe(EVENT_TYPE.REMOVE_CAR, this.removeCarHandler);
    this.eventEmitter.subscribe(EVENT_TYPE.FINISH_CAR, this.finishCarHandler);

    this.getCarsAndUpdateView();
  }

  async createCar(newCar: BaseCar): Promise<void> {
    await this.garageService.createCar(newCar);
    await this.getCarsAndUpdateView();
  }

  async updateCar(id: number, newCar: BaseCar): Promise<void> {
    await this.garageService.updateCar(id, newCar);
    await this.getCarsAndUpdateView();
  }

  async showPrevPage(): Promise<void> {
    this.page -= 1;
    await this.getCarsAndUpdateView();
  }

  async showNextPage(): Promise<void> {
    this.page += 1;
    await this.getCarsAndUpdateView();
  }

  private removeCarHandler = (): void => {
    this.total -= 1;
    this.totalInfo.setTextContent(`Garage (${this.total})`);
  };

  private async getCarsAndUpdateView(): Promise<void> {
    const { cars, total } = await this.garageService.getCars(this.page);
    this.cars = cars;
    this.total = total;

    this.totalInfo.setTextContent(`Garage (${this.total})`);
    this.pageInfo.setTextContent(`Page #${this.page}`);

    this.trackComponent.updateCars(this.cars);
    this.updatePaginationBlock();
  }

  private updatePaginationBlock(): void {
    const pageCount = Math.ceil(this.total / this.limit) ?? 1;
    this.nextButton.setDisabled(this.page >= pageCount);
    this.prevButton.setDisabled(this.page === 1);
  }

  private async generateCars(): Promise<void> {
    const cars: BaseCar[] = [];
    for (let i = 0; i < 100; i++) {
      const brand = this.carBrands[Math.floor(Math.random() * this.carBrands.length)];
      const model = this.carModels[Math.floor(Math.random() * this.carModels.length)];
      const name = `${brand} ${model}`;
      const color = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
      cars.push({ name, color });
    }

    await this.garageService.createCars(cars);
    await this.getCarsAndUpdateView();
  }

  private async startRace(): Promise<void> {
    this.raceButton.setDisabled(true);
    this.resetButton.setDisabled(true);
    this.generateCarsButton.setDisabled(true);

    this.startRaceTime = Date.now();
    this.eventEmitter.emit<void>(EVENT_TYPE.START_RACE);
  }

  private finishCarHandler = ({ car, success }: { car: Car, success: boolean }): void => {
    this.finishedCars += 1;

    if (this.startRaceTime && success) {
      const time = ((Date.now() - this.startRaceTime) / 1000).toFixed(2);
      const winnerDialog = new Dialog({
        showOkBtn: true,
        content: [new Component({ text: `the winner is ${car.name} with ${time} sec` })],
      });

      this.append(winnerDialog);

      winnerDialog.showModal()
        .then(() => this.winnerService.getWinner(car.id)
          .then((winner) => {
              const newTime = Math.min(Number(time), winner.time);
              return this.winnerService.updateWinner(winner.id, { time: newTime, wins: winner.wins + 1 });
            },
            () => this.winnerService.createWinner({ time: Number(time), id: car.id, wins: 1 }),
          ),
        );

      this.startRaceTime = null;
    }

    if (this.finishedCars === this.cars.length) {
      this.raceButton.setDisabled(true);
      this.resetButton.setDisabled(false);
      this.generateCarsButton.setDisabled(false);
      this.eventEmitter.emit(EVENT_TYPE.END_RACE);
      this.finishedCars = 0;
    }
  };

  private resetRace(): void {
    this.eventEmitter.emit(EVENT_TYPE.RESET_RACE);
    this.raceButton.setDisabled(false);
    this.resetButton.setDisabled(true);
  }

  remove(): void {
    this.eventEmitter.unsubscribe(EVENT_TYPE.REMOVE_CAR, this.removeCarHandler);
    this.eventEmitter.unsubscribe(EVENT_TYPE.FINISH_CAR, this.finishCarHandler);
    super.remove();
  }

  showPage(): void {
    this.removeClass('hide');
  }

  hidePage(): void {
    this.addClass('hide');
  }
}
