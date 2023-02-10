import { SequelizeModule } from '@nestjs/sequelize';
import { forwardRef, Module } from '@nestjs/common';

import { CustomerServiceImplementation } from '../service/customer/CustomerServiceImplement';
import { CustomerRepositoryImplementation } from '../repository/customer/CustomerRepositoryImplement';
import { ICustomerRepository } from '../repository/customer/CustomerRepositoryInterface';
import { CustomerModel } from '../../../models/Customers';
import { CustomerCategoryRelationsModel } from '../../../models/CustomerCategoryRelations';
import { ICustomerService } from '../service/customer/CustomerServiceInterface';
import { CustomerController } from '../controller/CustomerController';
import { AgentModule } from '../../agents/module/AgentModule';
import { CustomerAgentRelationModule } from './CustomerAgentRelationModule';
import { ForbiddenKeywordModule } from '../../forbidden-keywords/module/ForbiddenKeywordModule';

@Module({
  imports: [
    SequelizeModule.forFeature([CustomerModel, CustomerCategoryRelationsModel]),
    forwardRef(() => AgentModule),
    CustomerAgentRelationModule,
    forwardRef(() => ForbiddenKeywordModule)
  ],
  providers: [
    {
      provide: ICustomerRepository,
      useClass: CustomerRepositoryImplementation,
    },
    {
      provide: ICustomerService,
      useClass: CustomerServiceImplementation,
    },
  ],
  controllers: [CustomerController],
  exports: [ICustomerService],
})
export class CustomerModule {}
