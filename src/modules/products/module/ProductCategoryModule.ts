import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  ProductCategoryModel,
  ProductCategorySelectedModel,
} from '../../../models';
import { ProductPhysicalCategoryController } from '../controller/ProductCategoryController';
import { ProductCategoryRepositoryImplementation } from '../repository/product-categories/ProductCategoryRepositoryImplement';
import { IProductCategoryRepository } from '../repository/product-categories/ProductCategoryRepositoryInterface';
import { ProductCategoryServiceImplementation } from '../service/product-categories/ProductCategoryServiceImplement';
import { IProductCategoryService } from '../service/product-categories/ProductCategoryServiceInterface';

@Module({
  imports: [
    SequelizeModule.forFeature([
      ProductCategoryModel,
      ProductCategorySelectedModel,
    ]),
  ],
  providers: [
    {
      provide: IProductCategoryRepository,
      useClass: ProductCategoryRepositoryImplementation,
    },
    {
      provide: IProductCategoryService,
      useClass: ProductCategoryServiceImplementation,
    },
  ],
  controllers: [ProductPhysicalCategoryController],
  exports: [IProductCategoryService],
})
export class ProductCategoryModule {}
