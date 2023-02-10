import { ServiceCategoryRelationModel } from '../../../../models';
import { FilterServiceCategoryRelationDto } from '../../dto/ServiceCategoryRelationDto';

export interface IServiceCategoryRelationService {
  getServiceCategoryRelationList(
    payload: FilterServiceCategoryRelationDto,
  ): Promise<ServiceCategoryRelationModel[]>;  
  countServiceCategoryRelationByCondition(condition: any): Promise<number>
  getServiceCategoryRelationListByConditionWithoutPagination(condition: any): Promise<ServiceCategoryRelationModel[]>
}

export const IServiceCategoryRelationService = Symbol(
  'IServiceCategoryRelationService',
);
