import {
  UseGuards,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Query,
  Res,
} from '@nestjs/common';
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AuthGuard } from '../../../guards';
import { BaseController } from '../../../BaseController';
import { IProductService } from '../service/products/ProductServiceInterface';
import * as express from 'express';
import { FilterListProductDtoV2 } from '../dto/ProductDto';
import { Result } from '../../../results/Result';
import { ProductModel } from '../../../models';

@Controller('/v2/products')
@ApiTags('Products V2')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class ProductPhysicalControllerV2 extends BaseController {
  constructor(
    @Inject(IProductService)
    private readonly productService: IProductService,
  ) {
    super();
  }

  @Get()
  @ApiOperation({ summary: 'Get All Products' })
  async getAllProducts(
    @Res() response: express.Response,
    @Query() getProductsDto: FilterListProductDtoV2,
  ) {
    try {
      const [count, products] = await Promise.all([
        this.productService.countProductByCondition(getProductsDto),
        this.productService.getProductListByConditionV2(getProductsDto),
      ]);
      const data = await Promise.all(
        products.map((product) => this.mappingProductData(product)),
      );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: {
          total: count,
          product_list: data,
        },
      });
      return this.ok(response, result.value);
    } catch (error) {
      const err = Result.fail({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
      return this.fail(response, err.error);
    }
  }

  private async mappingProductData(product: ProductModel) {
    const productTotalSold = await Promise.all(
      product.variants.map((variant) =>
        this.productService.getProductTotalSoldBySku(variant.sku),
      ),
    );
    const data = product.transformToResponse({
      total_sold: productTotalSold.reduce((a, b) => a + b, 0),
    });
    return data;
  }
}
