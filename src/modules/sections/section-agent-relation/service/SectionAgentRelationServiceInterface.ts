import { SectionAgentRelationModel } from '../../../../models';
import { CreateSectionAgentRelationPayloadDto } from '../dto/SectionAgentRelationDto';
import { SectionAgentRelationQueryConditionType } from '../type/SectionAgentRelationType';

export interface ISectionAgentRelationService {
  getDetailByCondition(
    condition: SectionAgentRelationQueryConditionType,
  ): Promise<SectionAgentRelationModel>;
  getAllByCondition(
    condition: SectionAgentRelationQueryConditionType,
  ): Promise<SectionAgentRelationModel[]>;
  create(
    payload: CreateSectionAgentRelationPayloadDto,
  ): Promise<SectionAgentRelationModel>;
  updateByCondition(
    condition: SectionAgentRelationQueryConditionType,
    payload: any,
  ): Promise<SectionAgentRelationModel>;
  deleteByCondition(
    condition: SectionAgentRelationQueryConditionType,
  ): Promise<boolean>;
}

export const ISectionAgentRelationService = Symbol(
  'ISectionAgentRelationService',
);
