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
import { IDistrictService } from '../service/districts/DistrictServiceInterface';
import {
  CreateDistrictDto,
  FilterDistrictDto,
  UpdateDistrictDto,
} from '../dto/DistrictDto';

@Controller('/v1/districts')
@ApiTags('Districts')
@ApiExcludeController()
export class DistrictController extends BaseController {
  constructor(
    @Inject(IDistrictService)
    private readonly districtService: IDistrictService,
  ) {
    super();
  }

  @Get()
  @ApiOperation({
    summary: 'Get All Districts, get all district by name or city_id',
  })
  async getAllDistricts(
    @Res() response: express.Response,
    @Query() getDistrictDto: FilterDistrictDto,
    @Req() request: express.Request,
  ) {
    try {
      const schema = getSchemaFromUrl(request);
      const { limit, page, ...rest } = getDistrictDto;
      const [districts, total] = await Promise.all([
        this.districtService.getDistrictList(getDistrictDto, schema),
        this.districtService.countDistrictByCondition({ ...rest }, schema),
      ]);
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: { districts, total },
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
  @ApiOperation({ summary: 'Get district detail by id' })
  async getDistrictDetail(
    @Res() response: express.Response,
    @Param('id') districtId: string,
    @Req() request: express.Request,
  ) {
    try {
      const schema = getSchemaFromUrl(request);
      const district = await this.districtService.getDistrictDetail(
        districtId,
        schema,
      );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: district,
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
  @ApiOperation({ summary: 'Create district' })
  async createNewDistrict(
    @Res() response: express.Response,
    @Body() createDistrictDto: CreateDistrictDto,
    @Req() request: express.Request,
  ) {
    try {
      const schema = getSchemaFromUrl(request);
      const createDistrict = await this.districtService.createDistrict(
        createDistrictDto,
        schema,
      );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: createDistrict,
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
  @ApiOperation({ summary: 'Update district information' })
  async updateDistrict(
    @Res() response: express.Response,
    @Body() updateDistrictDto: UpdateDistrictDto,
    @Param('id') districtId: string,
    @Req() request: express.Request,
  ) {
    try {
      const schema = getSchemaFromUrl(request);
      const updateDistrict = await this.districtService.updateDistrict(
        districtId,
        updateDistrictDto,
        schema,
      );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: updateDistrict,
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
  @ApiOperation({ summary: 'Delete district' })
  async deleteDistrict(
    @Res() response: express.Response,
    @Param('id') districtId: string,
    @Req() request: express.Request,
  ) {
    try {
      const schema = getSchemaFromUrl(request);
      await this.districtService.deleteDistrict(districtId, schema);
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
