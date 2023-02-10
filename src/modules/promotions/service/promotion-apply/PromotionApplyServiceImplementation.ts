import { Inject } from '@nestjs/common';
import { PromotionApplyModel } from '../../../../models';
import {
  FilterPromotionApplyDto,
  CreatePromotionApplyDto,
  UpdatePromotionApplyDto,
} from '../../dto/PromotionApplyDto';

import { IPromotionApplyService } from './PromotionApplyServiceInterface';
import { v4 as uuidv4 } from 'uuid';
import { IPromotionApplyRepository } from '../../repository/promotion-apply/PromotionApplyRepositoryInterface';

export class PromotionApplyServiceImplementation implements IPromotionApplyService {
  constructor(
    @Inject(IPromotionApplyRepository)
    private readonly promotionApplyRepository: IPromotionApplyRepository,
  ) {}

  async getPromotionApplyList(
    payload: FilterPromotionApplyDto,
  ): Promise<PromotionApplyModel[]> {
    const { limit, page } = payload;
    const postCategories = await this.promotionApplyRepository.findAllByCondition(
      limit,
      (page - 1) * limit,
      {},
    );
    return postCategories;
  }
  getPromotionApplyByCondition(condition: any): Promise<PromotionApplyModel> {
    return this.promotionApplyRepository.findOneByCondition(condition);
  }
  countPromotionApplyByCondition(condition: any): Promise<number> {
    return this.promotionApplyRepository.countByCondition(condition);
  }
  getPromotionApplyDetail(id: string): Promise<PromotionApplyModel> {
    return this.promotionApplyRepository.findById(id);
  }
  async createPromotionApply(payload: CreatePromotionApplyDto): Promise<PromotionApplyModel> {
    const params: Record<string, any> = {
      id: uuidv4(),
      ...payload
    };
    const createdPromotionApply = await this.promotionApplyRepository.create(params);
    return createdPromotionApply;
  }
  async updatePromotionApply(id: string, payload: UpdatePromotionApplyDto): Promise<number> {
    const updatedPromotionApply = await this.promotionApplyRepository.update(
      id,
      payload,
    );
    return updatedPromotionApply;
  }
  async deletePromotionApply(id: string): Promise<void> {
    const promotionApply = await this.getPromotionApplyDetail(id);
    if (!promotionApply) {
      throw new Error('Post Category not found');
    }
    this.promotionApplyRepository.delete(id);
  }
}
