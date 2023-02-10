import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BaseController } from '../../../BaseController';
import { IFlashBuyResponseService } from '../service/flash-buy-response/FlashBuyResponseServiceInterface';
import * as express from 'express';
import {
  CreateFlashBuyResponseDto,
  CreateRejectedFlashBuyResponse,
  FilterFlashBuyResponseDto,
} from '../dto/FlashBuyResponseDto';
import { Result } from '../../../results/Result';
import { AuthGuard } from '../../../guards';

@Controller('/v1/flash-buy-responses')
@ApiTags('Flash Buy Response')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class FlashBuyResponseController extends BaseController {
  constructor(
    @Inject(IFlashBuyResponseService)
    private flashBuyRequestAgentRelationService: IFlashBuyResponseService,
  ) {
    super();
  }

  @Get()
  @ApiOperation({ summary: 'Get Flash Buy Responses ' })
  async getFlashBuyResponseList(
    @Res() response: express.Response,
    @Query() getFlashBuyResponseDto: FilterFlashBuyResponseDto,
  ) {
    try {
      const responses =
        await this.flashBuyRequestAgentRelationService.getFlashBuyResponseList(
          getFlashBuyResponseDto,
        );
      const total =
        await this.flashBuyRequestAgentRelationService.countFlashBuyResponseByCondition(
          getFlashBuyResponseDto,
        );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: {
          flash_buy_response_list: responses.map((response) =>
            response.transformToResponse(),
          ),
          total: total,
        },
      });
      return this.ok(response, result.value);
    } catch (error) {
      const result = Result.fail({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
      return this.fail(response, result.error);
    }
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Create Flash Buy Response ' })
  async createFlashBuyResponse(
    @Res() response: express.Response,
    @Body()
    createFlashBuyResponseDto: CreateFlashBuyResponseDto,
    @Req() request: express.Request,
  ) {
    try {
      const createdFlashBuyRequest =
        await this.flashBuyRequestAgentRelationService.createFlashBuyResponse(
          createFlashBuyResponseDto,
          request.user.id,
        );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: createdFlashBuyRequest.transformToResponse(),
      });
      return this.ok(response, result.value);
    } catch (error) {
      const result = Result.fail({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
      return this.fail(response, result.error);
    }
  }

  @Post('/rejections')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Create Rejected Flash Buy Response ' })
  async createRejectedFlashBuyResponse(
    @Res() response: express.Response,
    @Body()
    createRejectedFlashBuyResponseDto: CreateRejectedFlashBuyResponse,
  ) {
    try {
      const createdFlashBuyRequest =
        await this.flashBuyRequestAgentRelationService.createRejectedFlashBuyResponse(
          createRejectedFlashBuyResponseDto,
        );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: createdFlashBuyRequest.transformToResponse(),
      });
      return this.ok(response, result.value);
    } catch (error) {
      const result = Result.fail({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
      return this.fail(response, result.error);
    }
  }
}
