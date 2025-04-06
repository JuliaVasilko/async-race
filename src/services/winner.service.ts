import { BaseWinner, getWinnersResponse, Winner } from '@/models/winner.model';

export type sortOption = 'id' | 'wins' | 'time';
export type orderOption = 'ASC' | 'DESC';

export class WinnerService {
  private readonly patch = 'http://127.0.0.1:3000/';

  async getWinners(page = 1, sort: sortOption = 'id', order: orderOption = 'ASC'): Promise<getWinnersResponse> {
    const data = await fetch(`${this.patch}winners?_page=${page}&_limit=10&_sort=${sort}&_order=${order}`);
    const totalHeader = data.headers.get('X-Total-Count') ?? '0';
    const winners: Winner[] = await data.json();

    return {
      winners,
      total: Number(totalHeader),
    };
  }

  async getWinner(id: number): Promise<Winner> {
    const data = await fetch(`${this.patch}winners/${id}`);
    if (!data.ok) {
      throw new Error(`Winner with id ${id} not found (status ${data.status})`);
    }
    return data.json();
  }

  async createWinner(newWinner: Winner): Promise<Winner> {
    const data = await fetch(`${this.patch}winners`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify(newWinner),
    });
    return data.json();
  }

  async updateWinner(id: number, newWinner: BaseWinner): Promise<Winner> {
    const data = await fetch(`${this.patch}winners/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify(newWinner),
    });
    return data.json();
  }

  async deleteWinner(id: number): Promise<void> {
    const data = await fetch(`${this.patch}winners/${id}`);
    return data.json();
  }
}

export const winnerService = new WinnerService();
