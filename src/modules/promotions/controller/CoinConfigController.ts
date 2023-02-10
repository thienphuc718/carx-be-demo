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
    CreateCoinConfigDto,
    FilterCoinConfigDto,
    UpdateCoinConfigDto,
  } from '../dto/CoinConfigDto';
  import { ICoinConfigService } from '../service/coin-config/CoinConfigServiceInterface';

  // @ApiTags('Coin Configs')
  @ApiExcludeController()
  @Controller('/v1/coin-configs')
  export class CoinConfigController extends BaseController {
    constructor(
      @Inject(ICoinConfigService)
      private readonly coinConfigService: ICoinConfigService,
    ) {
      super();
    }

    @Get()
    @ApiOperation({ summary: 'Get All Coin Configs' })
    async getAllCoinConfigs(
      @Res() response: express.Response,
      @Query() getCoinConfigDto: FilterCoinConfigDto,
      @Req() request: express.Request,
    ) {
      try {
        const coinConfigs = await this.coinConfigService.getCoinConfigList(
          getCoinConfigDto,
        );
        const result = Result.ok({
          statusCode: HttpStatus.OK,
          data: coinConfigs,
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
    @ApiOperation({ summary: 'Get Coin Config Detail' })
    async getCoinConfigDetail(
      @Res() response: express.Response,
      @Param('id') coinConfigId: string,
      @Req() request: express.Request,
    ) {
      try {
        const coinConfig = await this.coinConfigService.getCoinConfigDetail(
          coinConfigId,
        );
        const result = Result.ok({
          statusCode: HttpStatus.OK,
          data: coinConfig,
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
    @ApiOperation({ summary: 'Create Coin Config' })
    async createNewCoinConfig(
      @Res() response: express.Response,
      @Body() createCoinConfigDto: CreateCoinConfigDto,
      @Req() request: express.Request,
    ) {
      try {
        const createdCoinConfig =
          await this.coinConfigService.createCoinConfig(
            createCoinConfigDto,
          );
        const result = Result.ok({
          statusCode: HttpStatus.OK,
          data: createdCoinConfig,
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
    @ApiOperation({ summary: 'Update Coin Config' })
    async updateCoinConfig(
      @Res() response: express.Response,
      @Body() updateCoinConfigDto: UpdateCoinConfigDto,
      @Param('id') coinConfigId: string,
      @Req() request: express.Request,
    ) {
      try {
        const updatedCoinConfig =
          await this.coinConfigService.updateCoinConfig(
            coinConfigId,
            updateCoinConfigDto,
          );
        const result = Result.ok({
          statusCode: HttpStatus.OK,
          data: updatedCoinConfig,
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
    @ApiOperation({ summary: 'Delete A Coin Config' })
    async deleteCoinConfig(
      @Res() response: express.Response,
      @Param('id') coinConfigId: string,
      @Req() request: express.Request,
    ) {
      try {
        await this.coinConfigService.deleteCoinConfig(coinConfigId);
        const result = Result.ok({
          statusCode: HttpStatus.OK,
          message: 'Successfully deleted a coinConfig',
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
