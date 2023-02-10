import { CoinConfigModel } from '../../../../models';

export interface ICoinConfigRepository {
  findAll(): Promise<CoinConfigModel[]>;
  findAllByCondition(limit: number, offset: number, condition: any): Promise<CoinConfigModel[]>;
  findOneByCondition(condition: any): Promise<CoinConfigModel>;
  countByCondition(condition: any): Promise<number>;
  findById(id: string): Promise<CoinConfigModel>;
  create(payload: any): Promise<CoinConfigModel>;
  update(id: string, payload: any): Promise<any>;
  delete(id: string): void;
}

export const ICoinConfigRepository = Symbol('ICoinConfigRepository');
