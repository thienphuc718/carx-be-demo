import { ICustomerClassRepository } from './CustomerClassRepositoryInterface';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CustomerClassModel } from '../../../../models/CustomerClasses';

@Injectable()
export class CustomerClassRepositoryImplementation implements ICustomerClassRepository {
  constructor(@InjectModel(CustomerClassModel) private customerClassModel: typeof CustomerClassModel) {}

  findAllByCondition(
    limit: number,
    offset: number,
    condition: any,
  ): Promise<CustomerClassModel[]> {
    return this.customerClassModel.findAll({
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
      return this.customerClassModel.count({
        where: {
          ...condition,
          is_deleted: false,
        },
      });
    }
  }

  findById(id: string): Promise<CustomerClassModel> {
    return this.customerClassModel.findOne({
      where: {
        id: id,
      },
    });
  }

  create(payload: any, schema: string): Promise<CustomerClassModel> {
    return this.customerClassModel.create(payload);
  }

  update(id: string, payload: any): Promise<any> {
    return this.customerClassModel.update(payload, {
      where: {
        id: id,
      },
    });
  }

  delete(id: string): void {
    this.customerClassModel.update(
      { is_deleted: true },
      {
        where: {
          id: id,
        },
      },
    );
  }
}
