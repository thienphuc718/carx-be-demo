import { SectionDealRelationModel } from '../../../../models';
import {
  CreateSectionDealRelationPayloadDto,
  UpdateSectionDealRelationPayloadDto,
} from '../dto/SectionDealRelationDto';
import { SectionDealRelationQueryConditionType } from '../type/SectionDealRelationType';

export interface ISectionDealRelationService {
  getListByCondition(
    condition: SectionDealRelationQueryConditionType,
  ): Promise<SectionDealRelationModel[]>;
  getDetailByCondition(
    condition: SectionDealRelationQueryConditionType,
  ): Promise<SectionDealRelationModel>;
  createSectionDealRelation(
    payload: CreateSectionDealRelationPayloadDto,
  ): Promise<SectionDealRelationModel>;
  updateByCondition(
    condition: SectionDealRelationQueryConditionType,
    payload: UpdateSectionDealRelationPayloadDto,
  ): Promise<SectionDealRelationModel>;
  deleteByCondition(
    condition: SectionDealRelationQueryConditionType,
  ): Promise<boolean>;
}

export const ISectionDealRelationService = Symbol(
  'ISectionDealRelationService',
);

