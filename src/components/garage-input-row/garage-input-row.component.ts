import './garage-input-row.css'

import { Button } from '@/components/button/button';
import { Input } from '@/components/input/input';
import { Component } from '@/utils/component';

interface GarageInputRowProps {
  type: 'create' | 'update';
}

export abstract class GarageInputRowComponent extends Component {
  input: Input;
  colorSelector: Input;
  button: Button;

  protected constructor({ type }: GarageInputRowProps) {
    super({ className: 'garage-input-row' });

    this.input = new Input({ type: 'text', placeholder: 'Car\'s model', callback: this.handleInputChange.bind(this) });
    this.colorSelector = new Input({ type: 'color' });
    this.button = new Button({ text: type, callback: this.handleSubmit.bind(this) });

    this.appendChildren([
      this.input,
      this.colorSelector,
      this.button,
    ]);
  }

  abstract handleSubmit(event?: Event): Promise<void>;
  abstract handleInputChange(event?: Event): void;
}
