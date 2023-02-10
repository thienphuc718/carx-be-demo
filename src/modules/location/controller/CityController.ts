import { FilterCityDto, CreateCityDto, UpdateCityDto } from '../dto/CityDto';
import { ICityService } from '../service/cities/CityServiceInterface';
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

@Controller('/v1/cities')
@ApiExcludeController()
// @ApiTags('Cities')
export class CityController extends BaseController {
  constructor(
    @Inject(ICityService)
    private readonly cityService: ICityService,
  ) {
    super();
  }

  @Get()
  @ApiOperation({ summary: 'Get All Cities' })
  async getAllCities(
    @Res() response: express.Response,
    @Query() getCitiesDto: FilterCityDto,
    @Req() request: express.Request,
  ) {
    try {
      const schema = getSchemaFromUrl(request);
      const { limit, page, ...rest } = getCitiesDto;
      const [cities, total] = await Promise.all([
        this.cityService.getCityList(getCitiesDto, schema),
        this.cityService.countCityByCondition({ ...rest }, schema),
      ]);
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: { cities, total },
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
  @ApiOperation({ summary: 'Get city detail by id' })
  async getCityDetail(
    @Res() response: express.Response,
    @Param('id') cityId: string,
    @Req() request: express.Request,
  ) {
    try {
      const schema = getSchemaFromUrl(request);
      const city = await this.cityService.getCityDetail(cityId, schema);
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: city,
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
  @ApiOperation({ summary: 'Create city' })
  async createNewCity(
    @Res() response: express.Response,
    @Body() createCityDto: CreateCityDto,
    @Req() request: express.Request,
  ) {
    try {
      const schema = getSchemaFromUrl(request);
      const createCity = await this.cityService.createCity(
        createCityDto,
        schema,
      );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: createCity,
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
  @ApiOperation({ summary: 'Update city information' })
  async updateCity(
    @Res() response: express.Response,
    @Body() updateCityDto: UpdateCityDto,
    @Param('id') cityId: string,
    @Req() request: express.Request,
  ) {
    try {
      const schema = getSchemaFromUrl(request);
      const updateCity = await this.cityService.updateCity(
        cityId,
        updateCityDto,
        schema,
      );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: updateCity,
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
  @ApiOperation({ summary: 'Delete city' })
  async deleteCity(
    @Res() response: express.Response,
    @Param('id') cityId: string,
    @Req() request: express.Request,
  ) {
    try {
      const schema = getSchemaFromUrl(request);
      await this.cityService.deleteCity(cityId, schema);
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
