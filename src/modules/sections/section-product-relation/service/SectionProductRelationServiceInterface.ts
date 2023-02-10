import { SectionProductRelationModel } from '../../../../models';
import {
  CreateSectionProductRelationPayloadDto,
  UpdateSectionProductRelationPayloadDto,
} from '../dto/SectionProductRelationDto';
import { SectionProductRelationQueryConditionType } from '../type/SectionProductRelationType';

export interface ISectionProductRelationService {
  getAllByCondition(
    condition: SectionProductRelationQueryConditionType,
  ): Promise<SectionProductRelationModel[]>;
  getDetailByCondition(
    condition: SectionProductRelationQueryConditionType,
  ): Promise<SectionProductRelationModel>;
  create(
    payload: CreateSectionProductRelationPayloadDto,
  ): Promise<SectionProductRelationModel>;
  updateByCondition(
    condition: SectionProductRelationQueryConditionType,
    payload: UpdateSectionProductRelationPayloadDto,
  ): Promise<SectionProductRelationModel>;
  deleteByCondition(
    condition: SectionProductRelationQueryConditionType,
  ): Promise<boolean>;
  countByCondition(condition: any): Promise<number>;
}

export const ISectionProductRelationService = Symbol('ISectionProductRelationService');
