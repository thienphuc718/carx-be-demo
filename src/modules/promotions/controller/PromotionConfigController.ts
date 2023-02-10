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
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiExcludeController } from '@nestjs/swagger';
import * as express from 'express';
import { BaseController } from '../../../BaseController';
import { Result } from '../../../results/Result';
import { AuthGuard } from '../../../guards';

import {
  CreatePromotionConfigDto,
  FilterPromotionConfigDto,
  UpdatePromotionConfigDto,
} from '../dto/PromotionConfigDto';
import { IPromotionConfigService } from '../service/promotion-config/PromotionConfigServiceInterface';

@ApiTags('Promotion Configs')
@Controller('/v1/promotion-configs')
@ApiExcludeController()
export class PromotionConfigController extends BaseController {
  constructor(
    @Inject(IPromotionConfigService)
    private readonly promotionConfigService: IPromotionConfigService,
  ) {
    super();
  }

  @Get()
  @ApiOperation({ summary: 'Get All Promotion Configs' })
  async getAllPromotionConfigs(
    @Res() response: express.Response,
    @Query() getPromotionConfigDto: FilterPromotionConfigDto,
    @Req() request: express.Request,
  ) {
    try {
      const promotionConfigs = await this.promotionConfigService.getPromotionConfigList(
        getPromotionConfigDto,
      );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: promotionConfigs,
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
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get Promotion Config Detail' })
  async getPromotionConfigDetail(
    @Res() response: express.Response,
    @Param('id') promotionConfigId: string,
    @Req() request: express.Request,
  ) {
    try {
      const promotionConfig = await this.promotionConfigService.getPromotionConfigDetail(
        promotionConfigId,
      );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: promotionConfig,
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
  @ApiOperation({ summary: 'Create Promotion Config' })
  async createNewPromotionConfig(
    @Res() response: express.Response,
    @Body() createPromotionConfigDto: CreatePromotionConfigDto,
    @Req() request: express.Request,
  ) {
    try {
      const createdPromotionConfig =
        await this.promotionConfigService.createPromotionConfig(
          createPromotionConfigDto,
        );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: createdPromotionConfig,
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
  @ApiOperation({ summary: 'Update Promotion Config' })
  async updatePromotionConfig(
    @Res() response: express.Response,
    @Body() updatePromotionConfigDto: UpdatePromotionConfigDto,
    @Param('id') promotionConfigId: string,
    @Req() request: express.Request,
  ) {
    try {
      const updatedPromotionConfig =
        await this.promotionConfigService.updatePromotionConfig(
          promotionConfigId,
          updatePromotionConfigDto,
        );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: updatedPromotionConfig,
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
  @ApiOperation({ summary: 'Delete A Promotion Config' })
  async deletePromotionConfig(
    @Res() response: express.Response,
    @Param('id') promotionConfigId: string,
    @Req() request: express.Request,
  ) {
    try {
      await this.promotionConfigService.deletePromotionConfig(promotionConfigId);
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        message: 'Successfully deleted a promotionConfig',
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
