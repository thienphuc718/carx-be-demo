import { SectionPromotionRelationModel } from '../../../../models';
import { SectionPromotionRelationQueryConditionType } from '../type/SectionPromotionRelationType';

export interface ISectionPromotionRelationRepository {
  findAllByCondition(
    condition: SectionPromotionRelationQueryConditionType,
  ): Promise<SectionPromotionRelationModel[]>;
  findOneByCondition(
    condition: SectionPromotionRelationQueryConditionType,
  ): Promise<SectionPromotionRelationModel>;
  create(payload: any): Promise<SectionPromotionRelationModel>;
  updateByCondition(
    condition: SectionPromotionRelationQueryConditionType,
    payload: any,
  ): Promise<[number, SectionPromotionRelationModel[]]>;
  deleteByCondition(
    condition: SectionPromotionRelationQueryConditionType,
  ): Promise<number>;
  countByCondition(condition: any): Promise<number>;
}

export const ISectionPromotionRelationRepository = Symbol(
  'ISectionPromotionRelationRepository',
);
