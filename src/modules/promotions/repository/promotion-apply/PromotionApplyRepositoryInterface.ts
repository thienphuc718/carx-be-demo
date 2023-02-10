import { PromotionApplyModel } from '../../../../models';

export interface IPromotionApplyRepository {
  findAll(): Promise<PromotionApplyModel[]>;
  findAllByCondition(limit: number, offset: number, condition: any): Promise<PromotionApplyModel[]>;
  findOneByCondition(condition: any): Promise<PromotionApplyModel>;
  countByCondition(condition: any): Promise<number>;
  findById(id: string): Promise<PromotionApplyModel>;
  create(payload: any): Promise<PromotionApplyModel>;
  update(id: string, payload: any): Promise<any>;
  delete(id: string): void;
}

export const IPromotionApplyRepository = Symbol('IPromotionApplyRepository');
