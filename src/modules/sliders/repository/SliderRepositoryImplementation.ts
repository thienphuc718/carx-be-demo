import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { SliderModel } from '../../../models';
import { ISliderRepository } from './SliderRepositoryInterface';

export class SliderRepositoryImplementation implements ISliderRepository {
  constructor(
    @InjectModel(SliderModel) private sliderModel: typeof SliderModel,
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
  ): Promise<SliderModel[]> {
    return this.sliderModel.findAll({
      limit: limit,
      offset: offset,
      where: {
        ...condition,
        is_deleted: false,
      },
      order: [['order', 'asc']],
    });
  }
  findAllByConditionWithoutPagination(condition: any): Promise<SliderModel[]> {
    return this.sliderModel.findAll({
      where: {
        ...condition,
        is_deleted: false,
      },
    })
  }
  findById(id: string): Promise<SliderModel> {
    return this.sliderModel.findByPk(id);
  }
  create(payload: any): Promise<SliderModel> {
    return this.sliderModel.create(payload);
  }
  update(id: string, payload: any): Promise<[number, SliderModel[]]> {
    return this.sliderModel.update(payload, {
      where: {
        id: id,
        is_deleted: false,
      },
      returning: true,
    });
  }
  count(condition: any): Promise<number> {
    return this.sliderModel.count({
      where: {
        ...condition,
        is_deleted: false,
      },
    });
  }
  delete(id: string): Promise<number> {
    return this.sliderModel.destroy({
      where: {
        id: id,
      },
    });
  }
  findOneByCondition(condition: any): Promise<SliderModel> {
    return this.sliderModel.findOne({
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
