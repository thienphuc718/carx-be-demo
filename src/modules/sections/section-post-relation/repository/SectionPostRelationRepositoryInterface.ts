import { SectionPostRelationModel } from '../../../../models';
import { SectionPostRelationQueryConditionType } from '../type/SectionPostRelationType';

export interface ISectionPostRelationRepository {
  findAllByCondition(
    condition: SectionPostRelationQueryConditionType,
  ): Promise<SectionPostRelationModel[]>;
  findOneByCondition(
    condition: SectionPostRelationQueryConditionType,
  ): Promise<SectionPostRelationModel>;
  create(payload: any): Promise<SectionPostRelationModel>;
  updateByCondition(
    condition: SectionPostRelationQueryConditionType,
    payload: any,
  ): Promise<[number, SectionPostRelationModel[]]>;
  deleteByCondition(
    condition: SectionPostRelationQueryConditionType,
  ): Promise<number>;
  countByCondition(condition: SectionPostRelationQueryConditionType): Promise<number>;
}

export const ISectionPostRelationRepository = Symbol(
  'ISectionPostRelationRepository',
);
