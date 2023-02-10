import {
  UseGuards,
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
import { ApiOperation, ApiTags, ApiBearerAuth, ApiExcludeController } from '@nestjs/swagger';
import { AuthGuard } from '../../../guards';
import { BaseController } from '../../../BaseController';
import { IProductAttributeService } from '../service/product-attributes/ProductAttributeServiceInterface';
import * as express from 'express';
import {
  ProductAttributeValueDto,
  CreateProductAttributePayloadDto,
  DeleteProductAttributeDto,
  DeleteProductAttributeValueDto,
  UpdateProductAttributeDto,
} from '../dto/ProductAttributeDto';
import { Result } from '../../../results/Result';
import { PaginationDto } from '../dto';

@Controller('/v1/product-attributes')
@ApiTags('Product Attributes')
@ApiExcludeController()
// @UseGuards(AuthGuard)
export class ProductPhysicalAttributeController extends BaseController {
  constructor(
    @Inject(IProductAttributeService)
    private readonly productAttributeService: IProductAttributeService,
  ) {
    super();
  }

  @Get()
  @ApiOperation({ summary: 'Get All Product Attributes' })
  async getAllProductAttributes(
    @Res() response: express.Response,
    @Query() pagination: PaginationDto,
  ) {
    try {
      const [count, productAttributes] = await Promise.all([
        await this.productAttributeService.countProductAttributeByCondition({}),
        await this.productAttributeService.getProductAttributeList(pagination),
      ]);
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: {
          total: count,
          productAttributes,
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
  @ApiOperation({ summary: 'Get Product Attribute Detail' })
  async getProductAttributeDetail(
    @Res() response: express.Response,
    @Param('id') productAttributeId: string,
  ) {
    try {
      const productAttribute =
        await this.productAttributeService.getProductAttributeDetail(
          productAttributeId,
        );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: productAttribute,
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
  @ApiOperation({ summary: 'Create Product Attribute' })
  async createNewProductAttribute(
    @Res() response: express.Response,
    @Body() payload: CreateProductAttributePayloadDto,
  ) {
    try {
      const createdProductAttribute =
        await this.productAttributeService.createProductAttribute(payload);
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: createdProductAttribute,
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
  @ApiOperation({ summary: 'Update Product Attribute' })
  async updateProductAttribute(
    @Res() response: express.Response,
    @Body() updateProductAttributeDto: UpdateProductAttributeDto,
    @Param('id') productAttributeId: string,
  ) {
    try {
      const updatedProductAttribute =
        await this.productAttributeService.updateProductAttribute(
          productAttributeId,
          updateProductAttributeDto,
        );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: updatedProductAttribute,
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

  @Post(':id/values')
  @ApiOperation({ summary: 'Create Product Attribute Value' })
  async createProductAttributeValue(
    @Res() response: express.Response,
    @Body() payload: ProductAttributeValueDto,
    @Param('id') productAttributeId: string,
  ) {
    try {
      const updatedProductAttribute =
        await this.productAttributeService.createProductAttributeValue(
          productAttributeId,
          payload,
        );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: updatedProductAttribute,
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

  @Delete(':id/values/delete')
  @ApiOperation({ summary: 'Delete Product Attribute Values' })
  async deleteProductAttributeValues(
    @Res() response: express.Response,
    @Body() payload: DeleteProductAttributeValueDto,
    @Param('id') productAttributeId: string,
  ) {
    try {
      const updatedProductAttribute =
        await this.productAttributeService.deleteProductAttributeValues(
          productAttributeId,
          payload.codes,
        );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: updatedProductAttribute,
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
  @ApiOperation({ summary: 'Delete A Product Attribute' })
  async deleteProductAttribute(
    @Res() response: express.Response,
    @Body() payload: DeleteProductAttributeDto,
  ) {
    try {
      const [affectedRows, deletedRows] =
        await this.productAttributeService.deleteProductAttribute(
          payload.delete_ids,
        );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        message: `Successfully deleted ${affectedRows} productAttribute`,
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
