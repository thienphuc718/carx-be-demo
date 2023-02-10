import { SectionDealRelationModel } from '../../../../models';
import { SectionDealRelationQueryConditionType } from '../type/SectionDealRelationType';

export interface ISectionDealRelationRepository {
  findAllByCondition(
    condition: SectionDealRelationQueryConditionType,
  ): Promise<SectionDealRelationModel[]>;
  findOneByCondition(
    condition: SectionDealRelationQueryConditionType,
  ): Promise<SectionDealRelationModel>;
  create(payload: any): Promise<SectionDealRelationModel>;
  updateByCondition(
    condition: SectionDealRelationQueryConditionType,
    payload: any,
  ): Promise<[number, SectionDealRelationModel[]]>;
  deleteByCondition(
    condition: SectionDealRelationQueryConditionType,
  ): Promise<number>;
  countByCondition(
    condition: SectionDealRelationQueryConditionType,
  ): Promise<number>;
}

export const ISectionDealRelationRepository = Symbol(
  'ISectionDealRelationRepository',
);
