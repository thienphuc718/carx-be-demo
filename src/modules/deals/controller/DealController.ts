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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BaseController } from '../../../BaseController';
import { CreateDealDto, FilterDealDto, UpdateDealDto } from '../dto/DealDto';
import { IDealService } from '../service/DealServiceInterface';
import * as express from 'express';
import { Result } from '../../../results/Result';
import { AuthGuard } from '../../../guards';

@Controller('/v1/deals')
@ApiTags('Deals')
export class DealController extends BaseController {
  constructor(@Inject(IDealService) private dealService: IDealService) {
    super();
  }

  @Get()
  @ApiOperation({ summary: 'Get All Deals' })
  async getAllDeals(
    @Res() response: express.Response,
    @Query() getDealsDto: FilterDealDto,
  ) {
    try {
      const [count, deals] = await Promise.all([
        this.dealService.countDealByCondition(getDealsDto),
        this.dealService.getDealListByCondition(getDealsDto),
      ]);
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: {
          total: count,
          deal_list: deals.map((deal) => deal.transformToResponse()),
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
  @ApiOperation({ summary: 'Get Deal Detail' })
  async getDealDetail(
    @Res() response: express.Response,
    @Param('id') dealId: string,
  ) {
    try {
      const deal = await this.dealService.getDealDetail(dealId);

      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: deal.transformToResponse(),
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
  @ApiOperation({ summary: 'Create Deal' })
  async createNewDeal(
    @Res() response: express.Response,
    @Body() createDealDto: CreateDealDto,
  ) {
    try {
      const createdDeal = await this.dealService.createDeal(createDealDto);
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: createdDeal.transformToResponse(),
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
  @ApiOperation({ summary: 'Update Deal' })
  async updateDeal(
    @Res() response: express.Response,
    @Body() updateDealDto: UpdateDealDto,
    @Param('id') dealId: string,
  ) {
    try {
      const updatedDeal = await this.dealService.updateDeal(
        dealId,
        updateDealDto,
      );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: updatedDeal,
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

  @Delete('/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Delete A Deal' })
  async deleteDeal(
    @Res() response: express.Response,
    @Param('id') dealId: string,
  ) {
    try {
      await this.dealService.deleteDeal(dealId);
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        message: 'Successfully deleted a deal',
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
