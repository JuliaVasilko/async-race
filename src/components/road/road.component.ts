import { CarSvgComponent } from '@/components/svg/car.svg.component';
import { FlagSvgComponent } from '@/components/svg/flag.svg.component';
import './road.css';

import { Button } from '@/components/button/button';
import { Car } from '@/models/garage.model';
import { GarageService } from '@/services/garage.service';
import { RaceService } from '@/services/race.service';
import { Component } from '@/utils/component';
import type { EventEmitter } from '@/utils/event-emmiter';
import { EVENT_TYPE } from '@/utils/events';

export class RoadComponent extends Component {
  private car: Car;
  private selectButton: Button;
  private removeButton: Button;
  private startButton: Button;
  private backButton: Button;
  private carIcon: Component;
  private finishIcon: Component;
  private roadBlock: Component;
  private animationFrame?: number;
  private startTime?: number;
  private velocity?: number;
  private distance?: number;
  private roadWidth?: number;
  private position: number = 0;

  constructor(
    car: Car,
    private readonly garageService: GarageService,
    private readonly raceService: RaceService,
    private readonly eventEmitter: EventEmitter,
  ) {
    super({ tag: 'div', className: 'road' });

    this.car = car;
    this.selectButton = new Button({ text: 'select', callback: this.startUpdateCar.bind(this) });
    this.removeButton = new Button({ text: 'remove', callback: this.removeCar.bind(this) });

    this.carIcon = new CarSvgComponent(this.car.color);
    this.finishIcon = new FlagSvgComponent();

    const topBlock = new Component({ className: 'top-block' }, [
      this.selectButton,
      this.removeButton,
      new Component({ tag: 'h3', className: 'car-name', text: this.car.name }),
    ]);

    const controlBlock = new Component({ className: 'control-block' }, [
      this.startButton = new Button({ text: 'A', callback: this.startEngine.bind(this) }),
      this.backButton = new Button({ text: 'B', callback: this.stopCar.bind(this) }),
    ]);

    this.backButton.setDisabled(true);

    this.roadBlock = new Component({ className: 'road-block' }, [
      this.carIcon,
      this.finishIcon,
    ]);

    const roadWrapper = new Component({ className: 'road-wrapper' }, [
      controlBlock,
      this.roadBlock,
    ]);

    this.appendChildren([
      topBlock,
      roadWrapper,
    ]);

    this.eventEmitter.subscribe(EVENT_TYPE.START_RACE, this.startRaceHandler);
    this.eventEmitter.subscribe(EVENT_TYPE.RESET_RACE, this.resetRaceHandler);
  }

  async startEngine(): Promise<void> {
    this.startButton.setDisabled(true);
    this.backButton.setDisabled(false);
    this.selectButton.setDisabled(true);
    this.removeButton.setDisabled(true);

    const { velocity, distance } = await this.raceService.startEngine(this.car.id);
    this.velocity = velocity;
    this.distance = distance;
    this.roadWidth = this.roadBlock.getNode().getBoundingClientRect().width;
    this.startAnimation();

    try {
      const { success } = await this.raceService.startDrive(this.car.id);

      this.eventEmitter.emit<{ car: Car, success: boolean }>(EVENT_TYPE.FINISH_CAR, { car: this.car, success });
    } catch (e) {
      this.eventEmitter.emit<{ car: Car, success: boolean }>(EVENT_TYPE.FINISH_CAR, { car: this.car, success: false });

      console.log(this.car.name + 'engine is break');
    } finally {
      this.stopAnimation();
      this.selectButton.setDisabled(false);
      this.removeButton.setDisabled(false);
    }
  }

  resetCarPosition(): void {
    this.stopAnimation();
    this.carIcon.getNode().style.left = '0';
    this.backButton.setDisabled(true);
    this.startButton.setDisabled(false);
    this.selectButton.setDisabled(false);
    this.removeButton.setDisabled(false);
  }

  remove(): void {
    this.eventEmitter.unsubscribe(EVENT_TYPE.START_RACE, this.startRaceHandler);
    this.eventEmitter.unsubscribe(EVENT_TYPE.RESET_RACE, this.resetRaceHandler);
    super.remove();
  }

  private async removeCar(): Promise<void> {
    await this.garageService.deleteCar(this.car.id);
    this.eventEmitter.emit(EVENT_TYPE.REMOVE_CAR);
    this.remove();
  }

  private async stopCar(): Promise<void> {
    await this.raceService.stopEngine(this.car.id);
    this.resetCarPosition();
  }

  private startUpdateCar(): void {
    this.eventEmitter.emit(EVENT_TYPE.START_UPDATE_CAR, this.car);
  }

  private startAnimation(): void {
    if (this.animationFrame) return;

    this.startTime = performance.now();
    const totalTime = (this.distance! / this.velocity!);
    const targetX = this.roadWidth! - 60;

    const animate = (currentTime: number) => {
      if (!this.startTime) return;

      const elapsedTime = currentTime - this.startTime;
      const progress = Math.min(elapsedTime / totalTime, 1);
      this.position = progress * targetX;
      this.carIcon.getNode().style.left = `${this.position}px`;

      if (progress < 1) {
        this.animationFrame = requestAnimationFrame(animate);
      } else {
        this.animationFrame = undefined;
      }
    };

    this.animationFrame = requestAnimationFrame(animate);
  }

  private stopAnimation(): void {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = undefined;
    }
  }

  private startRaceHandler = async (): Promise<void> => {
    return await this.startEngine();
  };

  private resetRaceHandler = (): void => {
    this.stopCar();
  };
}
