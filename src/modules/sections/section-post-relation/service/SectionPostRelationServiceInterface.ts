import { SectionPostRelationModel } from '../../../../models';
import {
  CreateSectionPostRelationPayloadDto,
  UpdateSectionPostRelationPayloadDto,
} from '../dto/SectionPostRelationDto';
import { SectionPostRelationQueryConditionType } from '../type/SectionPostRelationType';

export interface ISectionPostRelationService {
  getAllByCondition(
    condition: SectionPostRelationQueryConditionType,
  ): Promise<SectionPostRelationModel[]>;
  getDetailByCondition(
    condition: SectionPostRelationQueryConditionType,
  ): Promise<SectionPostRelationModel>;
  create(
    payload: CreateSectionPostRelationPayloadDto,
  ): Promise<SectionPostRelationModel>;
  updateByCondition(
    condition: SectionPostRelationQueryConditionType,
    payload: UpdateSectionPostRelationPayloadDto,
  ): Promise<SectionPostRelationModel>;
  deleteByCondition(
    condition: SectionPostRelationQueryConditionType,
  ): Promise<boolean>;
  countByCondition(condition: any): Promise<number>
}

export const ISectionPostRelationService = Symbol(
  'ISectionPostRelationService',
);
