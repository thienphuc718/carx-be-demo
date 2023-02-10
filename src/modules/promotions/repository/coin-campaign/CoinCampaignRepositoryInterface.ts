import { CoinCampaignModel } from '../../../../models/CoinCampaigns';

export interface ICoinCampaignRepository {
  findAll(): Promise<CoinCampaignModel[]>;
  findAllByCondition(
    limit: number,
    offset: number,
    condition: any,
  ): Promise<CoinCampaignModel[]>;
  findOneByCondition(condition: any): Promise<CoinCampaignModel>;
  countByCondition(condition: any): Promise<number>;
  findById(id: string): Promise<CoinCampaignModel>;
  create(payload: any): Promise<CoinCampaignModel>;
  update(id: string, payload: any): Promise<any>;
  delete(id: string): void;
}

export const ICoinCampaignRepository = Symbol('ICoinCampaignRepository');
