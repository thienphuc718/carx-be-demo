import { SectionPromotionRelationModel } from '../../../../models';
import {
  CreateSectionPromotionRelationPayloadDto,
  UpdateSectionPromotionRelationPayloadDto,
} from '../dto/SectionPromotionRelationDto';
import { SectionPromotionRelationQueryConditionType } from '../type/SectionPromotionRelationType';

export interface ISectionPromotionRelationService {
  getAllByCondition(
    condition: SectionPromotionRelationQueryConditionType,
  ): Promise<SectionPromotionRelationModel[]>;
  getDetailByCondition(
    condition: SectionPromotionRelationQueryConditionType,
  ): Promise<SectionPromotionRelationModel>;
  create(
    payload: CreateSectionPromotionRelationPayloadDto,
  ): Promise<SectionPromotionRelationModel>;
  updateByCondition(
    condition: SectionPromotionRelationQueryConditionType,
    payload: UpdateSectionPromotionRelationPayloadDto,
  ): Promise<SectionPromotionRelationModel>;
  deleteByCondition(
    condition: SectionPromotionRelationQueryConditionType,
  ): Promise<boolean>;
  countByCondition(condition: any): Promise<number>;
}

export const ISectionPromotionRelationService = Symbol(
  'ISectionPromotionRelationService',
);
