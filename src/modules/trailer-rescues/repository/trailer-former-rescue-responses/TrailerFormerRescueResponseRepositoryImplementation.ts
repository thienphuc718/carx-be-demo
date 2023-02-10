import { InjectModel } from '@nestjs/sequelize';
import {
  TrailerFormerRescueResponseModel,
  ProductModel,
  ServiceModel,
  ProductVariantModel,
  AgentModel,
} from '../../../../models';
import { ITrailerFormerRescueResponseRepository } from './TrailerFormerRescueResponseRepositoryInterface';

export class TrailerFormerRescueResponseRepositoryImplementation
  implements ITrailerFormerRescueResponseRepository
{
  constructor(
    @InjectModel(TrailerFormerRescueResponseModel)
    private trailerFormerRescueResponseModel: typeof TrailerFormerRescueResponseModel,
  ) {}

  findAllByCondition(
    limit: number,
    offset: number,
    condition: any,
  ): Promise<TrailerFormerRescueResponseModel[]> {
    return this.trailerFormerRescueResponseModel.findAll({
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
  findOneByCondition(condition: any): Promise<TrailerFormerRescueResponseModel> {
    return this.trailerFormerRescueResponseModel.findOne({
      where: {
        ...condition,
      },
    });
  }
  countByCondition(condition: any): Promise<number> {
    return this.trailerFormerRescueResponseModel.count({
      where: {
        ...condition,
      },
    });
  }
  findById(id: string): Promise<TrailerFormerRescueResponseModel> {
    return this.trailerFormerRescueResponseModel.findByPk(id, {
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
  create(payload: any): Promise<TrailerFormerRescueResponseModel> {
    return this.trailerFormerRescueResponseModel.create(payload);
  }
  update(
    id: string,
    payload: any,
  ): Promise<[number, TrailerFormerRescueResponseModel[]]> {
    return this.trailerFormerRescueResponseModel.update(payload, {
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
  ): Promise<TrailerFormerRescueResponseModel[]> {
    return this.trailerFormerRescueResponseModel.findAll({
      where: condition,
    });
  }
}
