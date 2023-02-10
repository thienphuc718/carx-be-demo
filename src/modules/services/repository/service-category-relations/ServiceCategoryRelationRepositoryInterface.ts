import { ServiceCategoryRelationModel } from '../../../../models';

export interface IServiceCategoryRelationRepository {
  findAllByCondition(
    limit: number,
    offset: number,
    condition: any,
  ): Promise<ServiceCategoryRelationModel[]>;
  countByCondition(condition: any): Promise<number>;
  findAllByConditionWithoutPagination(condition: any): Promise<ServiceCategoryRelationModel[]>
}

export const IServiceCategoryRelationRepository = Symbol(
  'IServiceCategoryRelationRepository',
);
