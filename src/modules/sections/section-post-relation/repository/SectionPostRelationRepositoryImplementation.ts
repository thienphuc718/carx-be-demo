import { InjectModel } from '@nestjs/sequelize';
import { PostModel, SectionPostRelationModel } from '../../../../models';
import { SectionPostRelationQueryConditionType } from '../type/SectionPostRelationType';
import { ISectionPostRelationRepository } from './SectionPostRelationRepositoryInterface';

export class SectionPostRelationRepositoryImplementation
  implements ISectionPostRelationRepository
{
  constructor(
    @InjectModel(SectionPostRelationModel)
    private sectionPostRelationModel: typeof SectionPostRelationModel,
  ) {}
  findAllByCondition(
    condition: SectionPostRelationQueryConditionType,
  ): Promise<SectionPostRelationModel[]> {
    return this.sectionPostRelationModel.findAll({
      where: {
        ...condition,
      },
      include: [
        {
          model: PostModel,
          as: 'post',
          attributes: ['id', 'title', 'thumbnail', 'type', 'created_at', 'updated_at']
        }
      ],
      order: [['order', 'asc']],
    });
  }
  findOneByCondition(
    condition: SectionPostRelationQueryConditionType,
  ): Promise<SectionPostRelationModel> {
    return this.sectionPostRelationModel.findOne({
      where: {
        ...condition,
      },
    });
  }
  create(payload: any): Promise<SectionPostRelationModel> {
    return this.sectionPostRelationModel.create(payload);
  }
  updateByCondition(
    condition: SectionPostRelationQueryConditionType,
    payload: any,
  ): Promise<[number, SectionPostRelationModel[]]> {
    return this.sectionPostRelationModel.update(payload, {
      where: {
        ...condition,
      },
      returning: true,
    });
  }
  deleteByCondition(
    condition: SectionPostRelationQueryConditionType,
  ): Promise<number> {
    return this.sectionPostRelationModel.destroy({
      where: {
        ...condition,
      },
    });
  }
  countByCondition(
    condition: SectionPostRelationQueryConditionType,
  ): Promise<number> {
    return this.sectionPostRelationModel.count({
      where: {
        ...condition,
      },
    });
  }
}
