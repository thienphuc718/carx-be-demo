import {
  UseGuards,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Inject,
  Param,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { ApiOperation, ApiTags, ApiBearerAuth, ApiExcludeController } from '@nestjs/swagger';
import { AuthGuard } from '../../../guards';
import { BaseController } from '../../../BaseController';
import { IProductVariantService } from '../service/product-variants/ProductVariantServiceInterface';
import * as express from 'express';
import {
  CreateProductVariantPayloadDto,
  UpdateProductVariantPayloadDto,
} from '../dto/ProductVariantDto';
import { Result } from '../../../results/Result';
import { PaginationDto } from '../dto';

@Controller('/v1/product-variants')
@ApiTags('Product Variants')
@ApiExcludeController()
export class ProductPhysicalVariantController extends BaseController {
  constructor(
    @Inject(IProductVariantService)
    private readonly productVariantService: IProductVariantService,
  ) {
    super();
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get Product Variant Detail' })
  async getProductVariantDetail(
    @Res() response: express.Response,
    @Param('id') productVariantId: string,
  ) {
    try {
      const productVariant =
        await this.productVariantService.getProductVariantDetail(
          productVariantId,
        );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: productVariant,
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

  @Get('/:productId')
  @ApiOperation({ summary: 'Get Product Variants' })
  async getAllProductVariants(
    @Res() response: express.Response,
    @Query() pagination: PaginationDto,
    @Param('productId') productId: string,
  ) {
    try {
      const [variants, count] = await Promise.all([
        this.productVariantService.getProductVariantList(productId, pagination),
        this.productVariantService.countProductVariantByCondition({
          product_id: productId,
        }),
      ]);
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: {
          total: count,
          variants,
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

  @Post('')
  @ApiOperation({ summary: 'Create Product Variant' })
  async createNewProductVariant(
    @Res() response: express.Response,
    @Body() createProductVariantDto: CreateProductVariantPayloadDto,
  ) {
    try {
      const createdProductVariant =
        await this.productVariantService.createProductVariant(
          createProductVariantDto,
        );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: createdProductVariant,
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
  @ApiOperation({ summary: 'Update Product Variant' })
  async updateProductVariant(
    @Res() response: express.Response,
    @Body() updateProductVariantDto: UpdateProductVariantPayloadDto,
    @Param('id') productVariantId: string,
  ) {
    try {
      const [_, updatedProductVariant] =
        await this.productVariantService.updateProductVariant(
          productVariantId,
          updateProductVariantDto,
        );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: updatedProductVariant[0],
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

  @Delete(':id')
  @ApiOperation({ summary: 'Delete A Product Variant' })
  async deleteProductVariant(
    @Res() response: express.Response,
    @Param('id') productVariantId: string,
  ) {
    try {
      await this.productVariantService.deleteProductVariant(productVariantId);
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        message: 'Successfully deleted a product variant',
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
}
