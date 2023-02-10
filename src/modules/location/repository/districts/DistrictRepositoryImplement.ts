import { IDistrictRepository } from './DistrictRepositoryInterface';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { DistrictModel } from '../../../../models/Districts';

@Injectable()
export class DistrictRepositoryImplementation implements IDistrictRepository {
  constructor(
    @InjectModel(DistrictModel) private districtModel: typeof DistrictModel,
  ) {}

  findAllByCondition(
    limit: number,
    offset: number,
    condition: any,
  ): Promise<DistrictModel[]> {
    return this.districtModel.findAll({
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
      return this.districtModel.count({
        where: {
          ...condition,
          is_deleted: false,
        },
      });
    }
  }

  findById(id: string): Promise<DistrictModel> {
    return this.districtModel.findOne({
      where: {
        id: id,
      },
    });
  }

  create(payload: any, schema: string): Promise<DistrictModel> {
    return this.districtModel.create(payload);
  }

  update(id: string, payload: any): Promise<any> {
    return this.districtModel.update(payload, {
      where: {
        id: id,
      },
    });
  }

  delete(id: string): void {
    this.districtModel.update(
      { is_deleted: true },
      {
        where: {
          id: id,
        },
      },
    );
  }
}
