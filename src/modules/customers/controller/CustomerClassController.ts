import {
  FilterCustomerClassDto,
  CreateCustomerClassDto,
  UpdateCustomerClassDto,
} from '../dto/CustomerClassDto';
import { ICustomerClassService } from '../service/customer-class/CustomerClassServiceInterface';
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

@Controller('/v1/customer-classes')
// @ApiExcludeController()
@ApiTags('Customer Classes')
export class CustomerClassController extends BaseController {
  constructor(
    @Inject(ICustomerClassService)
    private readonly customerClassService: ICustomerClassService,
  ) {
    super();
  }

  @Get()
  @ApiOperation({ summary: 'Get All CustomerClasses' })
  async getAllCustomerClasses(
    @Res() response: express.Response,
    @Query() getCustomerClassesDto: FilterCustomerClassDto,
    @Req() request: express.Request,
  ) {
    try {
      const schema = getSchemaFromUrl(request);
      const { limit, page, ...rest } = getCustomerClassesDto;
      const [customerClasses, total] = await Promise.all([
        this.customerClassService.getCustomerClassList(
          getCustomerClassesDto,
          schema,
        ),
        this.customerClassService.countCustomerClassByCondition(
          { ...rest },
          schema,
        ),
      ]);
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: { customerClasses, total },
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
  @ApiOperation({ summary: 'Get customerClass detail by id' })
  async getCustomerClassDetail(
    @Res() response: express.Response,
    @Param('id') customerClassId: string,
    @Req() request: express.Request,
  ) {
    try {
      const schema = getSchemaFromUrl(request);
      const customerClass =
        await this.customerClassService.getCustomerClassDetail(
          customerClassId,
          schema,
        );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: customerClass,
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
  @ApiOperation({ summary: 'Create customerClass' })
  async createNewCustomerClass(
    @Res() response: express.Response,
    @Body() createCustomerClassDto: CreateCustomerClassDto,
    @Req() request: express.Request,
  ) {
    try {
      const schema = getSchemaFromUrl(request);
      const createCustomerClass =
        await this.customerClassService.createCustomerClass(
          createCustomerClassDto,
          schema,
        );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: createCustomerClass,
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
  @ApiOperation({ summary: 'Update customerClass information' })
  async updateCustomerClass(
    @Res() response: express.Response,
    @Body() updateCustomerClassDto: UpdateCustomerClassDto,
    @Param('id') customerClassId: string,
    @Req() request: express.Request,
  ) {
    try {
      const schema = getSchemaFromUrl(request);
      const updateCustomerClass =
        await this.customerClassService.updateCustomerClass(
          customerClassId,
          updateCustomerClassDto,
          schema,
        );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: updateCustomerClass,
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
  @ApiOperation({ summary: 'Delete customerClass' })
  async deleteCustomerClass(
    @Res() response: express.Response,
    @Param('id') customerClassId: string,
    @Req() request: express.Request,
  ) {
    try {
      const schema = getSchemaFromUrl(request);
      await this.customerClassService.deleteCustomerClass(
        customerClassId,
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
