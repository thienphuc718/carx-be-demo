import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  ProductAttributeSelectedModel,
  ProductCategorySelectedModel,
  ProductModel,
} from '../../../models';
import { ProductPhysicalController } from '../controller/ProductController';
import { ProductRepositoryImplementation } from '../repository/products/ProductRepositoryImplement';
import { IProductRepository } from '../repository/products/ProductRepositoryInterface';
import { ProductServiceImplementation } from '../service/products/ProductServiceImplement';
import { IProductService } from '../service/products/ProductServiceInterface';
import { ProductAttributeModule } from './ProductAttributeModule';
import { ProductVariantModel } from '../../../models';
import { UserModule } from '../../users/module/UserModule';
import { OrderItemModule } from '../../orders/module/OrderItemModule';
import { ProductVariantModule } from './ProductVariantModule';
import { AppGatewayModule } from '../../../gateway/AppGatewayModule';
import { OrderModule } from '../../orders/module/OrderModule';
import { ForbiddenKeywordModule } from '../../forbidden-keywords/module/ForbiddenKeywordModule';
import { ProductPhysicalControllerV2 } from '../controller/ProductControllerV2';
import {InsuranceProductController} from "../controller/InsuranceProductController";
import {InsuranceProductModule} from "./InsuranceProductModule";
import {AgentModule} from "../../agents/module/AgentModule";
import { SectionProductRelationModule } from "../../sections/section-product-relation/module/SectionProductRelationModule";

@Module({
  imports: [
    SequelizeModule.forFeature([
      ProductModel,
      ProductAttributeSelectedModel,
      ProductCategorySelectedModel,
      ProductVariantModel,
    ]),
    ProductAttributeModule,
    AppGatewayModule,
    forwardRef(() => ForbiddenKeywordModule),
    forwardRef(() => UserModule),
    forwardRef(() => OrderItemModule),
    forwardRef(() => ProductVariantModule),
    forwardRef(() => OrderModule),
    forwardRef(() => InsuranceProductModule),
    forwardRef(() => AgentModule),
    forwardRef(() => SectionProductRelationModule),
  ],
  providers: [
    {
      provide: IProductRepository,
      useClass: ProductRepositoryImplementation,
    },
    {
      provide: IProductService,
      useClass: ProductServiceImplementation,
    },
  ],
  controllers: [ProductPhysicalController, ProductPhysicalControllerV2, InsuranceProductController],
  exports: [IProductService, IProductRepository],
})
export class ProductModule {}
