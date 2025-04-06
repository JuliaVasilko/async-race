import { BaseCar, Car, getCarsResponse } from '@/models/garage.model';

export class GarageService {
  private readonly patch = 'http://127.0.0.1:3000/';

  async getCars(page: number = 1): Promise<getCarsResponse> {
    const data = await fetch(`${this.patch}garage?_page=${page}&_limit=7`);
    const totalHeader = data.headers.get('X-Total-Count') ?? '0';
    const cars: Car[] = await data.json();
    return {
      cars,
      total: Number(totalHeader),
    };
  }

  async getCar(id: number): Promise<Car> {
    const data = await fetch(`${this.patch}garage/${id}`);
    return data.json();
  }

  async createCar(car: BaseCar): Promise<Car> {
    const data = await fetch(`${this.patch}garage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify(car),
    });
    return data.json();
  }

  async deleteCar(id: number): Promise<void> {
    await fetch(`${this.patch}garage/${id}`, { method: 'DELETE' });
  }

  async updateCar(id: number, car: BaseCar): Promise<Car> {
    const data = await fetch(`${this.patch}garage/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify(car),
    });
    return data.json();
  }

  async createCars(cars: BaseCar[]): Promise<void> {
    await Promise.all(cars.map(car => this.createCar(car)));
  }
}

export const garageService = new GarageService();
