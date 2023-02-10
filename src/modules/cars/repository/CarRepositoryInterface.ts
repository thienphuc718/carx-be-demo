import { CarModel } from '../../../models/Cars';

export interface ICarRepository {
  findAll(): Promise<CarModel[]>;
  findAllByCondition(limit: number, page: number, condition: any): Promise<CarModel[]>;
  findById(id: string): Promise<CarModel>;
  create(payload: any): Promise<CarModel>;
  update(id: string, payload: any): Promise<number>;
  delete(id: string): void;
}

export const ICarRepository = Symbol('ICarRepository');
