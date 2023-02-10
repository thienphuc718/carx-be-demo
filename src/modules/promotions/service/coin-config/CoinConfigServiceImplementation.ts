import { Inject } from '@nestjs/common';
import { CoinConfigModel } from '../../../../models';
import {
  FilterCoinConfigDto,
  CreateCoinConfigDto,
  UpdateCoinConfigDto,
} from '../../dto/CoinConfigDto';

import { ICoinConfigService } from './CoinConfigServiceInterface';
import { v4 as uuidv4 } from 'uuid';
import { ICoinConfigRepository } from '../../repository/coin-config/CoinConfigRepositoryInterface';

export class CoinConfigServiceImplementation implements ICoinConfigService {
  constructor(
    @Inject(ICoinConfigRepository)
    private readonly coinConfigRepository: ICoinConfigRepository,
  ) {}

  async getCoinConfigList(
    payload: FilterCoinConfigDto,
  ): Promise<CoinConfigModel[]> {
    const { limit, page } = payload;
    const postCategories = await this.coinConfigRepository.findAllByCondition(
      limit,
      (page - 1) * limit,
      {},
    );
    return postCategories;
  }
  getCoinConfigByCondition(condition: any): Promise<CoinConfigModel> {
    return this.coinConfigRepository.findOneByCondition(condition);
  }
  countCoinConfigByCondition(condition: any): Promise<number> {
    return this.coinConfigRepository.countByCondition(condition);
  }
  getCoinConfigDetail(id: string): Promise<CoinConfigModel> {
    return this.coinConfigRepository.findById(id);
  }
  async createCoinConfig(payload: CreateCoinConfigDto): Promise<CoinConfigModel> {
    const params: Record<string, any> = {
      id: uuidv4(),
      ...payload
    };
    const createdCoinConfig = await this.coinConfigRepository.create(params);
    return createdCoinConfig;
  }
  async updateCoinConfig(id: string, payload: UpdateCoinConfigDto): Promise<number> {
    const updatedCoinConfig = await this.coinConfigRepository.update(
      id,
      payload,
    );
    return updatedCoinConfig;
  }
  async deleteCoinConfig(id: string): Promise<void> {
    const coinConfig = await this.getCoinConfigDetail(id);
    if (!coinConfig) {
      throw new Error('Post Category not found');
    }
    this.coinConfigRepository.delete(id);
  }
}
