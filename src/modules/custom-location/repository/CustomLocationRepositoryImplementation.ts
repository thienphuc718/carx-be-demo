import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { CustomLocationModel } from '../../../models';
import { ICustomLocationRepository } from './CustomLocationRepositoryInterface';

export class CustomLocationRepositoryImplementation implements ICustomLocationRepository {
  constructor(
    @InjectModel(CustomLocationModel) private customLocationModel: typeof CustomLocationModel,
    private sequelize: Sequelize,
  ) {
    this.sequelize = new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USERNAME,
      process.env.DB_PASSWORD, {
      host: `${process.env.DB_HOST}`,
      dialect: 'postgres',
    }
    );
  }
  findAllByCondition(
    limit: number,
    offset: number,
    condition: any,
  ): Promise<CustomLocationModel[]> {
    return this.customLocationModel.findAll({
      limit: limit,
      offset: offset,
      where: {
        ...condition,
        is_deleted: false,
      },
      order: [['order', 'asc']],
    });
  }
  findAllByConditionWithoutPagination(condition: any): Promise<CustomLocationModel[]> {
    return this.customLocationModel.findAll({
      where: {
        ...condition,
        is_deleted: false,
      },
    })
  }
  findById(id: string): Promise<CustomLocationModel> {
    return this.customLocationModel.findByPk(id);
  }
  create(payload: any): Promise<CustomLocationModel> {
    return this.customLocationModel.create(payload);
  }
  update(id: string, payload: any): Promise<[number, CustomLocationModel[]]> {
    return this.customLocationModel.update(payload, {
      where: {
        id: id,
        is_deleted: false,
      },
      returning: true,
    });
  }
  count(condition: any): Promise<number> {
    return this.customLocationModel.count({
      where: {
        ...condition,
        is_deleted: false,
      },
    });
  }
  delete(id: string): Promise<number> {
    return this.customLocationModel.destroy({
      where: {
        id: id,
      },
    });
  }
  findOneByCondition(condition: any): Promise<CustomLocationModel> {
    return this.customLocationModel.findOne({
      where: {
        ...condition,
        is_deleted: false,
      },
    });
  }
  rawQuery(query: string) {
    return this.sequelize.query(query);
  }
}
