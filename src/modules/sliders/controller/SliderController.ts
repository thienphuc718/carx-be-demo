import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Res,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BaseController } from '../../../BaseController';
import { AuthGuard, PermissionGuard } from '../../../guards';
import { Result } from '../../../results/Result';
import {
  CreateSliderPayloadDto,
  FilterSliderDto,
  UpdateSliderOrderPayloadDto,
  UpdateSliderPayloadDto,
} from '../dto/SliderDto';
import { ISliderService } from '../service/SliderServiceInterface';
import * as express from 'express';
import { CARX_MODULES } from '../../../constants';

@Controller('/v1/sliders')
@ApiTags('Sliders')
// @ApiBearerAuth()
export class SliderController extends BaseController {
  constructor(@Inject(ISliderService) private sliderService: ISliderService) {
    super();
  }

  @Get()
  @ApiOperation({ summary: 'Get Slider List' })
  // @UseGuards(AuthGuard)
  async getSliderList(
    @Query() filterSliderDto: FilterSliderDto,
    @Res() response: express.Response,
  ) {
    try {
      const [sliders, total] = await Promise.all([
        this.sliderService.getSliderList(filterSliderDto),
        this.sliderService.countSliderByCondition(filterSliderDto),
      ]);
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: {
          slider_list: sliders,
          total: total,
        },
      });
      return this.ok(response, result.value);
    } catch (error) {
      const err = Result.fail({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Cannot get slider list',
      });
      return this.fail(response, err.error);
    }
  }

  @Post()
  @ApiOperation({ summary: 'Create Slider' })
  @SetMetadata('permission', CARX_MODULES.USER_INTERFACE)
  @UseGuards(AuthGuard, PermissionGuard)
  async createSlider(
    @Res() response: express.Response,
    @Body() payload: CreateSliderPayloadDto,
  ) {
    try {
      const createdSlider = await this.sliderService.createSlider(payload);
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: createdSlider,
      });
      return this.ok(response, result.value);
    } catch (error) {
      const err = Result.fail({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Cannot create slider list',
      });
      return this.fail(response, err.error);
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update Slider' })
  @SetMetadata('permission', CARX_MODULES.USER_INTERFACE)
  @UseGuards(AuthGuard, PermissionGuard)
  async updateSlider(
    @Param('id') id: string,
    @Body() updateSliderDto: UpdateSliderPayloadDto,
    @Res() response: express.Response,
  ) {
    try {
      const updatedSlider = await this.sliderService.updateSlider(
        id,
        updateSliderDto,
      );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: updatedSlider,
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

  @Patch('/:id/orders')
  @ApiOperation({ summary: 'Update Slider Order' })
  @SetMetadata('permission', CARX_MODULES.USER_INTERFACE)
  @UseGuards(AuthGuard, PermissionGuard)
  async updateSliderOrder(
    @Param('id') id: string,
    @Body() updateSliderDto: UpdateSliderOrderPayloadDto,
    @Res() response: express.Response,
  ) {
    try {
      const updatedSlider = await this.sliderService.updateSliderOrder(id, updateSliderDto);
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: updatedSlider,
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
  @ApiOperation({ summary: 'Hard delete slider' })
  @SetMetadata('permission', CARX_MODULES.USER_INTERFACE)
  @UseGuards(AuthGuard, PermissionGuard)
  async deleteSlider(
    @Param('id') sliderId: string,
    @Res() response: express.Response,
  ) {
    try {
      const isSliderDeleted = await this.sliderService.deleteSlider(sliderId);
      let result = null;
      if (!isSliderDeleted) {
        result = Result.fail({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Slider not found',
        });
      } else {
        result = Result.ok({
          statusCode: HttpStatus.OK,
          message: 'Successfully deleted slider',
        });
      }
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
