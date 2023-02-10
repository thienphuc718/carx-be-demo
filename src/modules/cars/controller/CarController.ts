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
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags, ApiExcludeController, ApiBearerAuth } from '@nestjs/swagger';
import { BaseController } from '../../../BaseController';
import { ICarService } from '../service/CarServiceInterface';
import * as express from 'express';
import {
  CreateCarPayloadDto,
  FilterCarDto,
  UpdateCarPayloadDto,
} from '../dto/CarDto';
import { Result } from '../../../results/Result';
import { CarConstants } from '../../../constants/CarConstants';
import { AuthGuard } from '../../../guards';

@ApiTags('Cars')
// @ApiExcludeController()
@Controller('/v1/cars')
export class CarController extends BaseController {
  constructor(
    @Inject(ICarService)
    private readonly carService: ICarService,
  ) {
    super();
  }

  // @Get()
  // @ApiOperation({ summary: 'Get All Cars' })
  // async getAllCars(
  //   @Res() response: express.Response,
  //   @Query() getCarsDto: FilterCarDto,
  // ) {
  //   try {
  //     const cars = await this.carService.getCarList(
  //       getCarsDto,
  //     );
  //     const result = Result.ok({
  //       statusCode: HttpStatus.OK,
  //       data: cars,
  //     });
  //     return this.ok(response, result.value);
  //   } catch (error) {
  //     const err = Result.fail({
  //       statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  //       message: error.message,
  //     });
  //     return this.fail(response, err.error);
  //   }
  // }

  @Get('/information')
  @ApiOperation({ summary: 'Get All Car Information' })
  async getAllCarInformation(
    @Res() response: express.Response,
  ) {
    try {
      let data = new CarConstants();
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: data.brandList,
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

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get Car Detail' })
  async getCarDetail(
    @Res() response: express.Response,
    @Param('id') carId: string,
  ) {
    try {
      const car = await this.carService.getCarDetail(carId);
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: car,
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

  // @Post()
  // @ApiOperation({ summary: 'Create Car' })
  // async createNewCar(
  //   @Res() response: express.Response,
  //   @Body() createCarDto: CreateCarPayloadDto,
  // ) {
  //   try {
  //     const createdCar = await this.carService.createCar(
  //       createCarDto,
  //     );
  //     const result = Result.ok({
  //       statusCode: HttpStatus.OK,
  //       data: createdCar.transformToResponse(),
  //     });
  //     return this.ok(response, result.value);
  //   } catch (error) {
  //     const err = Result.fail({
  //       statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  //       message: error.message,
  //     });
  //     return this.fail(response, err.error);
  //   }
  // }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Put(':id')
  @ApiOperation({ summary: 'Update Car' })
  async updateCar(
    @Res() response: express.Response,
    @Body() updateCarDto: UpdateCarPayloadDto,
    @Param('id') carId: string,
  ) {
    try {
      let result;
      const updatedCar = await this.carService.updateCar(carId, updateCarDto);
      if (updatedCar) {
        result = Result.ok({
          statusCode: HttpStatus.OK,
          message: 'Successfully update car info',
        });
      } else {
        result = Result.ok({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Failed to update car info',
        });
      }
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

  // @Delete(':id')
  // @ApiOperation({ summary: 'Delete A Car' })
  // async deleteCar(
  //   @Res() response: express.Response,
  //   @Param('id') carId: string,
  // ) {
  //   try {
  //     await this.carService.deleteCar(carId);
  //     const result = Result.ok({
  //       statusCode: HttpStatus.OK,
  //       message: 'Successfully deleted a car',
  //     });
  //     return this.ok(response, result.value);
  //   } catch (error) {
  //     const err = Result.fail({
  //       statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  //       message: error.message,
  //     });
  //     return this.fail(response, err.error);
  //   }
  // }
}
