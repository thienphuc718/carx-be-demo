import {
  FilterCustomerDto,
  CreateCustomerDto,
  UpdateCustomerDto,
} from '../dto/CustomerDto';
import { ICustomerService } from '../service/customer/CustomerServiceInterface';
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

@Controller('/v1/customers')
// @ApiExcludeController()
@ApiTags('Customers')
export class CustomerController extends BaseController {
  constructor(
    @Inject(ICustomerService)
    private readonly customerService: ICustomerService,
  ) {
    super();
  }

  @Get()
  @ApiOperation({ summary: 'Get All Customers' })
  async getAllCustomers(
    @Res() response: express.Response,
    @Query() getCustomersDto: FilterCustomerDto,
    @Req() request: express.Request,
  ) {
    try {
      const schema = getSchemaFromUrl(request);
      const { limit, page, ...rest } = getCustomersDto;
      const [customers, total] = await Promise.all([
        this.customerService.getCustomerList(getCustomersDto, schema),
        this.customerService.countCustomerByCondition({ ...rest }, schema),
      ]);
      const responseData = customers.map( customer => customer.transformToResponse())
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: {
          customers: responseData,
          total: total
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
  @ApiOperation({ summary: 'Get customer detail by id' })
  async getCustomerDetail(
    @Res() response: express.Response,
    @Param('id') customerId: string,
    @Req() request: express.Request,
  ) {
    try {
      const schema = getSchemaFromUrl(request);
      const customer = await this.customerService.getCustomerDetail(
        customerId,
        schema,
      );
      if (!customer) {
        const err = Result.fail({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Customer Not found',
        });
        return this.fail(response, err.error);
      }
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: customer.transformToResponse(),
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
  @ApiOperation({ summary: 'Create customer' })
  async createNewCustomer(
    @Res() response: express.Response,
    @Body() createCustomerDto: CreateCustomerDto,
    @Req() request: express.Request,
  ) {
    try {
      const schema = getSchemaFromUrl(request);
      const createCustomer = await this.customerService.createCustomer(
        createCustomerDto,
        schema,
      );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: createCustomer,
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
  @ApiOperation({ summary: 'Update customer information' })
  async updateCustomer(
    @Res() response: express.Response,
    @Body() updateCustomerDto: UpdateCustomerDto,
    @Param('id') customerId: string,
    @Req() request: express.Request,
  ) {
    try {
      const schema = getSchemaFromUrl(request);
      const updateCustomer = await this.customerService.updateCustomer(
        customerId,
        updateCustomerDto,
        schema,
      );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: updateCustomer,
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

  @Delete(':id')
  @ApiOperation({ summary: 'Delete customer' })
  async deleteCustomer(
    @Res() response: express.Response,
    @Param('id') customerId: string,
    @Req() request: express.Request,
  ) {
    try {
      const schema = getSchemaFromUrl(request);
      const isCustomerDeleted = await this.customerService.deleteCustomer(
        customerId,
        schema,
      );
      let result: any = {};
      if (isCustomerDeleted) {
        result = Result.ok({
          statusCode: HttpStatus.OK,
          message: 'Successfully deleted customer',
        });
        return this.ok(response, result.value);
      } else {
        result = Result.fail({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Cannot delete customer',
        });
        return this.fail(response, result.error);
      }
    } catch (error) {
      const err = Result.fail({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
      return this.fail(response, err.error);
    }
  }
}
