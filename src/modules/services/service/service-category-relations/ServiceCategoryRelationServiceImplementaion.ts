import { Inject } from '@nestjs/common';
import { ServiceCategoryRelationModel } from '../../../../models';
import { FilterServiceCategoryRelationDto } from '../../dto/ServiceCategoryRelationDto';
import { IServiceCategoryRelationRepository } from '../../repository/service-category-relations/ServiceCategoryRelationRepositoryInterface';
import { IServiceCategoryRelationService } from './ServiceCategoryRelationServiceInterface';

export class ServiceCategoryRelationServiceImplementation
  implements IServiceCategoryRelationService
{
  constructor(
    @Inject(IServiceCategoryRelationRepository)
    private serviceCategoryRelationRepository: IServiceCategoryRelationRepository,
  ) {}

  async getServiceCategoryRelationList(
    payload: FilterServiceCategoryRelationDto,
  ): Promise<ServiceCategoryRelationModel[]> {
    const { limit, page, ...rest } = payload;
    const serviceCategoryRelationList =
      await this.serviceCategoryRelationRepository.findAllByCondition(
        limit,
        (page - 1) * limit,
        rest,
      );
    return serviceCategoryRelationList;
  }

  countServiceCategoryRelationByCondition(condition: any): Promise<number> {
    return this.serviceCategoryRelationRepository.countByCondition(condition);
  }

  getServiceCategoryRelationListByConditionWithoutPagination(condition: any): Promise<ServiceCategoryRelationModel[]>{
    return this.serviceCategoryRelationRepository.findAllByConditionWithoutPagination(condition);
  }
}
