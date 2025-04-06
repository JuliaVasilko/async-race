import { carStatus, finishStatus } from '@/models/race.model';

export class RaceService {
  private readonly patch = 'http://127.0.0.1:3000/';

  private async updateCarStatus(id: number, status: 'started' | 'stopped' | 'drive'): Promise<carStatus & finishStatus> {
    const data = await fetch(`${this.patch}engine?id=${id}&status=${status}`, {
      method: 'PATCH',
    });
    return await data.json();
  }

  async startEngine(id: number): Promise<carStatus> {
    return this.updateCarStatus(id, 'started');
  }

  async stopEngine(id: number): Promise<carStatus> {
    return this.updateCarStatus(id, 'stopped');
  }

  async startDrive(id: number): Promise<finishStatus> {
    return this.updateCarStatus(id, 'drive');
  }
}

export const raceService = new RaceService();

