import { Button } from '@/components/button/button';
import { GarageComponent } from '@/pages/garage/garage.component';
import { WinnersComponent } from '@/pages/winners/winners.component';
import type { GarageService } from '@/services/garage.service';
import type { RaceService } from '@/services/race.service';
import type { WinnerService } from '@/services/winner.service';
import { Component } from '@/utils/component';
import type { EventEmitter } from '@/utils/event-emmiter';

export class AppComponent extends Component {
  garagePage: GarageComponent;
  winnersPage: WinnersComponent | null = null;
  navButton: Button;
  currentPage: 'garage' | 'winners' = 'garage';

  constructor(
    private readonly garageService: GarageService,
    private readonly raceService: RaceService,
    private readonly winnerService: WinnerService,
    private readonly eventEmitter: EventEmitter,
  ) {
    super({ tag: 'main' });


    this.navButton = new Button({ text: 'to winners', callback: this.toggleView.bind(this) });
    this.garagePage = new GarageComponent(this.garageService, this.raceService, this.winnerService, this.eventEmitter);
    this.winnersPage = new WinnersComponent(this.winnerService, this.garageService);
    this.appendChildren([this.navButton, this.garagePage, this.winnersPage]);
  }

  init(): void {
    document.body.append(this.getNode());
  }

  private toggleView(): void {
    if (this.currentPage === 'garage') {
      this.currentPage = 'winners';
    } else {
      this.currentPage = 'garage';
    }

    this.updateNavButtonText();
    this.updateView();
  }

  private updateNavButtonText(): void {
    if (this.currentPage === 'garage') {
      this.navButton.setTextContent(`to winners`);
    } else {
      this.navButton.setTextContent(`to garage`);
    }
  }

  private updateView(): void {
    if (this.currentPage === 'garage') {
      this.winnersPage?.hidePage();
      this.garagePage?.showPage();
    } else {
      this.winnersPage?.showPage();
      this.garagePage?.hidePage();
    }
  }
}
