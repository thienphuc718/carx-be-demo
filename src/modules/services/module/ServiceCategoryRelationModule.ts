import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ServiceCategoryRelationModel } from '../../../models';
import { ServiceCategoryRelationRepositoryImplementation } from '../repository/service-category-relations/ServiceCategoryRelationRepositoryImplementation';
import { IServiceCategoryRelationRepository } from '../repository/service-category-relations/ServiceCategoryRelationRepositoryInterface';
import { ServiceCategoryRelationServiceImplementation } from '../service/service-category-relations/ServiceCategoryRelationServiceImplementaion';
import { IServiceCategoryRelationService } from '../service/service-category-relations/ServiceCategoryRelationServiceInterface';

@Module({
  imports: [SequelizeModule.forFeature([ServiceCategoryRelationModel])],
  providers: [
    {
      provide: IServiceCategoryRelationRepository,
      useClass: ServiceCategoryRelationRepositoryImplementation,
    },
    {
      provide: IServiceCategoryRelationService,
      useClass: ServiceCategoryRelationServiceImplementation,
    },
  ],
  exports: [IServiceCategoryRelationService],
})
export class ServiceCategoryRelationModule {}
