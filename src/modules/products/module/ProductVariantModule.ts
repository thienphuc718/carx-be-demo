import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProductVariantModel } from '../../../models';
import { ProductPhysicalVariantController } from '../controller/ProductVariantController';
import { ProductVariantRepositoryImplementation } from '../repository/product-variants/ProductVariantRepositoryImplement';
import { IProductVariantRepository } from '../repository/product-variants/ProductVariantRepositoryInterface';
import { ProductVariantServiceImplementation } from '../service/product-variants/ProductVariantServiceImplement';
import { IProductVariantService } from '../service/product-variants/ProductVariantServiceInterface';
import { ProductModule } from './ProductModule';
import { ProductAttributeModule } from './ProductAttributeModule';

@Module({
  imports: [
    SequelizeModule.forFeature([ProductVariantModel]),
    forwardRef(() => ProductModule),
    ProductAttributeModule,
  ],
  providers: [
    {
      provide: IProductVariantRepository,
      useClass: ProductVariantRepositoryImplementation,
    },
    {
      provide: IProductVariantService,
      useClass: ProductVariantServiceImplementation,
    },
  ],
  controllers: [ProductPhysicalVariantController],
  exports: [IProductVariantService, IProductVariantRepository],
})
export class ProductVariantModule {}
