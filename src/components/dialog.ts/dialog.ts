import { Component } from "@/utils/component";
import { Button } from "../button/button";
import "./dialog.css";

interface DialogProps {
  showOkBtn?: boolean;
  textOkButton?: string;
  showCancelBtn?: boolean;
  textCancelButton?: string;
  content?: Component[];
}

export class Dialog extends Component<HTMLDialogElement> {
  protected contentCotainer: Component;

  private resolve?: (value: boolean) => void;
  private reject?: (reason?: boolean) => void;
  private okBtn?: Button;
  private cancelBtn?: Button;
  private actionContainer: Component;

  constructor({
    showOkBtn,
    textOkButton = "Confirm",
    showCancelBtn,
    textCancelButton = "Cancel",
    content,
  }: DialogProps) {
    super({ tag: "dialog", className: "dialog" });
    this.contentCotainer = new Component<HTMLDivElement>(
      { className: "dialog-content" },
      content
    );

    this.actionContainer = new Component({
      tag: "div",
      className: "dialog-actions",
    });

    if (showOkBtn) {
      this.okBtn = new Button({
        text: textOkButton,
        callback: this.okBtnCallback.bind(this),
      });
      this.actionContainer.append(this.okBtn);
    }

    if (showCancelBtn) {
      this.cancelBtn = new Button({
        text: textCancelButton,
        callback: this.cancelBtnCallback.bind(this),
      });
      this.actionContainer.append(this.cancelBtn);
    }

    this.appendChildren([this.contentCotainer, this.actionContainer]);
  }

  public showModal(): Promise<boolean> {
    this.getNode().showModal();
    return new Promise<boolean>((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }

  public closeModal(reason: boolean): void {
    this.getNode().close();
    if (reason) {
      this.resolve!(reason);
    } else {
      this.reject!(reason);
    }

    this.resolve = undefined;
    this.reject = undefined;
  }

  protected okBtnCallback(): void {
    this.closeModal(true);
  }

  protected cancelBtnCallback(): void {
    this.closeModal(false);
  }
}
