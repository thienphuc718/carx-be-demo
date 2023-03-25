import {
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
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags, } from '@nestjs/swagger';
import { EventEmitter2, } from '@nestjs/event-emitter';
import { AuthGuard } from '../../../guards';
import { BaseController } from '../../../BaseController';
import { IProductService } from '../service/products/ProductServiceInterface';
import * as express from 'express';
import { CreateProductPayloadDto, FilterListProductDto, UpdateProductPayloadDto, } from '../dto/ProductDto';
import { Result } from '../../../results/Result';
import { ProductTypeEnum } from '../enum/ProductEnum';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('/v1/products')
@ApiTags('Products')
export class ProductPhysicalController extends BaseController {
  constructor(
    @Inject(IProductService)
    private readonly productService: IProductService,
    private eventEmitter: EventEmitter2
  ) {
    super();
  }

  @Get()
  @ApiOperation({ summary: 'Get All Products' })
  async getAllProducts(
    @Res() response: express.Response,
    @Query() getProductsDto: FilterListProductDto,
  ) {
    try {
      const [count, products] = await Promise.all([
        this.productService.countProductByCondition(getProductsDto),
        this.productService.getProductList(getProductsDto),
      ]);
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: {
          total: count,
          product_list: products.map(product => product.transformToResponse()),
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

  @Get('/best-sellers')
  @ApiOperation({ summary: 'Get Most Order Completed Products' })
  async getMostCompletedOrderProduct(
    @Res() response: express.Response,
  ) {
    try {
      const products = await this.productService.getMostCompletedOrderProduct();
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: {
          product_list: products.map(product => product.transformToResponse()),
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

  @Get('/most-viewed')
  @ApiOperation({ summary: 'Get Most Viewed Products' })
  async getMostViewedProducts(
    @Res() response: express.Response,
  ) {
    try {
      const products = await this.productService.getMostViewCountProduct();
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: {
          product_list: products.map(product => product.transformToResponse()),
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

  @Get('/:id/related-products')
  @ApiOperation({ summary: 'Get Related Products' })
  async getRelatedProducts(
    @Res() response: express.Response,
    @Param('id') productId: string,
  ) {
    try {
      const [count, products] =
        await this.productService.getRelatedProductsByProductId(productId);
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: {
          total: count,
          product_list: products.map(product => product.transformToResponse()),
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
  @ApiOperation({ summary: 'Get Product Detail' })
  async getProductDetail(
    @Res() response: express.Response,
    @Param('id') productId: string,
  ) {
    try {
      const product = await this.productService.getProductDetailAndAddViewCount(productId);
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: product.transformToResponse(),
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
  @ApiOperation({ summary: 'Create Product' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async createNewProduct(
    @Res() response: express.Response,
    @Body() createProductDto: CreateProductPayloadDto,
    @Req() request: express.Request,
  ) {
    try {
      const createdProduct = await this.productService.createProduct({
        ...createProductDto,
        type: ProductTypeEnum.PHYSICAL,
      }, request.user.id);
      const newProduct = await this.productService.getProductDetail(
        createdProduct.id,
      );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: newProduct.transformToResponse(),
      });
      return this.ok(response, result.value);
    } catch (error) {
      const err = Result.fail({
        statusCode: error.code ? HttpStatus.BAD_REQUEST : HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
        errorCode: error.code,
        data: error.value
      });
      return this.fail(response, err.error);
    }
  }

  @Post('/:id/view-counts')
  @ApiOperation({ summary: 'Add view count to product' })
  async increaseProductSearchCount(
    @Res() response: express.Response,
    @Param('id') productId: string,
  ) {
    try {
      const res = await this.productService.addViewCount(productId);
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: res.transformToResponse(),
      });
      return this.ok(response, result.value);
    } catch (error) {
      const err = Result.fail({
        statusCode: error.code ? HttpStatus.BAD_REQUEST : HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
        errorCode: error.code,
        data: error.value
      });
      return this.fail(response, err.error);
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update Product' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async updateProduct(
    @Res() response: express.Response,
    @Body() updateProductDto: UpdateProductPayloadDto,
    @Param('id') productId: string,
  ) {
    try {
      const updatedProduct = await this.productService.updateProduct(
        productId,
        { ...updateProductDto },
      );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: updatedProduct.transformToResponse(),
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
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Delete multiple Products' })
  async deleteMultipleProducts(
    @Res() response: express.Response,
    @Body() productIds: string[],
  ) {
    try {
      await this.productService.deleteMultipleProducts(productIds);
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        message: 'Successfully delete products',
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
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Delete A Product' })
  async deleteProduct(
    @Res() response: express.Response,
    @Param('id') productId: string,
  ) {
    try {
      const [_, deletedRows] = await this.productService.deleteProduct(
        productId,
      );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        message: 'Successfully deleted a product',
        data: deletedRows[0],
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

  @Post('/bulk-upload')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Bulk upload products' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })

  async bulkUploadProducts(
    @Req() request: express.Request,
    @Res() response: express.Response,
    @UploadedFile() file: Express.Multer.File
  ) {
    try {
      this.eventEmitter.emit(
        'EVENT_PRODUCT_BULK_IMPORT', {
        file: file,
        user_id: request.user.id
      },
      );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        message: 'Successfully import files',
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
