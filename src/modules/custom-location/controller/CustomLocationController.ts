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
  CreateCustomLocationPayloadDto,
  FilterCustomLocationDto,
  UpdateCustomLocationOrderPayloadDto,
  UpdateCustomLocationPayloadDto,
} from '../dto/CustomLocationDto';
import { ICustomLocationService } from '../service/CustomLocationServiceInterface';
import * as express from 'express';
import { CARX_MODULES } from '../../../constants';

@Controller('/v1/custom-location')
@ApiTags('Custom Location')
// @ApiBearerAuth()
export class CustomLocationController extends BaseController {
  constructor(@Inject(ICustomLocationService) private customLocationService: ICustomLocationService) {
    super();
  }

  @Get()
  @ApiOperation({ summary: 'Get CustomLocation List' })
  // @UseGuards(AuthGuard)
  async getCustomLocationList(
    @Query() filterCustomLocationDto: FilterCustomLocationDto,
    @Res() response: express.Response,
  ) {
    try {
      const [customLocations, total] = await Promise.all([
        this.customLocationService.getCustomLocationList(filterCustomLocationDto),
        this.customLocationService.countCustomLocationByCondition(filterCustomLocationDto),
      ]);
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: {
          customLocation_list: customLocations,
          total: total,
        },
      });
      return this.ok(response, result.value);
    } catch (error) {
      const err = Result.fail({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Cannot get customLocation list',
      });
      return this.fail(response, err.error);
    }
  }

  @Post()
  @ApiOperation({ summary: 'Create CustomLocation' })
  @SetMetadata('permission', CARX_MODULES.USER_INTERFACE)
  @UseGuards(AuthGuard, PermissionGuard)
  async createCustomLocation(
    @Res() response: express.Response,
    @Body() payload: CreateCustomLocationPayloadDto,
  ) {
    try {
      const createdCustomLocation = await this.customLocationService.createCustomLocation(payload);
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: createdCustomLocation,
      });
      return this.ok(response, result.value);
    } catch (error) {
      const err = Result.fail({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Cannot create customLocation list',
      });
      return this.fail(response, err.error);
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update CustomLocation' })
  @SetMetadata('permission', CARX_MODULES.USER_INTERFACE)
  @UseGuards(AuthGuard, PermissionGuard)
  async updateCustomLocation(
    @Param('id') id: string,
    @Body() updateCustomLocationDto: UpdateCustomLocationPayloadDto,
    @Res() response: express.Response,
  ) {
    try {
      const updatedCustomLocation = await this.customLocationService.updateCustomLocation(
        id,
        updateCustomLocationDto,
      );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: updatedCustomLocation,
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
  @ApiOperation({ summary: 'Hard delete customLocation' })
  @SetMetadata('permission', CARX_MODULES.USER_INTERFACE)
  @UseGuards(AuthGuard, PermissionGuard)
  async deleteCustomLocation(
    @Param('id') customLocationId: string,
    @Res() response: express.Response,
  ) {
    try {
      const isCustomLocationDeleted = await this.customLocationService.deleteCustomLocation(customLocationId);
      let result = null;
      if (!isCustomLocationDeleted) {
        result = Result.fail({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'CustomLocation not found',
        });
      } else {
        result = Result.ok({
          statusCode: HttpStatus.OK,
          message: 'Successfully deleted customLocation',
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
