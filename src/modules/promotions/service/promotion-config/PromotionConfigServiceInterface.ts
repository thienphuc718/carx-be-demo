import { PromotionConfigModel } from '../../../../models';
import { CreatePromotionConfigDto, FilterPromotionConfigDto, UpdatePromotionConfigDto } from "../../dto/PromotionConfigDto";

export interface IPromotionConfigService {
    getPromotionConfigList(payload: FilterPromotionConfigDto): Promise<PromotionConfigModel[]>
    getPromotionConfigByCondition(condition: any): Promise<PromotionConfigModel>
    countPromotionConfigByCondition(condition: any): Promise<number>
    getPromotionConfigDetail(id: string): Promise<PromotionConfigModel>
    createPromotionConfig(payload: CreatePromotionConfigDto): Promise<PromotionConfigModel>
    updatePromotionConfig(id: string, payload: UpdatePromotionConfigDto): Promise<number>
    deletePromotionConfig(id: string): Promise<void>
}

export const IPromotionConfigService = Symbol('IPromotionConfigService');
