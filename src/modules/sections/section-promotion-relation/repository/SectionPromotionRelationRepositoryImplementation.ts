import { InjectModel } from '@nestjs/sequelize';
import {
  PromotionModel,
  SectionPromotionRelationModel,
  AgentModel
} from '../../../../models';
import { SectionPromotionRelationQueryConditionType } from '../type/SectionPromotionRelationType';
import { ISectionPromotionRelationRepository } from './SectionPromotionRelationRepositoryInterface';

export class SectionPromotionRelationRepositoryImplementation
  implements ISectionPromotionRelationRepository {
  constructor(
    @InjectModel(SectionPromotionRelationModel)
    private sectionPromotionRelationModel: typeof SectionPromotionRelationModel,
  ) { }
  findAllByCondition(
    condition: SectionPromotionRelationQueryConditionType,
  ): Promise<SectionPromotionRelationModel[]> {
    return this.sectionPromotionRelationModel.findAll({
      where: {
        ...condition,
      },
      include: [
        {
          model: PromotionModel,
          as: 'promotion',
          attributes: {
            exclude: ['agent_id', 'gift_id', 'is_deleted'],
          },
        },
      ],
      order: [['order', 'asc']],
    });
  }
  findOneByCondition(
    condition: SectionPromotionRelationQueryConditionType,
  ): Promise<SectionPromotionRelationModel> {
    return this.sectionPromotionRelationModel.findOne({
      where: {
        ...condition,
      },
    });
  }
  create(payload: any): Promise<SectionPromotionRelationModel> {
    return this.sectionPromotionRelationModel.create(payload);
  }
  updateByCondition(
    condition: SectionPromotionRelationQueryConditionType,
    payload: any,
  ): Promise<[number, SectionPromotionRelationModel[]]> {
    return this.sectionPromotionRelationModel.update(payload, {
      where: {
        ...condition,
      },
      returning: true,
    });
  }
  deleteByCondition(
    condition: SectionPromotionRelationQueryConditionType,
  ): Promise<number> {
    return this.sectionPromotionRelationModel.destroy({
      where: {
        ...condition,
      },
    });
  }
  countByCondition(condition: any): Promise<number> {
    return this.sectionPromotionRelationModel.count({
      where: {
        ...condition,
      },
    });
  }
}
