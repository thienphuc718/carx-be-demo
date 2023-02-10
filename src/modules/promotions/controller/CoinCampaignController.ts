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
  CreateCoinCampaignDto,
  FilterCoinCampaignDto,
  UpdateCoinCampaignDto,
} from '../dto/CoinCampaignDto';
import { ICoinCampaignService } from '../service/coin-campaign/CoinCampaignServiceInterface';

// @ApiTags('Coin Campaigns')
@ApiExcludeController()
@Controller('/v1/coin-campaigns')
export class CoinCampaignController extends BaseController {
  constructor(
    @Inject(ICoinCampaignService)
    private readonly coinCampaignService: ICoinCampaignService,
  ) {
    super();
  }

  @Get()
  @ApiOperation({ summary: 'Get All Coin Campaigns' })
  async getAllCoinCampaigns(
    @Res() response: express.Response,
    @Query() getCoinCampaignDto: FilterCoinCampaignDto,
    @Req() request: express.Request,
  ) {
    try {
      const coinCampaigns = await this.coinCampaignService.getCoinCampaignList(
        getCoinCampaignDto,
      );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: coinCampaigns,
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
  @ApiOperation({ summary: 'Get Coin Campaign Detail' })
  async getCoinCampaignDetail(
    @Res() response: express.Response,
    @Param('id') coinCampaignId: string,
    @Req() request: express.Request,
  ) {
    try {
      const coinCampaign = await this.coinCampaignService.getCoinCampaignDetail(
        coinCampaignId,
      );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: coinCampaign,
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
  @ApiOperation({ summary: 'Create Coin Campaign' })
  async createNewCoinCampaign(
    @Res() response: express.Response,
    @Body() createCoinCampaignDto: CreateCoinCampaignDto,
    @Req() request: express.Request,
  ) {
    try {
      const createdCoinCampaign =
        await this.coinCampaignService.createCoinCampaign(
          createCoinCampaignDto,
        );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: createdCoinCampaign,
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
  @ApiOperation({ summary: 'Update Coin Campaign' })
  async updateCoinCampaign(
    @Res() response: express.Response,
    @Body() updateCoinCampaignDto: UpdateCoinCampaignDto,
    @Param('id') coinCampaignId: string,
    @Req() request: express.Request,
  ) {
    try {
      const updatedCoinCampaign =
        await this.coinCampaignService.updateCoinCampaign(
          coinCampaignId,
          updateCoinCampaignDto,
        );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: updatedCoinCampaign,
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
  @ApiOperation({ summary: 'Delete A Coin Campaign' })
  async deleteCoinCampaign(
    @Res() response: express.Response,
    @Param('id') coinCampaignId: string,
    @Req() request: express.Request,
  ) {
    try {
      await this.coinCampaignService.deleteCoinCampaign(coinCampaignId);
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        message: 'Successfully deleted a coinCampaign',
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
