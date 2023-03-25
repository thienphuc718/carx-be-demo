import { InjectModel } from '@nestjs/sequelize';
import { AgentModel, SectionAgentRelationModel } from '../../../../models';
import { SectionAgentRelationQueryConditionType } from '../type/SectionAgentRelationType';
import { ISectionAgentRelationRepository } from './SectionAgentRelationRepositoryInterface';

export class SectionAgentRelationRepositoryImplementation
  implements ISectionAgentRelationRepository {
  constructor(
    @InjectModel(SectionAgentRelationModel)
    private sectionAgentRelationModel: typeof SectionAgentRelationModel,
  ) { }
  findAllByCondition(
    condition: SectionAgentRelationQueryConditionType,
  ): Promise<SectionAgentRelationModel[]> {
    return this.sectionAgentRelationModel.findAll({
      where: {
        ...condition,
      },
      include: [
        {
          model: AgentModel,
          as: 'agent',
          attributes: ['name', 'avatar', 'longitude', 'latitude']
        }
      ],
      order: [['order', 'asc']],
    });
  }
  findOneByCondition(condition: any): Promise<SectionAgentRelationModel> {
    return this.sectionAgentRelationModel.findOne({
      where: {
        ...condition,
      },
    });
  }
  create(payload: any): Promise<SectionAgentRelationModel> {
    return this.sectionAgentRelationModel.create(payload);
  }
  updateByCondition(
    condition: SectionAgentRelationQueryConditionType,
    payload: any,
  ): Promise<[number, SectionAgentRelationModel[]]> {
    return this.sectionAgentRelationModel.update(payload, {
      where: {
        ...condition,
      },
      returning: true,
    });
  }
  deleteByCondition(
    condition: SectionAgentRelationQueryConditionType,
  ): Promise<number> {
    return this.sectionAgentRelationModel.destroy({
      where: {
        ...condition,
      },
    });
  }
  countByCondition(
    condition: SectionAgentRelationQueryConditionType,
  ): Promise<number> {
    return this.sectionAgentRelationModel.count({
      where: {
        ...condition,
      },
    });
  }
}
