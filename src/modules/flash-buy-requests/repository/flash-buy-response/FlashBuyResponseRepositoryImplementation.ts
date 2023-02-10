import { InjectModel } from '@nestjs/sequelize';
import {
  AgentModel,
  FlashBuyResponseModel,
  ProductModel,
  ProductVariantModel,
} from '../../../../models';
import { IFlashBuyResponseRepository } from './FlashBuyResponseRepositoryInterface';

export class FlashBuyResponseRepositoryImplementation
  implements IFlashBuyResponseRepository
{
  constructor(
    @InjectModel(FlashBuyResponseModel)
    private flashBuyResponseModel: typeof FlashBuyResponseModel,
  ) {}
  //   update(
  //     condition: UpdateFlashBuyResponseConditionDto,
  //     payload: { is_deleted: boolean },
  //   ): Promise<[number, FlashBuyResponseModel[]]> {
  //     return this.flashBuyResponseModel.update(
  //       { ...payload },
  //       {
  //         where: {
  //           ...condition,
  //         },
  //         returning: true,
  //       },
  //     );
  //   }
  findAllWithCondition(
    limit: number,
    offset: number,
    condition: any,
  ): Promise<FlashBuyResponseModel[]> {
    return this.flashBuyResponseModel.findAll({
      limit: limit,
      offset: offset,
      where: {
        ...condition,
        is_deleted: false,
      },
      include: [
        {
          model: ProductModel,
          as: 'product',
          include: [
            {
              model: ProductVariantModel,
              as: 'variants',
            },
          ],
        },
        {
          model: AgentModel,
          as: 'agent',
          attributes: [
            'name',
            'avatar',
            'rating_points',
            'geo_info',
            'longitude',
            'latitude',
          ],
        },
      ],
      order: [['updated_at', 'desc']],
    });
  }
  create(payload: any): Promise<FlashBuyResponseModel> {
    return this.flashBuyResponseModel.create(payload);
  }

  count(condition: any): Promise<number> {
    return this.flashBuyResponseModel.count({
      where: {
        ...condition,
        is_deleted: false,
      },
    });
  }

  findAllByConditionWithoutPagination(
    condition: any,
  ): Promise<FlashBuyResponseModel[]> {
    return this.flashBuyResponseModel.findAll({
      where: {
        ...condition,
        is_deleted: false,
      },
    });
  }

  findOneByCondition(condition: any): Promise<FlashBuyResponseModel> {
    return this.flashBuyResponseModel.findOne({
      where: {
        ...condition,
        is_deleted: false,
      }
    })
  }
}
