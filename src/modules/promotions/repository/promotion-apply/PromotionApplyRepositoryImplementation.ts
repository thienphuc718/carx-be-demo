import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PromotionApplyModel } from '../../../../models';
import { IPromotionApplyRepository } from './PromotionApplyRepositoryInterface';

@Injectable()
export class PromotionApplyRepositoryImplementation implements IPromotionApplyRepository {
  constructor(
    @InjectModel(PromotionApplyModel) private promotionApplyModel: typeof PromotionApplyModel,
  ) {}
  findAll(): Promise<PromotionApplyModel[]> {
    return this.promotionApplyModel.findAll({
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
  ): Promise<PromotionApplyModel[]> {
    return this.promotionApplyModel.findAll({
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
  ): Promise<PromotionApplyModel> {
    return this.promotionApplyModel.findOne({
      where: {
        ...condition,
        is_deleted: false,
      },
    });
  }
  countByCondition(condition: any, ): Promise<number> {
    return this.promotionApplyModel.count({
      where: {
        ...condition,
        is_deleted: false,
      },
    });
  }
  findById(id: string, ): Promise<PromotionApplyModel> {
    return this.promotionApplyModel.findOne({
      where: {
        id: id,
      },
    });
  }
  create(payload: any, ): Promise<PromotionApplyModel> {
    return this.promotionApplyModel.create(payload);
  }
  update(id: string, payload: any, ): Promise<any> {
    return this.promotionApplyModel.update(payload, {
      where: {
        id: id,
      },
    });
  }
  delete(id: string, ): void {
    this.promotionApplyModel.update({ is_deleted: false }, { where: { id: id } });
  }
}
