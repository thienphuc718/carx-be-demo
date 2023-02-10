import { Inject } from '@nestjs/common';
import { GiftModel } from '../../../../models';
import {
  FilterGiftDto,
  CreateGiftDto,
  UpdateGiftDto,
} from '../../dto/GiftDto';

import { IGiftService } from './GiftServiceInterface';
import { v4 as uuidv4 } from 'uuid';
import { IGiftRepository } from '../../repository/gift/GiftRepositoryInterface';

export class GiftServiceImplementation implements IGiftService {
  constructor(
    @Inject(IGiftRepository)
    private readonly giftRepository: IGiftRepository,
  ) {}

  async getGiftList(
    payload: FilterGiftDto,
  ): Promise<GiftModel[]> {
    const { limit, page } = payload;
    const postCategories = await this.giftRepository.findAllByCondition(
      limit,
      (page - 1) * limit,
      {},
    );
    return postCategories;
  }
  getGiftByCondition(condition: any): Promise<GiftModel> {
    return this.giftRepository.findOneByCondition(condition);
  }
  countGiftByCondition(condition: any): Promise<number> {
    return this.giftRepository.countByCondition(condition);
  }
  getGiftDetail(id: string): Promise<GiftModel> {
    return this.giftRepository.findById(id);
  }
  async createGift(payload: CreateGiftDto): Promise<GiftModel> {
    const params: Record<string, any> = {
      id: uuidv4(),
      ...payload
    };
    const createdGift = await this.giftRepository.create(params);
    return createdGift;
  }
  async updateGift(id: string, payload: UpdateGiftDto): Promise<number> {
    const updatedGift = await this.giftRepository.update(
      id,
      payload,
    );
    return updatedGift;
  }
  async deleteGift(id: string): Promise<void> {
    const gift = await this.getGiftDetail(id);
    if (!gift) {
      throw new Error('Post Category not found');
    }
    this.giftRepository.delete(id);
  }
}
