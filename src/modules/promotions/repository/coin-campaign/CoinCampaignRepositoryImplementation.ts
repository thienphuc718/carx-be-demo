import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CoinCampaignModel } from '../../../../models';
import { ICoinCampaignRepository } from './CoinCampaignRepositoryInterface';

@Injectable()
export class CoinCampaignRepositoryImplementation implements ICoinCampaignRepository {
  constructor(
    @InjectModel(CoinCampaignModel) private coinCampaignModel: typeof CoinCampaignModel,
  ) {}
  findAll(): Promise<CoinCampaignModel[]> {
    return this.coinCampaignModel.findAll({
      where: {
        is_deleted: false,
      },
      order: [['created_at', 'desc']],
    });
  }
  findAllByCondition(
    limit: number,
    offset: number,
    condition: any,    
  ): Promise<CoinCampaignModel[]> {
    return this.coinCampaignModel.findAll({
      limit: limit,
      offset: offset,
      where: {
        ...condition,
        is_deleted: false,
      },
      order: [['created_at', 'desc']],
    });
  }
  findOneByCondition(
    condition: any,
  ): Promise<CoinCampaignModel> {
    return this.coinCampaignModel.findOne({
      where: {
        ...condition,
        is_deleted: false,
      },
    });
  }
  countByCondition(condition: any, ): Promise<number> {
    return this.coinCampaignModel.count({
      where: {
        ...condition,
        is_deleted: false,
      },
    });
  }
  findById(id: string, ): Promise<CoinCampaignModel> {
    return this.coinCampaignModel.findOne({
      where: {
        id: id,
      },
    });
  }
  create(payload: any, ): Promise<CoinCampaignModel> {
    return this.coinCampaignModel.create(payload);
  }
  update(id: string, payload: any, ): Promise<any> {
    return this.coinCampaignModel.update(payload, {
      where: {
        id: id,
      },
    });
  }
  delete(id: string, ): void {
    this.coinCampaignModel.update({ is_deleted: false }, { where: { id: id } });
  }
}
