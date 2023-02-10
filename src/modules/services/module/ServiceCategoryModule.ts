import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ServiceCategoryModel } from '../../../models/ServiceCategories';
import { AgentModule } from '../../agents/module/AgentModule';
import { ServiceCategoryController } from '../controller/ServiceCategoryController';
import { ServiceCategoryRepositoryImplementation } from '../repository/service-categories/ServiceCategoryRepositoryImplement';
import { IServiceCategoryRepository } from '../repository/service-categories/ServiceCategoryRepositoryInterface';
import { ServiceCategoryServiceImplementation } from '../service/service-categories/ServiceCategoryServiceImplement';
import { IServiceCategoryService } from '../service/service-categories/ServiceCategoryServiceInterface';
import { ServiceCategoryRelationModule } from './ServiceCategoryRelationModule';
import { ServiceModule } from './ServiceModule';

@Module({
  imports: [
    SequelizeModule.forFeature([ServiceCategoryModel]),
    forwardRef(() => AgentModule),
    forwardRef(() => ServiceModule),
    ServiceCategoryRelationModule,
  ],
  providers: [
    {
      provide: IServiceCategoryRepository,
      useClass: ServiceCategoryRepositoryImplementation,
    },
    {
      provide: IServiceCategoryService,
      useClass: ServiceCategoryServiceImplementation,
    },
  ],
  exports: [IServiceCategoryService],
  controllers: [ServiceCategoryController],
})
export class ServiceCategoryModule {}
