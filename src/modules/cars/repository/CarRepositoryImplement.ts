import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CarModel } from '../../../models/Cars';
import { ICarRepository } from './CarRepositoryInterface';

@Injectable()
export class CarRepositoryImplementation implements ICarRepository {
  constructor(
    @InjectModel(CarModel) private carModel: typeof CarModel,
  ) {}

  findAll(): Promise<CarModel[]> {
    return this.carModel.findAll({
      where: {
        is_deleted: false,
      },
      order: [['created_at', 'desc']],
    });
  }

  findAllByCondition(
    limit: number,
    page: number,
    condition: any,
  ): Promise<CarModel[]> {
    return this.carModel.findAll({
      limit: limit,
      offset: (limit * (page - 1)),
      where: {
        ...condition,
        is_deleted: false,
      },
      order: [['created_at', 'desc']],
    });
  }

  findById(id: string): Promise<CarModel> {
    return this.carModel.findOne({
      where: {
        id: id,
      },
    });
  }

  create(payload: any): Promise<CarModel> {
    return this.carModel.create(payload);
  }

  async update(id: string, payload: any): Promise<number> {
    const result = await this.carModel.update(payload, {
      where: {
        id: id,
      },
    });
    return result[0];
  }

  delete(id: string): void {
    this.carModel.update(
      { is_deleted: true },
      {
        where: {
          id: id,
        },
      },
    );
  }
}
