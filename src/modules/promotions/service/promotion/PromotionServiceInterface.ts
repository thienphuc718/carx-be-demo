import { PromotionModel } from '../../../../models';
import {
  PromotionPayloadDto,
  FilterPromotionDto,
} from '../../dto/PromotionDto';

export interface IPromotionService {
  getPromotionList(payload: FilterPromotionDto): Promise<[total: number, promotions: PromotionModel[]]>;
  getPromotionByCondition(condition: any): Promise<PromotionModel>;
  countPromotionByCondition(condition: any): Promise<number>;
  getPromotionDetail(id: string): Promise<PromotionModel>;
  createPromotion(payload: PromotionPayloadDto): Promise<PromotionModel>;
  updatePromotion(id: string, payload: PromotionPayloadDto): Promise<number>;
  deletePromotion(id: string): Promise<void>;
  deleteMultiPromotions(ids: string[]): Promise<void>;
  getPromotionListByConditionWithoutPagination(condition: any): Promise<PromotionModel[]>
}

export const IPromotionService = Symbol('IPromotionService');
