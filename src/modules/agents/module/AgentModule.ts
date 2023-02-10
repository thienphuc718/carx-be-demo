import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  AgentModel,
  ServiceModel,
  ServiceCategoryRelationModel,
} from '../../../models';
import { DealModel } from '../../../models/Deals';
import { AgentController } from '../controller/AgentController';
import { AgentRepositoryImplementation } from '../repository/AgentRepositoryImplementation';
import { IAgentRepository } from '../repository/AgentRepositoryInterface';
import { AgentServiceImplementation } from '../service/AgentServiceImplementation';
import { IAgentService } from '../service/AgentServiceInterface';
import { GoongModule } from '../../goongapi/module/GoongModule';
import { UserModule } from '../../users/module/UserModule';
import { OrderModule } from '../../orders/module/OrderModule';
import { ForbiddenKeywordModule } from '../../forbidden-keywords/module/ForbiddenKeywordModule';
import { AgentCategoryModule } from '../../agent-categories/module/AgentCategoryModule';
import { ServiceModule } from '../../services/module/ServiceModule';
import { ProductModule } from '../../products/module';
import {ServiceCategoryModule} from "../../services/module/ServiceCategoryModule";
import { SectionAgentRelationModule } from "../../sections/section-agent-relation/module/SectionAgentRelationModule";
import { SectionProductRelationModule } from "../../sections/section-product-relation/module/SectionProductRelationModule";

@Module({
  imports: [
    SequelizeModule.forFeature([
      AgentModel,
      ServiceModel,
      ServiceCategoryRelationModel,
      DealModel,
    ]),
    GoongModule,
    ForbiddenKeywordModule,
    forwardRef(() => OrderModule),
    forwardRef(() => UserModule),
    forwardRef(() => AgentCategoryModule),
    ServiceModule,
    ProductModule,
    ServiceCategoryModule,
    forwardRef(() => SectionAgentRelationModule),
    SectionProductRelationModule,
  ],
  providers: [
    {
      provide: IAgentRepository,
      useClass: AgentRepositoryImplementation,
    },
    {
      provide: IAgentService,
      useClass: AgentServiceImplementation,
    },
  ],
  controllers: [AgentController],
  exports: [IAgentRepository, IAgentService],
})
export class AgentModule {}
