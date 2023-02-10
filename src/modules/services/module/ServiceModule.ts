import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ServiceCategoryRelationModel, ServiceModel } from '../../../models';
import { ServiceController } from '../controller/ServiceController';
import { ServiceRepositoryImplementation } from '../repository/ServiceRepositoryImplement';
import { IServiceRepository } from '../repository/ServiceRepositoryInterface';
import { ServiceServiceImplementation } from '../service/ServiceServiceImplement';
import { IServiceService } from '../service/ServiceServiceInterface';
import { ServiceCategoryModule } from "./ServiceCategoryModule";
import { ProductModule } from '../../products/module/ProductModule';
import { UserModule } from '../../users/module/UserModule';
import { ServiceCategoryRelationModule } from './ServiceCategoryRelationModule';
import { AppGatewayModule } from '../../../gateway/AppGatewayModule';
import { ForbiddenKeywordModule } from '../../forbidden-keywords/module/ForbiddenKeywordModule';
import {AgentModule} from "../../agents/module/AgentModule";

@Module({
  imports: [
    SequelizeModule.forFeature([
      ServiceModel, ServiceCategoryRelationModel
    ]),
    forwardRef(() => ProductModule),
    forwardRef(() => ServiceCategoryModule),
    forwardRef(() => UserModule),
    ForbiddenKeywordModule,
    ServiceCategoryRelationModule,
    AppGatewayModule,
    forwardRef(() => AgentModule),
  ],
  providers: [
    {
      provide: IServiceRepository,
      useClass: ServiceRepositoryImplementation,
    },
    {
      provide: IServiceService,
      useClass: ServiceServiceImplementation,
    },
  ],
  exports: [IServiceService],
  controllers: [ServiceController],
})
export class ServiceModule {}
