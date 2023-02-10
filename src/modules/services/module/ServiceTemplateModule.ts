import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ServiceTemplateModel } from '../../../models';
import { ServiceTemplateController } from '../controller/ServiceTemplateController';
import { ServiceTemplateRepositoryImplementation } from '../repository/service-templates/ServiceTemplateRepositoryImplementation';
import { IServiceTemplateRepository } from '../repository/service-templates/ServiceTemplateRepositoryInterface';
import { ServiceTemplateServiceImplementation } from '../service/service-templates/ServiceTemplateServiceImplementation';
import { IServiceTemplateService } from '../service/service-templates/ServiceTemplateServiceInterface';

@Module({
  imports: [SequelizeModule.forFeature([ServiceTemplateModel])],
  providers: [
    {
      provide: IServiceTemplateRepository,
      useClass: ServiceTemplateRepositoryImplementation,
    },
    {
      provide: IServiceTemplateService,
      useClass: ServiceTemplateServiceImplementation,
    },
  ],
  controllers: [ServiceTemplateController],
})
export class ServiceTemplateModule {}
