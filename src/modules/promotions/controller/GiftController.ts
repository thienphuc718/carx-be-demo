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

import { CreateGiftDto, FilterGiftDto, UpdateGiftDto } from '../dto/GiftDto';
import { IGiftService } from '../service/gift/GiftServiceInterface';

@ApiTags('Gifts')
@ApiExcludeController()
@Controller('/v1/gifts')
export class GiftController extends BaseController {
  constructor(
    @Inject(IGiftService)
    private readonly promotionApplyService: IGiftService,
  ) {
    super();
  }

  @Get()
  @ApiOperation({ summary: 'Get All Gifts' })
  async getAllGifts(
    @Res() response: express.Response,
    @Query() getGiftDto: FilterGiftDto,
    @Req() request: express.Request,
  ) {
    try {
      const promotionApplys = await this.promotionApplyService.getGiftList(
        getGiftDto,
      );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: promotionApplys,
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
  @ApiOperation({ summary: 'Get Gift Detail' })
  async getGiftDetail(
    @Res() response: express.Response,
    @Param('id') promotionApplyId: string,
    @Req() request: express.Request,
  ) {
    try {
      const promotionApply = await this.promotionApplyService.getGiftDetail(
        promotionApplyId,
      );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: promotionApply,
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
  @ApiOperation({ summary: 'Create Gift' })
  async createNewGift(
    @Res() response: express.Response,
    @Body() createGiftDto: CreateGiftDto,
    @Req() request: express.Request,
  ) {
    try {
      const createdGift = await this.promotionApplyService.createGift(
        createGiftDto,
      );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: createdGift,
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
  @ApiOperation({ summary: 'Update Gift' })
  async updateGift(
    @Res() response: express.Response,
    @Body() updateGiftDto: UpdateGiftDto,
    @Param('id') promotionApplyId: string,
    @Req() request: express.Request,
  ) {
    try {
      const updatedGift = await this.promotionApplyService.updateGift(
        promotionApplyId,
        updateGiftDto,
      );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: updatedGift,
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
  @ApiOperation({ summary: 'Delete A Gift' })
  async deleteGift(
    @Res() response: express.Response,
    @Param('id') promotionApplyId: string,
    @Req() request: express.Request,
  ) {
    try {
      await this.promotionApplyService.deleteGift(promotionApplyId);
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        message: 'Successfully deleted a promotionApply',
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
