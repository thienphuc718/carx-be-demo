import { SectionProductRelationModel } from '../../../../models';
import { SectionProductRelationQueryConditionType } from '../type/SectionProductRelationType';

export interface ISectionProductRepository {
  findAllByCondition(
    condition: SectionProductRelationQueryConditionType,
  ): Promise<SectionProductRelationModel[]>;
  findOneByCondition(condition: any): Promise<SectionProductRelationModel>;
  create(payload: any): Promise<SectionProductRelationModel>;
  updateByCondition(
    condition: SectionProductRelationQueryConditionType,
    payload: any,
  ): Promise<[number, SectionProductRelationModel[]]>;
  deleteByCondition(
    condition: SectionProductRelationQueryConditionType,
  ): Promise<number>;
  countByCondition(condition: any): Promise<number>;
}

export const ISectionProductRepository = Symbol('ISectionProductRepository');
