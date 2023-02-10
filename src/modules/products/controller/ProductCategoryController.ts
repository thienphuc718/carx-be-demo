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
import { IProductCategoryService } from '../service/product-categories/ProductCategoryServiceInterface';
import * as express from 'express';
import {
  CreateProductCategoryDto,
  QueryProductByCategoryDto,
  UpdateProductCategoryDto,
} from '../dto/ProductCategoryDto';
import { Result } from '../../../results/Result';
import { getSchemaFromUrl } from '../../../helpers/jwtHelper';
import { PaginationDto } from '../dto';

@Controller('/v1/product-categories')
@ApiTags('Product Categories')
@ApiExcludeController()
// @UseGuards(AuthGuard)
export class ProductPhysicalCategoryController extends BaseController {
  constructor(
    @Inject(IProductCategoryService)
    private readonly productCategoryService: IProductCategoryService,
  ) {
    super();
  }

  @Get()
  @ApiOperation({ summary: 'Get Root Categories' })
  async getProductCategoryChildren(
    @Res() response: express.Response,
    @Query() pagination: PaginationDto,
  ) {
    try {
      const condition = {
        parent_id: null,
      };
      const [count, productCategories] = await Promise.all([
        this.productCategoryService.countProductCategoryByCondition({
          parent_id: null,
        }),
        this.productCategoryService.getProductCategoryByCondition(
          pagination,
          condition,
        ),
      ]);
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: {
          total: count,
          productCategories,
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

  @Get('/:id/children')
  @ApiOperation({ summary: 'Get Category Children' })
  async getProductCategoryList(
    @Res() response: express.Response,
    @Param('id') categoryId: string,
    @Query() pagination: PaginationDto,
  ) {
    try {
      const condition = {
        parent_id: categoryId,
      };
      const [count, children] = await Promise.all([
        this.productCategoryService.countProductCategoryByCondition(condition),
        this.productCategoryService.getProductCategoryByCondition(
          pagination,
          condition,
        ),
      ]);
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: {
          total: count,
          children,
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

  @Get(':id/products')
  @ApiOperation({ summary: 'Get Products Of Category' })
  async getProductsOfCategory(
    @Res() response: express.Response,
    @Param('id') productCategoryId: string,
    @Query() query: QueryProductByCategoryDto,
  ) {
    try {
      const [total, products] =
        await this.productCategoryService.getProductByCategoryId(
          productCategoryId,
          query,
        );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: {
          total,
          products,
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

  @Post()
  @ApiOperation({ summary: 'Create Product Category' })
  async createNewProductCategory(
    @Res() response: express.Response,
    @Body() createProductCategoryDto: CreateProductCategoryDto,
  ) {
    try {
      const createdProductCategory =
        await this.productCategoryService.createProductCategory(
          createProductCategoryDto,
        );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: createdProductCategory,
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
  @ApiOperation({ summary: 'Update Product Category' })
  async updateProductCategory(
    @Res() response: express.Response,
    @Body() updateProductCategoryDto: UpdateProductCategoryDto,
    @Param('id') productCategoryId: string,
  ) {
    try {
      const updatedProductCategory =
        await this.productCategoryService.updateProductCategory(
          productCategoryId,
          updateProductCategoryDto,
        );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: updatedProductCategory[1][0],
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

  @Delete('/:id')
  @ApiOperation({ summary: 'Delete A Category' })
  async deleteProductCategory(
    @Res() response: express.Response,
    @Param('id') categoryId: string,
  ) {
    try {
      const [affectedRows, deletedRows] =
        await this.productCategoryService.deleteProductCategory(categoryId);
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        message: `Successfully deleted ${affectedRows} product category`,
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
