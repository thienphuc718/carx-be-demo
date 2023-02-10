import { Inject } from '@nestjs/common';
import { CoinCampaignModel } from '../../../../models';
import {
  FilterCoinCampaignDto,
  CreateCoinCampaignDto,
  UpdateCoinCampaignDto,
} from '../../dto/CoinCampaignDto';

import { ICoinCampaignService } from './CoinCampaignServiceInterface';
import { v4 as uuidv4 } from 'uuid';
import { ICoinCampaignRepository } from '../../repository/coin-campaign/CoinCampaignRepositoryInterface';

export class CoinCampaignServiceImplementation implements ICoinCampaignService {
  constructor(
    @Inject(ICoinCampaignRepository)
    private readonly coinCampaignRepository: ICoinCampaignRepository,
  ) {}

  async getCoinCampaignList(
    payload: FilterCoinCampaignDto,
  ): Promise<CoinCampaignModel[]> {
    const { limit, page } = payload;
    const postCategories = await this.coinCampaignRepository.findAllByCondition(
      limit,
      (page - 1) * limit,
      {},
    );
    return postCategories;
  }
  getCoinCampaignByCondition(condition: any): Promise<CoinCampaignModel> {
    return this.coinCampaignRepository.findOneByCondition(condition);
  }
  countCoinCampaignByCondition(condition: any): Promise<number> {
    return this.coinCampaignRepository.countByCondition(condition);
  }
  getCoinCampaignDetail(id: string): Promise<CoinCampaignModel> {
    return this.coinCampaignRepository.findById(id);
  }
  async createCoinCampaign(payload: CreateCoinCampaignDto): Promise<CoinCampaignModel> {
    const params: Record<string, any> = {
      id: uuidv4(),
      ...payload
    };
    const createdCoinCampaign = await this.coinCampaignRepository.create(params);
    return createdCoinCampaign;
  }
  async updateCoinCampaign(id: string, payload: UpdateCoinCampaignDto): Promise<number> {
    const updatedCoinCampaign = await this.coinCampaignRepository.update(
      id,
      payload,
    );
    return updatedCoinCampaign;
  }
  async deleteCoinCampaign(id: string): Promise<void> {
    const coinCampaign = await this.getCoinCampaignDetail(id);
    if (!coinCampaign) {
      throw new Error('Post Category not found');
    }
    this.coinCampaignRepository.delete(id);
  }
}
