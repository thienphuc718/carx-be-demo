import { InjectModel } from '@nestjs/sequelize';
import {
  CustomerModel,
  FlashBuyResponseModel,
  FlashBuyRequestModel,
} from '../../../../models';
import { IFlashBuyRequestRepository } from './FlashBuyRequestRepositoryInterface';
import { getTextSearchString } from "../../../../helpers/stringHelper";
import { Sequelize } from "sequelize-typescript";
import { Op } from "sequelize";

export class FlashBuyRequestRepositoryImplementation
  implements IFlashBuyRequestRepository
{
  constructor(
    @InjectModel(FlashBuyRequestModel)
    private flashBuyRequestModel: typeof FlashBuyRequestModel,
    private sequelize: Sequelize,
  ) {}
  findAllWithCondition(
    limit: number,
    offset: number,
    condition: any,
  ): Promise<FlashBuyRequestModel[]> {
    let tsVectorSearchString =  null;
    if (condition.product_name) {
      tsVectorSearchString = getTextSearchString(condition.product_name);
      condition.tsv_converted_product_name = {
        [Op.match]: this.sequelize.fn('to_tsquery', tsVectorSearchString)
      };
      delete condition.product_name;
    }
    return this.flashBuyRequestModel.findAll({
      limit: limit,
      offset: offset,
      where: {
        ...condition,
        is_deleted: false,
      },
      include: [
        {
          model: FlashBuyResponseModel,
          as: 'responses',
          attributes: {
            exclude: ['flash_buy_request_id'],
          },
        },
        {
          model: CustomerModel,
          as: 'customer',
          attributes: {
            exclude: [
              'customer_class_id',
              'customer_club_id',
              'tags',
              'created_at',
              'updated_at',
            ],
          },
        },
      ],
      order: [
        tsVectorSearchString ?
          this.sequelize.literal(`ts_rank(flash_buy_requests.tsv_converted_product_name, to_tsquery('${tsVectorSearchString}')) desc`)
            :
          ['created_at', 'desc']],
    });
  }
  findById(id: string): Promise<FlashBuyRequestModel> {
    return this.flashBuyRequestModel.findByPk(id, {
      include: [
        {
          model: FlashBuyResponseModel,
          as: 'responses',
          attributes: ['product_id', 'agent_id', 'created_at', 'updated_at', 'status'],
        },
        {
          model: CustomerModel,
          as: 'customer',
          attributes: {
            exclude: [
              'customer_class_id',
              'customer_club_id',
              'tags',
              'created_at',
              'updated_at',
            ],
          },
        },
      ],
    });
  }
  findOneByCondition(condition: any): Promise<FlashBuyRequestModel> {
    return this.flashBuyRequestModel.findOne(condition);
  }
  create(payload: any): Promise<FlashBuyRequestModel> {
    return this.flashBuyRequestModel.create(payload);
  }
  update(id: string, payload: any): Promise<[number, FlashBuyRequestModel[]]> {
    return this.flashBuyRequestModel.update(payload, {
      where: {
        id: id,
      },
      returning: true,
    });
  }
  delete(id: string): void {
    this.flashBuyRequestModel.update(
      { is_deleted: true },
      {
        where: {
          id: id,
        },
      },
    );
  }
  countByCondition(condition: any): Promise<number> {
    let tsVectorSearchString = null;
    if (condition.product_name) {
      tsVectorSearchString = getTextSearchString(condition.product_name);
      condition.tsv_converted_product_name = {
        [Op.match]: this.sequelize.fn('to_tsquery', tsVectorSearchString)
      };
      delete condition.product_name;
    }
    return this.flashBuyRequestModel.count({
      where: { ...condition, is_deleted: false },
    });
  }
}
