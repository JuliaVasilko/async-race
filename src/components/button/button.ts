import { Component } from '@/utils/component';
import './button.css';

interface ButtonProps {
  className?: string;
  text: string;
  callback?: (event?: Event) => void | Promise<void>;
}

export class Button extends Component<HTMLInputElement> {
  constructor({ className, text, callback }: ButtonProps) {
    super({ tag: 'button', className: className, text: text });

    if (callback) {
      this.addListener('click', event => callback!(event!));
    }
  }

  public setDisabled(disabled: boolean): void {
    super.setDisabled(disabled);

    this.getNode().disabled = this.getDisabled();
  }
}
