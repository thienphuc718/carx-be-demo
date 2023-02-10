import { PromotionApplyModel } from '../../../../models';
import { CreatePromotionApplyDto, FilterPromotionApplyDto, UpdatePromotionApplyDto } from "../../dto/PromotionApplyDto";

export interface IPromotionApplyService {
    getPromotionApplyList(payload: FilterPromotionApplyDto): Promise<PromotionApplyModel[]>
    getPromotionApplyByCondition(condition: any): Promise<PromotionApplyModel>
    countPromotionApplyByCondition(condition: any): Promise<number>
    getPromotionApplyDetail(id: string): Promise<PromotionApplyModel>
    createPromotionApply(payload: CreatePromotionApplyDto): Promise<PromotionApplyModel>
    updatePromotionApply(id: string, payload: UpdatePromotionApplyDto): Promise<number>
    deletePromotionApply(id: string): Promise<void>
}

export const IPromotionApplyService = Symbol('IPromotionApplyService');
