import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CompanyModel } from '../../../models/Companies';
import { ICompanyRepository } from './CompanyRepositoryInterface';

@Injectable()
export class CompanyRepositoryImplementation implements ICompanyRepository {
  constructor(
    @InjectModel(CompanyModel) private companyModel: typeof CompanyModel,
  ) {}

  findAll(): Promise<CompanyModel[]> {
    return this.companyModel.findAll({
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
  ): Promise<CompanyModel[]> {
    return this.companyModel.findAll({
      limit: limit,
      offset: offset,
      where: {
        ...condition,
        is_deleted: false,
      },
      order: [['created_at', 'desc']],
    });
  }

  findById(id: string): Promise<CompanyModel> {
    return this.companyModel.findOne({
      where: {
        id: id,
      },
    });
  }

  create(payload: any): Promise<CompanyModel> {
    return this.companyModel.create(payload);
  }

  update(id: string, payload: any): Promise<[number, CompanyModel[]]> {
    return this.companyModel.update(payload, {
      where: {
        id: id,
      },
      returning: true,
    });
  }

  delete(id: string): void {
    this.companyModel.update(
      { is_deleted: true },
      {
        where: {
          id: id,
        },
      },
    );
  }
}
