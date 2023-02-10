import * as express from 'express';
import {
  Body,
  Controller,
  Get,
  Delete,
  HttpStatus,
  Inject,
  Param,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { ApiOperation, ApiTags, ApiExcludeController } from '@nestjs/swagger';
import { BaseController } from '../../../BaseController';
import { IProductBrandService } from '../service/product-brands/ProductBrandServiceInterface';
import { Result } from '../../../results/Result';
import {
  CreateProductBrandDto,
  DeleteProductBrandDto,
  UpdateProductBrandDto,
} from '../dto/ProductBrandDto';
import { PaginationDto } from '../dto';

@Controller('/v1/product-brands')
@ApiTags('Product Brands')
@ApiExcludeController()
export class ProductPhysicalBrandController extends BaseController {
  constructor(
    @Inject(IProductBrandService)
    private readonly productBrandService: IProductBrandService,
  ) {
    super();
  }

  @Get()
  @ApiOperation({ summary: 'Get Product Brand List' })
  async getProductBrandList(
    @Res() response: express.Response,
    @Query() pagination: PaginationDto,
  ) {
    try {
      const [count, productBrands] = await Promise.all([
        this.productBrandService.countProductBrandByCondition({}),
        this.productBrandService.getProductBrandList(pagination),
      ]);
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: {
          total: count,
          productBrands,
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

  @Get(':id')
  @ApiOperation({ summary: 'Get Product Brand Details' })
  async getProductBrandDetails(
    @Res() response: express.Response,
    @Param('id') productBrandId: string,
  ) {
    try {
      const productBrand =
        await this.productBrandService.getProductBrandDetails(productBrandId);
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: productBrand,
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

  @Post()
  @ApiOperation({ summary: 'Create Product Brand' })
  async createProductBrand(
    @Res() response: express.Response,
    @Body() payload: CreateProductBrandDto,
  ) {
    try {
      const productBrand = await this.productBrandService.createProductBrand(
        payload,
      );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: productBrand,
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

  @Put('/:id')
  @ApiOperation({ summary: 'Update Product Brand' })
  async updateProductBrand(
    @Res() response: express.Response,
    @Body() payload: UpdateProductBrandDto,
    @Param('id') productBrandId: string,
  ) {
    try {
      const updatedProductBrand =
        await this.productBrandService.updateProductBrand(
          productBrandId,
          payload,
        );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: updatedProductBrand,
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

  @Delete('/delete')
  @ApiOperation({ summary: 'Delete Product Brand' })
  async deleteProductBrands(
    @Res() response: express.Response,
    @Body() payload: DeleteProductBrandDto,
  ) {
    try {
      const [affectedRows, deletedRows] =
        await this.productBrandService.deleteProductBrand(payload.delete_ids);
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        message: `Successfully deleted ${affectedRows} product brand(s)`,
        data: deletedRows,
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
