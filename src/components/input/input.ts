import { Component } from '@/utils/component';
import './input.css';

interface InputProps {
  id?: string;
  placeholder?: string;
  type: string;
  validators?: { name: string; value: string }[];
  value?: string;
  name?: string;
  callback?: (event: Event) => void;
  className?: string;
}

export class Input extends Component<HTMLInputElement> {
  constructor(props: InputProps) {
    super({ tag: 'input', className: props.className ?? 'input' });

    this.setInputProperties(props);
  }

  public setDisabled(disabled: boolean): void {
    super.setDisabled(disabled);

    this.getNode().disabled = this.getDisabled();
  }

  private setInputProperties(
    {
      type,
      placeholder,
      id,
      validators,
      value = '',
      name,
      callback,
    }: InputProps): void {
    const input = this.getNode() as HTMLInputElement;
    input.type = type;
    input.placeholder = placeholder ?? '';
    input.value = value;
    if (name) {
      input.name = name;
    }
    if (id) {
      input.id = id;
    }

    if (callback) {
      this.addListener('input', event => callback(event!));
    }
    validators?.forEach(validator =>
      this.setAttribute(validator.name, validator.value),
    );
  }
}

export class Label extends Component<HTMLLabelElement> {
  constructor(text: string, inputId: string) {
    super({ tag: 'label', text });

    this.setAttribute('for', inputId);
  }
}
