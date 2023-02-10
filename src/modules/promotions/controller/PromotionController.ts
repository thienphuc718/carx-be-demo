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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import * as express from 'express';
import { BaseController } from '../../../BaseController';
import { Result } from '../../../results/Result';
import { AuthGuard } from '../../../guards';

import {
  CreatePromotionPayloadDto,
  FilterPromotionDto,
  UpdatePromotionPayloadDto,
} from '../dto/PromotionDto';
import { IPromotionService } from '../service/promotion/PromotionServiceInterface';

@ApiTags('Promotions')
@Controller('/v1/promotions')
// @ApiExcludeController()
export class PromotionController extends BaseController {
  constructor(
    @Inject(IPromotionService)
    private readonly promotionService: IPromotionService,
  ) {
    super();
  }

  @Get()
  @ApiOperation({ summary: 'Get All Promotions' })
  async getAllPromotions(
    @Res() response: express.Response,
    @Query() getPromotionDto: FilterPromotionDto,
  ) {
    try {
      const [total, promotions] = await this.promotionService.getPromotionList(
        getPromotionDto,
      );
      let data = promotions.map((promotion) => promotion.transformToResponse());
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: { 
          promotion_list: data, 
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
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get Promotion Detail' })
  async getPromotionDetail(
    @Res() response: express.Response,
    @Param('id') promotionId: string,
  ) {
    try {
      const promotion = await this.promotionService.getPromotionDetail(
        promotionId,
      )
      if (!promotion) {
        return this.fail(response, Result.fail({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Promotion not found'
        }).error)
      }
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: promotion.transformToResponse(),
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
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Create Promotion' })
  async createNewPromotion(
    @Res() response: express.Response,
    @Body() createPromotionDto: CreatePromotionPayloadDto,
  ) {
    try {
      const createdPromotion = await this.promotionService.createPromotion(
        createPromotionDto,
      );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: createdPromotion.transformToResponse(),
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
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update Promotion' })
  async updatePromotion(
    @Res() response: express.Response,
    @Body() updatePromotionDto: UpdatePromotionPayloadDto,
    @Param('id') promotionId: string,
  ) {
    try {
      const updatedPromotion = await this.promotionService.updatePromotion(
        promotionId,
        updatePromotionDto,
      );
      let result = null;
      if (updatedPromotion) {
        result = Result.ok({
          statusCode: HttpStatus.OK,
          message: 'Successfully update promotion',
        });
      } else {
        result = Result.ok({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Failed to update promotion',
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

  @Delete('/delete')
  @ApiOperation({ summary: 'Delete multiple Promotions' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async deleteMultiPromotions(
    @Res() response: express.Response,
    @Body() deleteIds: string[],
  ) {
    try {
      console.log(deleteIds);
      await this.promotionService.deleteMultiPromotions(deleteIds);
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        message: 'Successfully deleted promotions',
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
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Delete A Promotion' })
  async deletePromotion(
    @Res() response: express.Response,
    @Param('id') promotionId: string,
  ) {
    try {
      await this.promotionService.deletePromotion(promotionId);
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        message: 'Successfully deleted a promotion',
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
