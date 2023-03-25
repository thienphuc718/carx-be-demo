import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  CustomerAgentRelationsModel,
  CustomerModel,
  OrderModel,
} from '../../../../models';
import { ICustomerAgentRelationRepository } from './CustomerAgentRelationRepositoryInterface';

@Injectable()
export class CustomerAgentRelationRepositoryImplementation
  implements ICustomerAgentRelationRepository
{
  constructor(
    @InjectModel(CustomerAgentRelationsModel)
    private customerAgentRelationModel: typeof CustomerAgentRelationsModel,
  ) {}

  findAllByConditionWithPagination(
    limit: number,
    offset: number,
    condition: any,
  ): Promise<CustomerAgentRelationsModel[]> {
    const { customerCondition, is_verified, ...rest } = condition;
    return this.customerAgentRelationModel.findAll({
      limit: limit,
      offset: offset,
      where: {
        ...rest,
        is_deleted: false,
      },
      include: [
        {
          model: CustomerModel,
          as: 'customer',
          // required: false,
          where: {
            ...customerCondition,
            is_deleted: false,
          },
          include: [
            {
              model: OrderModel,
              as: 'orders',
              // required: false,
              where: {
                is_deleted: false,
              },
              order: [['created_at', 'desc']],
            },
          ],
        },
      ],
      order: [['created_at', 'desc']],
    });
  }

  create(payload: any): Promise<CustomerAgentRelationsModel> {
    return this.customerAgentRelationModel.create(payload);
  }
  bulkCreate(payload: any[]): Promise<CustomerAgentRelationsModel[]> {
    return this.customerAgentRelationModel.bulkCreate(payload);
  }
  countByCondition(condition: any): Promise<number> {
    return this.customerAgentRelationModel.count({
      where: {
        ...condition,
        is_deleted: false,
      },
    });
  }

  findAllByConditionWithoutPagination(condition: any): Promise<CustomerAgentRelationsModel[]> {
    return this.customerAgentRelationModel.findAll({
      where: {
        ...condition,
        is_deleted: false,
      },
    })
  }
}
