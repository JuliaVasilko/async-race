import './winners.css';

import { Button } from '@/components/button/button';
import { WinnersTableComponent } from '@/components/winners-table/winners-table.component';
import { Winner } from '@/models/winner.model';
import { GarageService } from '@/services/garage.service';
import type { orderOption, sortOption, WinnerService } from '@/services/winner.service';
import { Component } from '@/utils/component';

export class WinnersComponent extends Component {
  private winners: Winner[] = [];
  private limit = 10;
  private page: number = 1;
  private total?: number;
  private totalInfo = new Component({ className: 'garage-total-info' });
  private pageInfo = new Component({ className: 'garage-page-info' });
  private winnersTable: WinnersTableComponent;
  private sort: sortOption = 'id';
  private order: orderOption = 'ASC';


  private prevButton = new Button({ text: 'prev', callback: this.showPrevPage.bind(this) });
  private nextButton = new Button({ text: 'next', callback: this.showNextPage.bind(this) });


  constructor(
    private readonly winnerService: WinnerService,
    private readonly garageService: GarageService,
  ) {
    super({ className: 'winners-page hide' });

    const paginationBlock = new Component({
      className: 'garage-pagination',
    }, [this.prevButton, this.nextButton]);

    const infoBlock = new Component({ className: 'garage-info-block' }, [
      this.totalInfo,
      this.pageInfo,
    ]);

    this.winnersTable = new WinnersTableComponent(this.changeSortHandler, this.garageService);

    this.appendChildren([
      infoBlock,
      this.winnersTable,
      paginationBlock,
    ]);

  }

  showPage(): void {
    this.removeClass('hide');
    this.getWinnersAndUpdateView();
  }

  hidePage(): void {
    this.addClass('hide');
  }

  private async showPrevPage(): Promise<void> {
    this.page -= 1;
    await this.getWinnersAndUpdateView();
  }

  private async showNextPage(): Promise<void> {
    this.page += 1;
    await this.getWinnersAndUpdateView();
  }


  private changeSortHandler = async (
    sort: 'id' | 'wins' | 'time' = 'id',
    order: 'ASC' | 'DESC' = 'ASC',
  ): Promise<void> => {
    this.sort = sort;
    this.order = order;
    await this.getWinnersAndUpdateView();
  };

  private async getWinnersAndUpdateView(): Promise<void> {
    const { winners, total } = await this.winnerService.getWinners(this.page, this.sort, this.order);
    this.winners = winners;
    this.total = total;

    this.totalInfo.setTextContent(`Winners (${this.total})`);
    this.pageInfo.setTextContent(`Page #${this.page}`);

    this.updatePaginationBlock();
    this.winnersTable.updateView(this.winners);
  }

  private updatePaginationBlock(): void {
    const pageCount = Math.ceil(this.total! / this.limit) ?? 1;
    this.nextButton.setDisabled(this.page >= pageCount);
    this.prevButton.setDisabled(this.page === 1);
  }
}
