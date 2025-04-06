import { GarageInputRowComponent } from '@/components/garage-input-row/garage-input-row.component';
import { BaseCar, Car } from '@/models/garage.model';
import type { EventEmitter } from '@/utils/event-emmiter';
import { EVENT_TYPE } from '@/utils/events';

interface updateCarProps {
  eventEmitter: EventEmitter,
  callback: (id: number, car: BaseCar) => Promise<void>;
}

export class UpdateCarComponent extends GarageInputRowComponent {
  private eventEmitter: EventEmitter;
  callback: (id: number, car: BaseCar) => Promise<void>;
  id?: number;


  constructor({ eventEmitter, callback }: updateCarProps) {
    super({ type: 'update' });
    this.eventEmitter = eventEmitter;
    this.setRowDisabled(true);
    this.callback = callback;
    this.eventEmitter.subscribe(EVENT_TYPE.START_UPDATE_CAR, this.startUpdateCarHandler);
  }

  handleInputChange(event: Event) {
    if (event.target instanceof HTMLInputElement) {
      this.button.setDisabled(!event.target.value.trim());
    }
  }

  startUpdateCarHandler = (car: Car): void => {
    const { id, color, name } = car;
    this.id = id;
    this.colorSelector.getNode().value = color;
    this.input.getNode().value = name;

    this.setRowDisabled(false);
  }

  async handleSubmit(): Promise<void> {
    try {
      this.setRowDisabled(true);

      if (this.id) {
        await this.callback(
          this.id,
          {
            name: this.input.getNode().value,
            color: this.colorSelector.getNode().value.trim(),
          });
      }

      this.input.getNode().value = '';
      this.colorSelector.getNode().value = '#000000';
    } catch {
      this.setRowDisabled(false);
    }
  }

  remove(): void {
    this.eventEmitter.unsubscribe(EVENT_TYPE.START_UPDATE_CAR, this.startUpdateCarHandler);
    super.remove();
  }

  private setRowDisabled(disabled: boolean): void {
    this.input.setDisabled(disabled);
    this.colorSelector.setDisabled(disabled);
    this.button.setDisabled(disabled);
  }
}
