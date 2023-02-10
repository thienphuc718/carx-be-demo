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
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BaseController } from '../../../BaseController';
import { AuthGuard, PermissionGuard } from '../../../guards';
import { IPopUpService } from '../service/PopUpServiceInterface';
import * as express from 'express';
import { Result } from '../../../results/Result';
import { CreatePopUpPayloadDto, UpdatePopUpPayloadDto } from '../dto/PopUpDto';
import { CARX_MODULES } from '../../../constants';

@Controller('/v1/popups')
@ApiTags('PopUps')
@ApiBearerAuth()
export class PopUpController extends BaseController {
  constructor(@Inject(IPopUpService) private popupService: IPopUpService) {
    super();
  }

  @Get()
  @ApiOperation({ summary: 'Get All Pop-ups' })
  @UseGuards(AuthGuard)
  async getPopUpList(
    // @Query() filterPopUpDto: FilterPopUpDto,
    @Res() response: express.Response,
  ) {
    try {
      const popups = await this.popupService.getPopUpList();
      const total = await this.popupService.countPopUpByCondition({});
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: {
          pop_up_list: popups,
          total: total,
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

  @Put(':id')
  @ApiOperation({ summary: 'Update Pop Ups' })
  @SetMetadata('permission', CARX_MODULES.USER_INTERFACE)
  @UseGuards(AuthGuard, PermissionGuard)
  async updatePopUp(
    @Res() response: express.Response,
    @Body() updatePopUpDto: UpdatePopUpPayloadDto,
    @Param('id') popUpId: string,
  ) {
    try {
      const updatedPopUp = await this.popupService.updatePopUp(
        popUpId,
        updatePopUpDto,
      );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: updatedPopUp,
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
  @ApiOperation({ summary: 'Create Pop-up' })
  @SetMetadata('permission', CARX_MODULES.USER_INTERFACE)
  @UseGuards(AuthGuard, PermissionGuard)
  async createPopUp(
    @Res() response: express.Response,
    @Body() createPopUpDto: CreatePopUpPayloadDto,
  ) {
    try {
      const createdPopUp = await this.popupService.createPopUp(createPopUpDto);
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: createdPopUp,
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
  @ApiOperation({ summary: 'Delete Pop-up' })
  @SetMetadata('permission', CARX_MODULES.USER_INTERFACE)
  @UseGuards(AuthGuard, PermissionGuard)
  async deletePopup(
    @Res() response: express.Response,
    @Param('id') popUpId: string,
  ) {
    try {
      const isPopUpDeleted = await this.popupService.deletePopUpById(popUpId);
      let result = null;
      if (isPopUpDeleted) {
        result = Result.ok({
          statusCode: HttpStatus.OK,
          message: 'Pop-up deleted successfully',
        });
        return this.ok(response, result.value);
      } else {
        result = Result.fail({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Cannot delete Pop-up',
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
