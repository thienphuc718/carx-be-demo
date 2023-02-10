import { ICustomerCategoryRelationsRepository } from './CustomerCategoryRelationsRepositoryInterface';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CustomerCategoryRelationsModel } from '../../../../models/CustomerCategoryRelations';

@Injectable()
export class CustomerCategoryRelationsRepositoryImplementation
  implements ICustomerCategoryRelationsRepository
{
  constructor(
    @InjectModel(CustomerCategoryRelationsModel)
    private customerCategoryRelationsModel: typeof CustomerCategoryRelationsModel,
  ) {}

  create(payload: any): Promise<CustomerCategoryRelationsModel> {
    return this.customerCategoryRelationsModel.create(payload);
  }

  bulkCreate(payload: Array<any>): Promise<CustomerCategoryRelationsModel[]> {
    return this.customerCategoryRelationsModel.bulkCreate(payload);
  }

  bulkUpdate(
    condition: Array<string | number>,
    payload: any,
  ): Promise<[nRowsModified: number]> {
    return this.customerCategoryRelationsModel.update(payload, {
      where: {
        ...condition,
      },
    });
  }
}
