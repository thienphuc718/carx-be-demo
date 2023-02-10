import {
  FilterCustomerClubDto,
  CreateCustomerClubDto,
  UpdateCustomerClubDto,
} from '../dto/CustomerClubDto';
import { ICustomerClubService } from '../service/customer-club/CustomerClubServiceInterface';
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

@Controller('/v1/customer-clubs')
@ApiExcludeController()
// @ApiTags('Customer Clubs')
export class CustomerClubController extends BaseController {
  constructor(
    @Inject(ICustomerClubService)
    private readonly customerClubService: ICustomerClubService,
  ) {
    super();
  }

  @Get()
  @ApiOperation({ summary: 'Get All CustomerClubs' })
  async getAllCustomerClubs(
    @Res() response: express.Response,
    @Query() getCustomerClubsDto: FilterCustomerClubDto,
    @Req() request: express.Request,
  ) {
    try {
      const schema = getSchemaFromUrl(request);
      const { limit, page, ...rest } = getCustomerClubsDto;
      const [customerClubs, total] = await Promise.all([
        this.customerClubService.getCustomerClubList(
          getCustomerClubsDto,
          schema,
        ),
        this.customerClubService.countCustomerClubByCondition(
          { ...rest },
          schema,
        ),
      ]);
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: { customerClubs, total },
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
  @ApiOperation({ summary: 'Get customerClub detail by id' })
  async getCustomerClubDetail(
    @Res() response: express.Response,
    @Param('id') customerClubId: string,
    @Req() request: express.Request,
  ) {
    try {
      const schema = getSchemaFromUrl(request);
      const customerClub = await this.customerClubService.getCustomerClubDetail(
        customerClubId,
        schema,
      );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: customerClub,
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
  @ApiOperation({ summary: 'Create customerClub' })
  async createNewCustomerClub(
    @Res() response: express.Response,
    @Body() createCustomerClubDto: CreateCustomerClubDto,
    @Req() request: express.Request,
  ) {
    try {
      const schema = getSchemaFromUrl(request);
      const createCustomerClub =
        await this.customerClubService.createCustomerClub(
          createCustomerClubDto,
          schema,
        );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: createCustomerClub,
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
  @ApiOperation({ summary: 'Update customerClub information' })
  async updateCustomerClub(
    @Res() response: express.Response,
    @Body() updateCustomerClubDto: UpdateCustomerClubDto,
    @Param('id') customerClubId: string,
    @Req() request: express.Request,
  ) {
    try {
      const schema = getSchemaFromUrl(request);
      const updateCustomerClub =
        await this.customerClubService.updateCustomerClub(
          customerClubId,
          updateCustomerClubDto,
          schema,
        );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: updateCustomerClub,
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
  @ApiOperation({ summary: 'Delete customerClub' })
  async deleteCustomerClub(
    @Res() response: express.Response,
    @Param('id') customerClubId: string,
    @Req() request: express.Request,
  ) {
    try {
      const schema = getSchemaFromUrl(request);
      await this.customerClubService.deleteCustomerClub(customerClubId, schema);
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
