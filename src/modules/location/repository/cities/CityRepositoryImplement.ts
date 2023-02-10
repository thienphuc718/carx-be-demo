import { ICityRepository } from './CityRepositoryInterface';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CityModel } from '../../../../models/Cities';

@Injectable()
export class CityRepositoryImplementation implements ICityRepository {
  constructor(@InjectModel(CityModel) private cityModel: typeof CityModel) {}

  findAllByCondition(
    limit: number,
    offset: number,
    condition: any,
  ): Promise<CityModel[]> {
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

  findById(id: string): Promise<CityModel> {
    return this.cityModel.findOne({
      where: {
        id: id,
      },
    });
  }

  create(payload: any, schema: string): Promise<CityModel> {
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
