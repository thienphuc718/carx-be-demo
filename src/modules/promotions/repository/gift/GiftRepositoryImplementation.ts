import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { GiftModel } from '../../../../models';
import { IGiftRepository } from './GiftRepositoryInterface';

@Injectable()
export class GiftRepositoryImplementation implements IGiftRepository {
  constructor(
    @InjectModel(GiftModel) private giftModel: typeof GiftModel,
  ) {}
  findAll(): Promise<GiftModel[]> {
    return this.giftModel.findAll({
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
  ): Promise<GiftModel[]> {
    return this.giftModel.findAll({
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
  ): Promise<GiftModel> {
    return this.giftModel.findOne({
      where: {
        ...condition,
        is_deleted: false,
      },
    });
  }
  countByCondition(condition: any, ): Promise<number> {
    return this.giftModel.count({
      where: {
        ...condition,
        is_deleted: false,
      },
    });
  }
  findById(id: string, ): Promise<GiftModel> {
    return this.giftModel.findOne({
      where: {
        id: id,
      },
    });
  }
  create(payload: any, ): Promise<GiftModel> {
    return this.giftModel.create(payload);
  }
  update(id: string, payload: any, ): Promise<any> {
    return this.giftModel.update(payload, {
      where: {
        id: id,
      },
    });
  }
  delete(id: string, ): void {
    this.giftModel.update({ is_deleted: false }, { where: { id: id } });
  }
}
