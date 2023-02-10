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
  CreatePromotionApplyDto,
  FilterPromotionApplyDto,
  UpdatePromotionApplyDto,
} from '../dto/PromotionApplyDto';
import { IPromotionApplyService } from '../service/promotion-apply/PromotionApplyServiceInterface';

@ApiTags('Promotion Applies')
@ApiExcludeController()
@Controller('/v1/promotion-applies')
export class PromotionApplyController extends BaseController {
  constructor(
    @Inject(IPromotionApplyService)
    private readonly promotionApplyService: IPromotionApplyService,
  ) {
    super();
  }

  @Get()
  @ApiOperation({ summary: 'Get All Promotion Applies' })
  async getAllPromotionApplys(
    @Res() response: express.Response,
    @Query() getPromotionApplyDto: FilterPromotionApplyDto,
    @Req() request: express.Request,
  ) {
    try {
      const promotionApplys = await this.promotionApplyService.getPromotionApplyList(
        getPromotionApplyDto,
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
  @ApiOperation({ summary: 'Get Promotion Apply Detail' })
  async getPromotionApplyDetail(
    @Res() response: express.Response,
    @Param('id') promotionApplyId: string,
    @Req() request: express.Request,
  ) {
    try {
      const promotionApply = await this.promotionApplyService.getPromotionApplyDetail(
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
  @ApiOperation({ summary: 'Create Promotion Apply' })
  async createNewPromotionApply(
    @Res() response: express.Response,
    @Body() createPromotionApplyDto: CreatePromotionApplyDto,
    @Req() request: express.Request,
  ) {
    try {
      const createdPromotionApply =
        await this.promotionApplyService.createPromotionApply(
          createPromotionApplyDto,
        );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: createdPromotionApply,
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
  @ApiOperation({ summary: 'Update Promotion Apply' })
  async updatePromotionApply(
    @Res() response: express.Response,
    @Body() updatePromotionApplyDto: UpdatePromotionApplyDto,
    @Param('id') promotionApplyId: string,
    @Req() request: express.Request,
  ) {
    try {
      const updatedPromotionApply =
        await this.promotionApplyService.updatePromotionApply(
          promotionApplyId,
          updatePromotionApplyDto,
        );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: updatedPromotionApply,
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
  @ApiOperation({ summary: 'Delete A Promotion Apply' })
  async deletePromotionApply(
    @Res() response: express.Response,
    @Param('id') promotionApplyId: string,
    @Req() request: express.Request,
  ) {
    try {
      await this.promotionApplyService.deletePromotionApply(promotionApplyId);
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
