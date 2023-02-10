import { ICustomerCategoryRepository } from './CustomerCategoryRepositoryInterface';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CustomerCategoryModel } from '../../../../models/CustomerCategories';

@Injectable()
export class CustomerCategoryRepositoryImplementation
  implements ICustomerCategoryRepository
{
  constructor(
    @InjectModel(CustomerCategoryModel)
    private customerCategoryModel: typeof CustomerCategoryModel,
  ) {}

  findAllByCondition(
    limit: number,
    offset: number,
    condition: any,
  ): Promise<CustomerCategoryModel[]> {
    return this.customerCategoryModel.findAll({
      limit: limit,
      offset: offset,
      where: {
        ...condition,
        is_deleted: false,
      },
      order: [['created_at', 'desc']],
    });
  }

  countByCondition(condition: any, schema: string): Promise<number> {
    if (schema) {
      return this.customerCategoryModel.count({
        where: {
          ...condition,
          is_deleted: false,
        },
      });
    }
  }

  findById(id: string): Promise<CustomerCategoryModel> {
    return this.customerCategoryModel.findOne({
      where: {
        id: id,
      },
    });
  }

  create(payload: any, schema: string): Promise<CustomerCategoryModel> {
    return this.customerCategoryModel.create(payload);
  }

  update(id: string, payload: any): Promise<any> {
    return this.customerCategoryModel.update(payload, {
      where: {
        id: id,
      },
    });
  }

  delete(id: string): void {
    this.customerCategoryModel.update(
      { is_deleted: true },
      {
        where: {
          id: id,
        },
      },
    );
  }
}
