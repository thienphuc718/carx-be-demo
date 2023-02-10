import { PromotionModel } from '../../../../models';

export interface IPromotionRepository {
  findAll(): Promise<PromotionModel[]>;
  findAllByCondition(limit: number, offset: number, condition: any): Promise<PromotionModel[]>;
  findOneByCondition(condition: any): Promise<PromotionModel>;
  findAllByConditionWithoutPagination(condition: any): Promise<PromotionModel[]>;
  countByCondition(condition: any): Promise<number>;
  findById(id: string): Promise<PromotionModel>;
  create(payload: any): Promise<PromotionModel>;
  update(id: string, payload: any): Promise<any>;
  delete(id: string): void;
}

export const IPromotionRepository = Symbol('IPromotionRepository');
