import { DealModel } from '../../../models/Deals';
import { CreateDealDto, FilterDealDto, UpdateDealDto } from '../dto/DealDto';

export interface IDealService {
  getDealListByCondition(payload: FilterDealDto): Promise<DealModel[]>;
  getDealDetail(id: string): Promise<DealModel>;
  getDealByCondition(condition: any): Promise<DealModel>;
  createDeal(payload: CreateDealDto): Promise<DealModel>;
  updateDeal(id: string, payload: UpdateDealDto): Promise<DealModel>;
  deleteDeal(id: string): void;
  countDealByCondition(condition: any): Promise<number>;
}

export const IDealService = Symbol('IDealService');
