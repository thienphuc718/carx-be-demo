import { InjectModel } from '@nestjs/sequelize';
import {
  TrailerLaterRescueResponseModel,
  ProductModel,
  ServiceModel,
  ProductVariantModel,
  AgentModel,
} from '../../../../models';
import { ITrailerLaterRescueResponseRepository } from './TrailerLaterRescueResponseRepositoryInterface';

export class TrailerLaterRescueResponseRepositoryImplementation
  implements ITrailerLaterRescueResponseRepository
{
  constructor(
    @InjectModel(TrailerLaterRescueResponseModel)
    private trailerLaterRescueResponseModel: typeof TrailerLaterRescueResponseModel,
  ) {}

  findAllByCondition(
    limit: number,
    offset: number,
    condition: any,
  ): Promise<TrailerLaterRescueResponseModel[]> {
    return this.trailerLaterRescueResponseModel.findAll({
      limit: limit,
      offset: offset,
      where: {
        ...condition,
      },
      include: [
        {
          model: ServiceModel,
          include: [
            {
              model: ProductModel,
              include: [{ model: ProductVariantModel }],
            },
          ],
        },
        {
          model: AgentModel,
          as: 'agent',
          attributes: [
            'geo_info',
            'longitude',
            'latitude',
            'rating_points',
            'avatar',
            'name',
            'address',
          ],
        },
      ],
      order: [['updated_at', 'desc']],
    });
  }
  findOneByCondition(condition: any): Promise<TrailerLaterRescueResponseModel> {
    return this.trailerLaterRescueResponseModel.findOne({
      where: {
        ...condition,
      },
    });
  }
  countByCondition(condition: any): Promise<number> {
    return this.trailerLaterRescueResponseModel.count({
      where: {
        ...condition,
      },
    });
  }
  findById(id: string): Promise<TrailerLaterRescueResponseModel> {
    return this.trailerLaterRescueResponseModel.findByPk(id, {
      include: [
        {
          model: ServiceModel,
          include: [
            {
              model: ProductModel,
              include: [{ model: ProductVariantModel }],
            },
          ],
        },
        {
          model: AgentModel,
          as: 'agent',
          attributes: [
            'geo_info',
            'longitude',
            'latitude',
            'rating_points',
            'avatar',
            'name',
            'address',
          ],
        },
      ],
    });
  }
  create(payload: any): Promise<TrailerLaterRescueResponseModel> {
    return this.trailerLaterRescueResponseModel.create(payload);
  }
  update(
    id: string,
    payload: any,
  ): Promise<[number, TrailerLaterRescueResponseModel[]]> {
    return this.trailerLaterRescueResponseModel.update(payload, {
      where: {
        id: id,
      },
      returning: true,
    });
  }
  delete(id: string): void {
    throw new Error('Method not implemented.');
  }

  findAllByConditionWithoutPagination(
    condition: any,
  ): Promise<TrailerLaterRescueResponseModel[]> {
    return this.trailerLaterRescueResponseModel.findAll({
      where: condition,
    });
  }
}
