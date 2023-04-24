import { InjectModel } from '@nestjs/sequelize';
import { ProductModel } from '../../../models';
import { DealModel } from '../../../models/Deals';
import { IDealRepository } from './DealRepositoryInterface';
import { getTextSearchString } from "../../../helpers/stringHelper";
import { Op } from "sequelize";
import { Sequelize } from "sequelize-typescript";

export class DealRepositoryImplementation implements IDealRepository {
  constructor(
    @InjectModel(DealModel) private dealModel: typeof DealModel,
    private sequelize: Sequelize
  ) { }
  findOneByCondition(condition: any): Promise<DealModel> {
    return this.dealModel.findOne({
      where: {
        ...condition,
        is_deleted: false,
      },
    });
  }

  findAllByCondition(
    limit: number,
    offset: number,
    condition?: any,
  ): Promise<DealModel[]> {
    let tsVectorSearchString = null;
    if (condition.title) {
      tsVectorSearchString = getTextSearchString(condition.title);
      condition.tsv_converted_title = {
        [Op.match]: this.sequelize.fn('to_tsquery', tsVectorSearchString)
      };
      delete condition.title;
    }
    return this.dealModel.findAll({
      limit: limit,
      offset: offset,
      where: {
        ...condition,
        is_deleted: false,
      },
      benchmark: true,
      include: [
        {
          model: ProductModel,
          as: 'product',
          required: false,
          attributes: ['name', 'type']
        }
      ],
      order: [
        tsVectorSearchString ?
          this.sequelize.literal(`ts_rank(deals.tsv_converted_title, to_tsquery('${tsVectorSearchString}')) desc`)
          :
          ['updated_at', 'desc']
      ],
    });
  }
  countByCondition(condition: any): Promise<number> {
    let tsVectorSearchString = null;
    if (condition.title) {
      tsVectorSearchString = getTextSearchString(condition.title);
      condition.tsv_converted_title = {
        [Op.match]: this.sequelize.fn('to_tsquery', `'${tsVectorSearchString}'`)
      };
      delete condition.title;
    }
    return this.dealModel.count({
      where: {
        ...condition,
        is_deleted: false,
      },
    });
  }
  findById(id: string): Promise<DealModel> {
    return this.dealModel.findByPk(id, {
      benchmark: true,
      include: [
        {
          model: ProductModel,
          as: 'product',
          required: false,
          attributes: ['name']
        }
      ],
    });
  }
  create(payload: any): Promise<DealModel> {
    return this.dealModel.create(payload);
  }
  update(id: string, payload: any): Promise<any> {
    return this.dealModel.update(payload, { where: { id: id } });
  }
  delete(id: string): void {
    this.dealModel.update({ is_deleted: true }, { where: { id: id } });
  }
}
