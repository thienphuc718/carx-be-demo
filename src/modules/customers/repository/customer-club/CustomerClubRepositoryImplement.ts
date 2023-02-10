import { ICustomerClubRepository } from './CustomerClubRepositoryInterface';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CustomerClubModel } from '../../../../models/CustomerClubs';

@Injectable()
export class CustomerClubRepositoryImplementation implements ICustomerClubRepository {
  constructor(@InjectModel(CustomerClubModel) private cityModel: typeof CustomerClubModel) {}

  findAllByCondition(
    limit: number,
    offset: number,
    condition: any,
  ): Promise<CustomerClubModel[]> {
    return this.cityModel.findAll({
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
      return this.cityModel.count({
        where: {
          ...condition,
          is_deleted: false,
        },
      });
    }
  }

  findById(id: string): Promise<CustomerClubModel> {
    return this.cityModel.findOne({
      where: {
        id: id,
      },
    });
  }

  create(payload: any, schema: string): Promise<CustomerClubModel> {
    return this.cityModel.create(payload);
  }

  update(id: string, payload: any): Promise<any> {
    return this.cityModel.update(payload, {
      where: {
        id: id,
      },
    });
  }

  delete(id: string): void {
    this.cityModel.update(
      { is_deleted: true },
      {
        where: {
          id: id,
        },
      },
    );
  }
}
