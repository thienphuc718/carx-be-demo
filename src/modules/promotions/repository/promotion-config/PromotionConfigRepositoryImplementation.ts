import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PromotionConfigModel } from '../../../../models';
import { IPromotionConfigRepository } from './PromotionConfigRepositoryInterface';

@Injectable()
export class PromotionConfigRepositoryImplementation implements IPromotionConfigRepository {
  constructor(
    @InjectModel(PromotionConfigModel) private promotionConfigModel: typeof PromotionConfigModel,
  ) {}
  findAll(): Promise<PromotionConfigModel[]> {
    return this.promotionConfigModel.findAll({
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
  ): Promise<PromotionConfigModel[]> {
    return this.promotionConfigModel.findAll({
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
  ): Promise<PromotionConfigModel> {
    return this.promotionConfigModel.findOne({
      where: {
        ...condition,
        is_deleted: false,
      },
    });
  }
  countByCondition(condition: any, ): Promise<number> {
    return this.promotionConfigModel.count({
      where: {
        ...condition,
        is_deleted: false,
      },
    });
  }
  findById(id: string, ): Promise<PromotionConfigModel> {
    return this.promotionConfigModel.findOne({
      where: {
        id: id,
      },
    });
  }
  create(payload: any, ): Promise<PromotionConfigModel> {
    return this.promotionConfigModel.create(payload);
  }
  update(id: string, payload: any, ): Promise<any> {
    return this.promotionConfigModel.update(payload, {
      where: {
        id: id,
      },
    });
  }
  delete(id: string, ): void {
    this.promotionConfigModel.update({ is_deleted: false }, { where: { id: id } });
  }
}
