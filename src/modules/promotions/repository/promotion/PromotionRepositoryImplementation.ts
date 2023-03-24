import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { PromotionModel } from '../../../../models';
import { IPromotionRepository } from './PromotionRepositoryInterface';
import { getTextSearchString } from "../../../../helpers/stringHelper";
import { Sequelize } from "sequelize-typescript";

@Injectable()
export class PromotionRepositoryImplementation implements IPromotionRepository {
  constructor(
    @InjectModel(PromotionModel) private promotionModel: typeof PromotionModel,
    private sequelize: Sequelize
  ) {}
  findAll(): Promise<PromotionModel[]> {
    return this.promotionModel.findAll({
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
  ): Promise<PromotionModel[]> {
    let tsVectorSearchString = null;
    if (condition.name) {
      tsVectorSearchString = getTextSearchString(condition.name);
      condition.tsv_converted_name = {
        [Op.match]: this.sequelize.fn('to_tsquery', tsVectorSearchString)
      };
      delete condition.name;
    }
    return this.promotionModel.findAll({
      limit: limit,
      offset: offset,
      where: condition,
      order: [tsVectorSearchString ?
        this.sequelize.literal(`ts_rank(promotions.tsv_converted_name, to_tsquery('${tsVectorSearchString}')) desc`)
          :
        ['created_at', 'desc']],
    });
  }
  findOneByCondition(condition: any): Promise<PromotionModel> {
    return this.promotionModel.findOne({
      where: {
        ...condition,
        is_deleted: false,
      },
    });
  }
  countByCondition(condition: any): Promise<number> {
    let tsVectorSearchString = null;
    if (condition.name) {
      tsVectorSearchString = getTextSearchString(condition.name);
      condition.tsv_converted_name = {
        [Op.match]: this.sequelize.fn('to_tsquery', `'${tsVectorSearchString}'`)
      };
      delete condition.name;
    }
    return this.promotionModel.count({
      where: condition,
    });
  }
  findById(id: string): Promise<PromotionModel> {
    return this.promotionModel.findOne({
      where: {
        id: id,
        is_deleted: false,
      },
    });
  }
  create(payload: any): Promise<PromotionModel> {
    return this.promotionModel.create(payload);
  }
  update(id: string, payload: any): Promise<any> {
    return this.promotionModel.update(payload, {
      where: {
        id: id,
      },
    });
  }
  delete(id: string): void {
    this.promotionModel.update({ is_deleted: true }, { where: { id: id } });
  }

  findAllByConditionWithoutPagination(
    condition: any,
  ): Promise<PromotionModel[]> {
    return this.promotionModel.findAll({
      where: {
        ...condition,
        is_deleted: false,
      },
      order: [['created_at', 'desc']],
    });
  }
}
