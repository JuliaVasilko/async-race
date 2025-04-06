import { GarageInputRowComponent } from '@/components/garage-input-row/garage-input-row.component';
import { BaseCar } from '@/models/garage.model';
import { EventEmitter } from '@/utils/event-emmiter';
import { EVENT_TYPE } from '@/utils/events';

interface createCarProps {
  eventEmitter: EventEmitter,
  callback: (car: BaseCar) => Promise<void>;
}

export class CreateCarComponent extends GarageInputRowComponent {
  callback: (car: BaseCar) => Promise<void>;
  eventEmitter: EventEmitter;

  constructor({ callback, eventEmitter }: createCarProps) {
    super({ type: 'create' });
    this.eventEmitter = eventEmitter;

    this.button.setDisabled(true);
    this.callback = callback;

    this.eventEmitter.subscribe(EVENT_TYPE.START_RACE, this.startRaceHandler);
    this.eventEmitter.subscribe(EVENT_TYPE.END_RACE, this.endRaceHandler);
  }

  handleInputChange(event: Event) {
    if (event.target instanceof HTMLInputElement) {
      this.button.setDisabled(!event.target.value.trim());
    }
  }

  async handleSubmit(): Promise<void> {
    try {
      this.button.setDisabled(true);

      await this.callback({
        name: this.input.getNode().value,
        color: this.colorSelector.getNode().value.trim(),
      });

      this.resetRow();
    } catch {
      this.button.setDisabled(false);
    }
  }

  private resetRow(): void {
    this.button.setDisabled(true);
    this.input.getNode().value = '';
    this.input.setDisabled(false);
    this.colorSelector.getNode().value = '#000000';
    this.colorSelector.setDisabled(false);
  }

  startRaceHandler = (): void => {
    this.getChildren().forEach((item) => {
      item.setDisabled(true);
    });
  };

  endRaceHandler = (): void => {
    this.resetRow();
  };
}
