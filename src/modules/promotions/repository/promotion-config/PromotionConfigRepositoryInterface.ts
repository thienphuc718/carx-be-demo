import { PromotionConfigModel } from '../../../../models';

export interface IPromotionConfigRepository {
  findAll(): Promise<PromotionConfigModel[]>;
  findAllByCondition(limit: number, offset: number, condition: any): Promise<PromotionConfigModel[]>;
  findOneByCondition(condition: any): Promise<PromotionConfigModel>;
  countByCondition(condition: any): Promise<number>;
  findById(id: string): Promise<PromotionConfigModel>;
  create(payload: any): Promise<PromotionConfigModel>;
  update(id: string, payload: any): Promise<any>;
  delete(id: string): void;
}

export const IPromotionConfigRepository = Symbol('IPromotionConfigRepository');
