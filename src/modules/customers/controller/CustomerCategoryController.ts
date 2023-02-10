import {
  FilterCustomerCategoryDto,
  CreateCustomerCategoryDto,
  UpdateCustomerCategoryDto,
} from '../dto/CustomerCategoryDto';
import { ICustomerCategoryService } from '../service/customer-category/CustomerCategoryServiceInterface';
import {
  Controller,
  Get,
  Inject,
  Query,
  Req,
  Res,
  HttpStatus,
  Param,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { ApiOperation, ApiTags, ApiExcludeController } from '@nestjs/swagger';
import { BaseController } from '../../../BaseController';
import * as express from 'express';
import { getSchemaFromUrl } from '../../../helpers/jwtHelper';
import { Result } from '../../../results/Result';

@ApiExcludeController()
@Controller('/v1/customer-categories')
// @ApiTags('Customer Categories')
export class CustomerCategoryController extends BaseController {
  constructor(
    @Inject(ICustomerCategoryService)
    private readonly customerCategoryService: ICustomerCategoryService,
  ) {
    super();
  }

  @Get()
  @ApiOperation({ summary: 'Get All CustomerCategorys' })
  async getAllCustomerCategorys(
    @Res() response: express.Response,
    @Query() getCustomerCategorysDto: FilterCustomerCategoryDto,
    @Req() request: express.Request,
  ) {
    try {
      const schema = getSchemaFromUrl(request);
      const { limit, page, ...rest } = getCustomerCategorysDto;
      const [customerCategories, total] = await Promise.all([
        this.customerCategoryService.getCustomerCategoryList(
          getCustomerCategorysDto,
          schema,
        ),
        this.customerCategoryService.countCustomerCategoryByCondition(
          { ...rest },
          schema,
        ),
      ]);
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: { customerCategories, total },
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
  @ApiOperation({ summary: 'Get customerCategory detail by id' })
  async getCustomerCategoryDetail(
    @Res() response: express.Response,
    @Param('id') customerCategoryId: string,
    @Req() request: express.Request,
  ) {
    try {
      const schema = getSchemaFromUrl(request);
      const customerCategory =
        await this.customerCategoryService.getCustomerCategoryDetail(
          customerCategoryId,
          schema,
        );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: customerCategory,
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
  @ApiOperation({ summary: 'Create customerCategory' })
  async createNewCustomerCategory(
    @Res() response: express.Response,
    @Body() createCustomerCategoryDto: CreateCustomerCategoryDto,
    @Req() request: express.Request,
  ) {
    try {
      const schema = getSchemaFromUrl(request);
      const createCustomerCategory =
        await this.customerCategoryService.createCustomerCategory(
          createCustomerCategoryDto,
          schema,
        );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: createCustomerCategory,
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
  @ApiOperation({ summary: 'Update customerCategory information' })
  async updateCustomerCategory(
    @Res() response: express.Response,
    @Body() updateCustomerCategoryDto: UpdateCustomerCategoryDto,
    @Param('id') customerCategoryId: string,
    @Req() request: express.Request,
  ) {
    try {
      const schema = getSchemaFromUrl(request);
      const updateCustomerCategory =
        await this.customerCategoryService.updateCustomerCategory(
          customerCategoryId,
          updateCustomerCategoryDto,
          schema,
        );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: updateCustomerCategory,
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
  @ApiOperation({ summary: 'Delete customerCategory' })
  async deleteCustomerCategory(
    @Res() response: express.Response,
    @Param('id') customerCategoryId: string,
    @Req() request: express.Request,
  ) {
    try {
      const schema = getSchemaFromUrl(request);
      await this.customerCategoryService.deleteCustomerCategory(
        customerCategoryId,
        schema,
      );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        message: 'success',
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
