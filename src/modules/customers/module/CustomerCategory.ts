import { SequelizeModule } from '@nestjs/sequelize';
import { Module } from '@nestjs/common';

import { CustomerCategoryServiceImplementation } from '../service/customer-category/CustomerCategoryServiceImplement';
import { CustomerCategoryRepositoryImplementation } from '../repository/customer-category/CustomerCategoryRepositoryImplement';
import { ICustomerCategoryRepository } from '../repository/customer-category/CustomerCategoryRepositoryInterface';
import { CustomerCategoryModel } from '../../../models/CustomerCategories';
import { ICustomerCategoryService } from '../service/customer-category/CustomerCategoryServiceInterface';
import { CustomerCategoryController } from '../controller/CustomerCategoryController';

@Module({
  imports: [SequelizeModule.forFeature([CustomerCategoryModel])],
  providers: [
    {
      provide: ICustomerCategoryRepository,
      useClass: CustomerCategoryRepositoryImplementation,
    },
    {
      provide: ICustomerCategoryService,
      useClass: CustomerCategoryServiceImplementation,
    },
  ],
  controllers: [CustomerCategoryController],
  exports: [ICustomerCategoryService],
})
export class CustomerCategoryModule {}
