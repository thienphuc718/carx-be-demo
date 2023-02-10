import { SequelizeModule } from '@nestjs/sequelize';
import { Module } from '@nestjs/common';

import { CustomerClassServiceImplementation } from '../service/customer-class/CustomerClassServiceImplement';
import { CustomerClassRepositoryImplementation } from '../repository/customer-class/CustomerClassRepositoryImplement';
import { ICustomerClassRepository } from '../repository/customer-class/CustomerClassRepositoryInterface';
import { CustomerClassModel } from '../../../models/CustomerClasses';
import { ICustomerClassService } from '../service/customer-class/CustomerClassServiceInterface';
import { CustomerClassController } from '../controller/CustomerClassController';

@Module({
  imports: [SequelizeModule.forFeature([CustomerClassModel])],
  providers: [
    {
      provide: ICustomerClassRepository,
      useClass: CustomerClassRepositoryImplementation,
    },
    {
      provide: ICustomerClassService,
      useClass: CustomerClassServiceImplementation,
    },
  ],
  controllers: [CustomerClassController],
  exports: [ICustomerClassService],
})
export class CustomerClassModule {}
