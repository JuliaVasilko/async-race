import './winners-table.css';

import { CarSvgComponent } from '@/components/svg/car.svg.component';
import { Car } from '@/models/garage.model';
import { Winner } from '@/models/winner.model';
import { GarageService } from '@/services/garage.service';
import { orderOption, sortOption } from '@/services/winner.service';
import { Component } from '@/utils/component';

export class WinnersTableComponent extends Component {
  private winners: Winner[] = [];
  private cars: Car[] = [];
  private sort: sortOption = 'id';
  private order: orderOption = 'ASC';
  private header: Component;
  private body: Component;
  private nameHeadCell = new Component({ tag: 'th', text: 'Name' });
  private winsHeadCell = new Component({ tag: 'th', text: 'Wins' });
  private timeHeadCell = new Component({ tag: 'th', text: 'Best time (seconds)' });

  constructor(
    readonly changeSortingCallback: (sort: sortOption, order: orderOption) => Promise<void>,
    private readonly garageService: GarageService,
  ) {
    super({ tag: 'table', className: 'winners-table' });

    this.winsHeadCell.setAttribute('data-sort', 'wins');
    this.timeHeadCell.setAttribute('data-sort', 'time');
    this.body = new Component({ tag: 'tbody' });

    this.header = new Component({ tag: 'thead' }, [
      new Component({ tag: 'th', text: '#' }),
      new Component({ tag: 'th', text: 'car' }),
      this.nameHeadCell,
      this.winsHeadCell,
      this.timeHeadCell,
    ]);

    this.header.addListener('click', this.changeSortingHandler);
    this.appendChildren([this.header, this.body]);
  }

  async updateView(winners: Winner[]): Promise<void> {
    this.winners = winners;

    this.cars = await Promise.all(this.winners.map((winner) => this.garageService.getCar(winner.id)));
    const content = this.winners.map((winner: Winner, i: number) => new Component({ tag: 'tr' }, [
      new Component({ tag: 'td', text: String(i) }),
      new Component({ tag: 'td' }, [new CarSvgComponent(this.cars[i].color, 12)]),
      new Component({ tag: 'td', text: this.cars[i].name }),
      new Component({ tag: 'td', text: String(winner.wins) }),
      new Component({ tag: 'td', text: String(winner.time) }),
    ]));
    this.body.removeChildren();
    this.body.appendChildren(content);
  }

  private changeSortingHandler = (event?: Event): void => {
    if (event && event.target) {
      const th = (event.target as HTMLElement).closest('th');

      if (th && th.dataset.sort) {
        if (this.sort === th.dataset.sort) {
          this.order = this.order === 'ASC' ? 'DESC' : 'ASC';
        } else {
          this.sort = (th.dataset.sort as sortOption);
          this.order = 'ASC';

        }

        this.changeSortingCallback(this.sort, this.order);
      }
    }
  };
}
