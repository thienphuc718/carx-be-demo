import {
  Body,
  Controller,
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
import { ITrailerRescueRequestService } from '../service/trailer-rescue-requests/TrailerRescueRequestServiceInterface';
import * as express from 'express';
import { Result } from '../../../results/Result';
import {
  CreateTrailerRescueRequestDto,
  FilterTrailerRescueRequestDto,
  UpdateTrailerRescueRequestDto,
} from '../dto/TrailerRescueRequestDto';
import { AuthGuard } from '../../../guards';

@Controller('/v1/trailer-rescue-requests')
@ApiTags('Trailer Rescue Requests')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class TrailerRescueRequestController extends BaseController {
  constructor(
    @Inject(ITrailerRescueRequestService)
    private trailerRescueRequestService: ITrailerRescueRequestService,
  ) {
    super();
  }

  @Get()
  @ApiOperation({ summary: 'Get All Trailer Rescue Requests' })
  async getAllTrailerRescueRequests(
    @Res() response: express.Response,
    @Query() getTrailerRescueRequestsDto: FilterTrailerRescueRequestDto,
  ) {
    try {
      const trailerRescueRequests =
        await this.trailerRescueRequestService.getTrailerRescueRequestList(
          getTrailerRescueRequestsDto,
        );
      const total =
        await this.trailerRescueRequestService.countTrailerRescueRequestByCondition(
          getTrailerRescueRequestsDto,
        );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: {
          trailer_rescue_request_list: trailerRescueRequests,
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

  @Get('/agents/:agent_id')
  @ApiOperation({ summary: 'Get number of not yet response trailer rescue requests of agent'})
  async getNumberOfNotYetResponsesTrailerRescueRequest(
    @Res() response: express.Response,
    @Param('agent_id') agentId: string,
  ) {
    try {
      const nResponses = await this.trailerRescueRequestService.getNotYetResponseTrailerRescueRequestByAgentId(agentId);
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: nResponses
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

  @Get('current/:customer_id')
  @ApiOperation({ summary: 'Get Current Trailer Rescue Requests' })
  async getCurrentTrailerRescueRequest(
    @Res() response: express.Response,
    @Param('customer_id') customerId: string,
  ) {
    try {
      const trailerRescueRequest =
        await this.trailerRescueRequestService.getCurrentTrailerRescueRequest(customerId);
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: {
          current_trailer_rescue_request: trailerRescueRequest,
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
  @ApiOperation({ summary: 'Get Trailer Rescue Request Detail' })
  async getTrailerRescueRequestDetail(
    @Res() response: express.Response,
    @Param('id') trailerRescueRequestId: string,
  ) {
    try {
      const trailerRescueRequest =
        await this.trailerRescueRequestService.getTrailerRescueRequestDetail(
          trailerRescueRequestId,
        );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: trailerRescueRequest,
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
  @ApiOperation({ summary: 'Create Trailer Rescue Request' })
  async createNewTrailerRescueRequest(
    @Res() response: express.Response,
    @Body() createTrailerRescueRequestDto: CreateTrailerRescueRequestDto,
  ) {
    try {
      const createdTrailerRescueRequest =
        await this.trailerRescueRequestService.createTrailerRescueRequest(
          createTrailerRescueRequestDto,
        );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: createdTrailerRescueRequest,
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
  @ApiOperation({ summary: 'Update Trailer Rescue Request' })
  async updateTrailerRescueRequest(
    @Res() response: express.Response,
    @Body() updateTrailerRescueRequestDto: UpdateTrailerRescueRequestDto,
    @Param('id') trailerRescueRequestId: string,
  ) {
    try {
      const updatedTrailerRescueRequest =
        await this.trailerRescueRequestService.updateTrailerRescueRequest(
          trailerRescueRequestId,
          updateTrailerRescueRequestDto,
        );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: updatedTrailerRescueRequest,
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
