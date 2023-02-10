import { Inject } from '@nestjs/common';
import { PromotionConfigModel } from '../../../../models';
import {
  FilterPromotionConfigDto,
  CreatePromotionConfigDto,
  UpdatePromotionConfigDto,
} from '../../dto/PromotionConfigDto';

import { IPromotionConfigService } from './PromotionConfigServiceInterface';
import { v4 as uuidv4 } from 'uuid';
import { IPromotionConfigRepository } from '../../repository/promotion-config/PromotionConfigRepositoryInterface';

export class PromotionConfigServiceImplementation implements IPromotionConfigService {
  constructor(
    @Inject(IPromotionConfigRepository)
    private readonly promotionConfigRepository: IPromotionConfigRepository,
  ) {}

  async getPromotionConfigList(
    payload: FilterPromotionConfigDto,
  ): Promise<PromotionConfigModel[]> {
    const { limit, page } = payload;
    const postCategories = await this.promotionConfigRepository.findAllByCondition(
      limit,
      (page - 1) * limit,
      {},
    );
    return postCategories;
  }
  getPromotionConfigByCondition(condition: any): Promise<PromotionConfigModel> {
    return this.promotionConfigRepository.findOneByCondition(condition);
  }
  countPromotionConfigByCondition(condition: any): Promise<number> {
    return this.promotionConfigRepository.countByCondition(condition);
  }
  getPromotionConfigDetail(id: string): Promise<PromotionConfigModel> {
    return this.promotionConfigRepository.findById(id);
  }
  async createPromotionConfig(payload: CreatePromotionConfigDto): Promise<PromotionConfigModel> {
    const params: Record<string, any> = {
      id: uuidv4(),
      ...payload
    };
    const createdPromotionConfig = await this.promotionConfigRepository.create(params);
    return createdPromotionConfig;
  }
  async updatePromotionConfig(id: string, payload: UpdatePromotionConfigDto): Promise<number> {
    const updatedPromotionConfig = await this.promotionConfigRepository.update(
      id,
      payload,
    );
    return updatedPromotionConfig;
  }
  async deletePromotionConfig(id: string): Promise<void> {
    const promotionConfig = await this.getPromotionConfigDetail(id);
    if (!promotionConfig) {
      throw new Error('Post Category not found');
    }
    this.promotionConfigRepository.delete(id);
  }
}
