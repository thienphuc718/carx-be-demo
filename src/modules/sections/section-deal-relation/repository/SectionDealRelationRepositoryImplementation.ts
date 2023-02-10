import { InjectModel } from '@nestjs/sequelize';
import { DealModel, SectionDealRelationModel } from '../../../../models';
import { SectionDealRelationQueryConditionType } from '../type/SectionDealRelationType';
import { ISectionDealRelationRepository } from './SectionDealRelationRepositoryInterface';

export class SectionDealRelationRepositoryImplementation
  implements ISectionDealRelationRepository
{
  constructor(
    @InjectModel(SectionDealRelationModel)
    private sectionPostRelationModel: typeof SectionDealRelationModel,
  ) {}
  findAllByCondition(condition: SectionDealRelationQueryConditionType): Promise<SectionDealRelationModel[]> {
    return this.sectionPostRelationModel.findAll({
      where: {
        ...condition,
      },
      include: [
        {
          model: DealModel,
          as: 'deal',
          attributes: ['title', 'image', 'product_id'],
        }
      ],
      order: [['order', 'asc']],
    });
  }
  findOneByCondition(
    condition: SectionDealRelationQueryConditionType,
  ): Promise<SectionDealRelationModel> {
    return this.sectionPostRelationModel.findOne({
      where: {
        ...condition,
      },
    });
  }
  create(payload: any): Promise<SectionDealRelationModel> {
    return this.sectionPostRelationModel.create(payload);
  }
  updateByCondition(
    condition: SectionDealRelationQueryConditionType,
    payload: any,
  ): Promise<[number, SectionDealRelationModel[]]> {
    return this.sectionPostRelationModel.update(payload, {
      where: {
        ...condition,
      },
      returning: true,
    });
  }
  deleteByCondition(
    condition: SectionDealRelationQueryConditionType,
  ): Promise<number> {
    return this.sectionPostRelationModel.destroy({
      where: {
        ...condition,
      },
    });
  }

  countByCondition(condition: SectionDealRelationQueryConditionType): Promise<number> {
    return this.sectionPostRelationModel.count({
      where: {
        ...condition,
      }
    })
  }
}
