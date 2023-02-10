import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProductAttributeModel } from '../../../models';
import { ProductPhysicalAttributeController } from '../controller/ProductAttributeController';
import { ProductAttributeRepositoryImplementation } from '../repository/product-attributes/ProductAttributeRepositoryImplement';
import { IProductAttributeRepository } from '../repository/product-attributes/ProductAttributeRepositoryInterface';
import { ProductAttributeServiceImplementation } from '../service/product-attributes/ProductAttributeServiceImplement';
import { IProductAttributeService } from '../service/product-attributes/ProductAttributeServiceInterface';

@Module({
  imports: [SequelizeModule.forFeature([ProductAttributeModel])],
  providers: [
    {
      provide: IProductAttributeRepository,
      useClass: ProductAttributeRepositoryImplementation,
    },
    {
      provide: IProductAttributeService,
      useClass: ProductAttributeServiceImplementation,
    },
  ],
  controllers: [ProductPhysicalAttributeController],
  exports: [IProductAttributeService],
})
export class ProductAttributeModule {}
