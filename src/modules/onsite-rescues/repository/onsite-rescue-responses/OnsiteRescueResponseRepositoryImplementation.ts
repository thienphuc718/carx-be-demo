import { InjectModel } from '@nestjs/sequelize';
import {
  OnsiteRescueResponseModel,
  ProductModel,
  ServiceModel,
  ProductVariantModel,
  AgentModel,
} from '../../../../models';
import { IOnsiteRescueResponseRepository } from './OnsiteRescueResponseRepositoryInterface';

export class OnsiteRescueResponseRepositoryImplementation
  implements IOnsiteRescueResponseRepository
{
  constructor(
    @InjectModel(OnsiteRescueResponseModel)
    private onsiteRescueResponseModel: typeof OnsiteRescueResponseModel,
  ) {}

  findAllByCondition(
    limit: number,
    offset: number,
    condition: any,
  ): Promise<OnsiteRescueResponseModel[]> {
    return this.onsiteRescueResponseModel.findAll({
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
  findOneByCondition(condition: any): Promise<OnsiteRescueResponseModel> {
    return this.onsiteRescueResponseModel.findOne({
      where: {
        ...condition,
      },
    });
  }
  countByCondition(condition: any): Promise<number> {
    return this.onsiteRescueResponseModel.count({
      where: {
        ...condition,
      },
    });
  }
  findById(id: string): Promise<OnsiteRescueResponseModel> {
    return this.onsiteRescueResponseModel.findByPk(id, {
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
  create(payload: any): Promise<OnsiteRescueResponseModel> {
    return this.onsiteRescueResponseModel.create(payload);
  }
  update(
    id: string,
    payload: any,
  ): Promise<[number, OnsiteRescueResponseModel[]]> {
    return this.onsiteRescueResponseModel.update(payload, {
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
  ): Promise<OnsiteRescueResponseModel[]> {
    return this.onsiteRescueResponseModel.findAll({
      where: condition,
    });
  }
}
