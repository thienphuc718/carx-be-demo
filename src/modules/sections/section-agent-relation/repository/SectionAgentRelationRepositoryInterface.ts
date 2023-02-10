import { SectionAgentRelationModel } from '../../../../models';
import { SectionAgentRelationQueryConditionType } from '../type/SectionAgentRelationType';

export interface ISectionAgentRelationRepository {
  findAllByCondition(
    condition: SectionAgentRelationQueryConditionType,
  ): Promise<SectionAgentRelationModel[]>;
  findOneByCondition(
    condition: SectionAgentRelationQueryConditionType,
  ): Promise<SectionAgentRelationModel>;
  create(payload: any): Promise<SectionAgentRelationModel>;
  updateByCondition(
    condition: SectionAgentRelationQueryConditionType,
    payload: any,
  ): Promise<[number, SectionAgentRelationModel[]]>;
  deleteByCondition(
    condition: SectionAgentRelationQueryConditionType,
  ): Promise<number>;
  countByCondition(
    condition: SectionAgentRelationQueryConditionType,
  ): Promise<number>;
}

export const ISectionAgentRelationRepository = Symbol(
  'ISectionAgentRelationRepository',
);
