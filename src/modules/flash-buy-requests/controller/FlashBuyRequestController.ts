import {
  Body,
  Controller,
  forwardRef,
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
import { IFlashBuyRequestService } from '../service/flash-buy-request/FlashBuyRequestServiceInterface';
import * as express from 'express';
import {
  CreateFlashBuyRequestDto,
  FilterFlashBuyRequestDto,
  UpdateFlashBuyRequestDto,
} from '../dto/FlashBuyRequestDto';
import { Result } from '../../../results/Result';
import { CreateFlashBuyResponseDto } from '../dto/FlashBuyResponseDto';
import { IFlashBuyResponseService } from '../service/flash-buy-response/FlashBuyResponseServiceInterface';
import { AuthGuard } from '../../../guards';

@Controller('/v1/flash-buy-requests')
@ApiTags('Flash Buy Request')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class FlashBuyRequestController extends BaseController {
  constructor(
    @Inject(IFlashBuyRequestService)
    private flashBuyRequestService: IFlashBuyRequestService,
  ) // @Inject(forwardRef(() => IFlashBuyResponseService))
  // private flashBuyRequestAgentRelationService: IFlashBuyResponseService,
  {
    super();
  }

  @Get()
  @ApiOperation({ summary: 'Get All Flash Buy Requests' })
  async getFlashBuyRequestList(
    @Res() response: express.Response,
    @Query() getFlashBuyDto: FilterFlashBuyRequestDto,
  ) {
    try {
      const flashBuyRequests =
        await this.flashBuyRequestService.getAllFlashBuyRequests(
          getFlashBuyDto,
        );
      const total =
        await this.flashBuyRequestService.countFlashBuyRequestByCondition(
          getFlashBuyDto,
        );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: {
          flash_buy_request_list: flashBuyRequests.map((request) =>
            request.transformToResponse(),
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

  @Get(':id')
  @ApiOperation({ summary: 'Get Flash Buy Request Detail' })
  async getFlashBuyRequestDetail(
    @Res() response: express.Response,
    @Param('id') flashBuyRequestId: string,
  ) {
    try {
      const flashBuyRequest =
        await this.flashBuyRequestService.getFlashBuyRequestDetail(
          flashBuyRequestId,
        );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: flashBuyRequest.transformToResponse(),
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

  @Get('/agents/:agent_id')
  @ApiOperation({ summary: 'Get Number Of Not Yet Responses Flash Buy Request' })
  async getNumberOfNotYetResponsesFlashBuyRequest(
    @Res() response: express.Response,
    @Param('agent_id') agent_id: string,
  ) {
    try {
      const nResponses =
        await this.flashBuyRequestService.getNumberNotYetResponsesFlashBuyRequestByAgentId(
          agent_id,
        );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: nResponses,
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
  @ApiOperation({ summary: 'Create Flash Buy Request ' })
  async createFlashBuyRequest(
    @Res() response: express.Response,
    @Body() createFlashBuyRequestDto: CreateFlashBuyRequestDto,
  ) {
    try {
      const createdFlashBuyRequest =
        await this.flashBuyRequestService.createFlashBuyRequest(
          createFlashBuyRequestDto,
        );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: createdFlashBuyRequest,
      });
      return this.ok(response, result.value);
    } catch (error) {
      const err = Result.fail({
        statusCode: error.code ? HttpStatus.BAD_REQUEST : HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
        errorCode: error.code,
        data: error.value
      });
      return this.fail(response, err.error);
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update Flash Buy Request' })
  async updateFlashBuyRequest(
    @Res() response: express.Response,
    @Body() updateFlashBuyRequestDto: UpdateFlashBuyRequestDto,
    @Param('id') flashBuyRequestId: string,
  ) {
    try {
      const updateFlashBuyRequest =
        await this.flashBuyRequestService.updateFlashBuyRequest(
          flashBuyRequestId,
          updateFlashBuyRequestDto,
        );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: updateFlashBuyRequest.transformToResponse(),
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
