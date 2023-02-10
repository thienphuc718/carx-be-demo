import { InjectModel } from '@nestjs/sequelize';
import {
  ProductModel,
  ProductVariantModel,
  SectionProductRelationModel,
} from '../../../../models';
import { SectionProductRelationQueryConditionType } from '../type/SectionProductRelationType';
import { ISectionProductRepository } from './SectionProductRelationRepositoryInterface';

export class SectionProductRepositoryImplementation
  implements ISectionProductRepository
{
  constructor(
    @InjectModel(SectionProductRelationModel)
    private sectionProductModel: typeof SectionProductRelationModel,
  ) {}
  findAllByCondition(
    condition: SectionProductRelationQueryConditionType,
  ): Promise<SectionProductRelationModel[]> {
    return this.sectionProductModel.findAll({
      where: {
        ...condition,
      },
      include: [
        {
          model: ProductModel,
          as: 'product',
          attributes: {
            exclude: [
              'agent_id',
              'is_variable',
              'guarantee_time',
              'guarantee_time_unit',
              'is_guaranteed',
              'description',
              'guarantee_note',
              'other_info',
              'tags',
              'brand_id',
              'created_at',
              'updated_at',
            ],
          },
          include: [
            {
              model: ProductVariantModel,
              as: 'variants',
              attributes: [
                'images',
                'price',
                'discount_price',
                'quantity',
                'sku',
              ],
            },
          ],
        },
      ],
      order: [['order', 'asc']],
    });
  }
  findOneByCondition(
    condition: SectionProductRelationQueryConditionType,
  ): Promise<SectionProductRelationModel> {
    return this.sectionProductModel.findOne({
      where: {
        ...condition,
      },
    });
  }
  create(payload: any): Promise<SectionProductRelationModel> {
    return this.sectionProductModel.create(payload);
  }
  updateByCondition(
    condition: SectionProductRelationQueryConditionType,
    payload: any,
  ): Promise<[number, SectionProductRelationModel[]]> {
    return this.sectionProductModel.update(payload, {
      where: {
        ...condition,
      },
      returning: true,
    });
  }
  deleteByCondition(
    condition: SectionProductRelationQueryConditionType,
  ): Promise<number> {
    return this.sectionProductModel.destroy({
      where: { ...condition },
    });
  }
  countByCondition(condition: any): Promise<number> {
    return this.sectionProductModel.count({
      where: {
        ...condition,
      },
    });
  }
}
