import {
  UseGuards,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Res,
  Post,
  Body, Put, Param, Req,
} from '@nestjs/common';
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../../../guards';
import { BaseController } from '../../../BaseController';
import { IProductService } from '../service/products/ProductServiceInterface';
import * as express from 'express';
import { CreateInsuranceProductDto } from '../dto/ProductDto';
import { Result } from '../../../results/Result';
import { ProductModel } from '../../../models';
import {InsuranceProductServiceInterface} from "../service/insurance-products/InsuranceProductServiceInterface";
import {UpdateInsuranceProductPayloadDto} from "../dto/InsuranceProductDto";

@Controller('/v1/insurance-products')
@ApiTags('Insurance Products')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class InsuranceProductController extends BaseController {
  constructor(
    @Inject(IProductService)
    private readonly productService: IProductService,
    @Inject(InsuranceProductServiceInterface)
    private readonly insuranceProductService: InsuranceProductServiceInterface,
  ) {
    super();
  }

  @Post()
  @ApiOperation({ summary: 'Create Insurance Product' })
  async createInsuranceProduct(
    @Res() response: express.Response,
    @Body() payload: CreateInsuranceProductDto,
    @Req() request: express.Request,
  ) {
    try {
      const createdProduct = await this.productService.createInsuranceProduct(payload, request.user.id);
      const result = Result.ok({
          statusCode: HttpStatus.OK,
          data: await this.mappingProductData(createdProduct),
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

  @Put(':id')
  async updateInsuranceProduct(
     @Res() response: express.Response,
     @Body() payload: UpdateInsuranceProductPayloadDto,
     @Param('id') insuranceProductId: string,
  ) {
    try {
      const updatedInsuranceProduct = await this.insuranceProductService.updateInsuranceProductById(insuranceProductId, payload);
      const product = await this.productService.getProductDetail(updatedInsuranceProduct.product_id);
      const result = Result.ok({
          statusCode: HttpStatus.OK,
          data: await this.mappingProductData(product),
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
