import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CoinConfigModel } from '../../../../models';
import { ICoinConfigRepository } from './CoinConfigRepositoryInterface';

@Injectable()
export class CoinConfigRepositoryImplementation implements ICoinConfigRepository {
  constructor(
    @InjectModel(CoinConfigModel) private coinConfigModel: typeof CoinConfigModel,
  ) {}
  findAll(): Promise<CoinConfigModel[]> {
    return this.coinConfigModel.findAll({
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
  ): Promise<CoinConfigModel[]> {
    return this.coinConfigModel.findAll({
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
  ): Promise<CoinConfigModel> {
    return this.coinConfigModel.findOne({
      where: {
        ...condition,
        is_deleted: false,
      },
    });
  }
  countByCondition(condition: any, ): Promise<number> {
    return this.coinConfigModel.count({
      where: {
        ...condition,
        is_deleted: false,
      },
    });
  }
  findById(id: string, ): Promise<CoinConfigModel> {
    return this.coinConfigModel.findOne({
      where: {
        id: id,
      },
    });
  }
  create(payload: any, ): Promise<CoinConfigModel> {
    return this.coinConfigModel.create(payload);
  }
  update(id: string, payload: any, ): Promise<any> {
    return this.coinConfigModel.update(payload, {
      where: {
        id: id,
      },
    });
  }
  delete(id: string, ): void {
    this.coinConfigModel.update({ is_deleted: false }, { where: { id: id } });
  }
}
