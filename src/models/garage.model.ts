export interface BaseCar {
  color: string;
  name: string;
}

export interface Car extends BaseCar {
  id: number;
}

export interface getCarsResponse {
  cars: Car[];
  total: number;
}
