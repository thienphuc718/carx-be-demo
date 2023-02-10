import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProductBrandModel } from '../../../models';
import { ProductPhysicalBrandController } from '../controller/ProductBrandController';
import { ProductBrandRepositoryImplementation } from '../repository/product-brands/ProductBrandRepositoryImplement';
import { IProductBrandRepository } from '../repository/product-brands/ProductBrandRepositoryInterface';
import { ProductServiceImplementation } from '../service/products/ProductServiceImplement';
import { IProductService } from '../service/products/ProductServiceInterface';
import { IProductBrandService } from '../service/product-brands/ProductBrandServiceInterface';
import { ProductBrandServiceImplementation } from '../service/product-brands/ProductBrandServiceImplement';

@Module({
  imports: [SequelizeModule.forFeature([ProductBrandModel])],
  providers: [
    {
      provide: IProductBrandRepository,
      useClass: ProductBrandRepositoryImplementation,
    },
    {
      provide: IProductBrandService,
      useClass: ProductBrandServiceImplementation,
    },
  ],
  controllers: [ProductPhysicalBrandController],
  exports: [IProductBrandService],
})
export class ProductBrandModule {}
