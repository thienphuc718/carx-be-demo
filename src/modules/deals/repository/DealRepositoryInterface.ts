import { DealModel } from '../../../models/Deals';

export interface IDealRepository {
  findAllByCondition(
    limit: number,
    offset: number,
    condition?: any,
  ): Promise<DealModel[]>;
  countByCondition(condition: any): Promise<number>;
  findById(id: string): Promise<DealModel>;
  findOneByCondition(condition: any): Promise<DealModel>;
  create(payload: any): Promise<DealModel>;
  update(id: string, payload: any): Promise<[number, DealModel[]]>;
  delete(id: string): void;
}

export const IDealRepository = Symbol('IDealRepository');
