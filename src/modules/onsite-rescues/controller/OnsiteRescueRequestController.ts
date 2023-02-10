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
import { IOnsiteRescueRequestService } from '../service/onsite-rescue-requests/OnsiteRescueRequestServiceInterface';
import * as express from 'express';
import { Result } from '../../../results/Result';
import {
  CreateOnsiteRescueRequestDto,
  FilterOnsiteRescueRequestDto,
  UpdateOnsiteRescueRequestDto,
} from '../dto/OnsiteRescueRequestDto';
import { AuthGuard } from '../../../guards';

@Controller('/v1/onsite-rescue-requests')
@ApiTags('Onsite Rescue Requests')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class OnsiteRescueRequestController extends BaseController {
  constructor(
    @Inject(IOnsiteRescueRequestService)
    private onsiteRescueRequestService: IOnsiteRescueRequestService,
  ) {
    super();
  }

  @Get()
  @ApiOperation({ summary: 'Get All Onsite Rescue Requests' })
  async getAllOnsiteRescueRequests(
    @Res() response: express.Response,
    @Query() getOnsiteRescueRequestsDto: FilterOnsiteRescueRequestDto,
  ) {
    try {
      const onsiteRescueRequests =
        await this.onsiteRescueRequestService.getOnsiteRescueRequestList(
          getOnsiteRescueRequestsDto,
        );
      const total =
        await this.onsiteRescueRequestService.countOnsiteRescueRequestByCondition(
          getOnsiteRescueRequestsDto,
        );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: {
          onsite_rescue_request_list: onsiteRescueRequests,
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

  @Get('current/:customer_id')
  @ApiOperation({ summary: 'Get Current Onsite Rescue Requests' })
  async getCurrentOnsiteRescueRequest(
    @Res() response: express.Response,
    @Param('customer_id') customerId: string,
  ) {
    try {
      const onsiteRescueRequest =
        await this.onsiteRescueRequestService.getCurrentOnsiteRescueRequest(customerId);
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: {
          current_onsite_rescue_request: onsiteRescueRequest,
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

  @Get('agents/:agent_id')
  @ApiOperation({ summary: 'Get Not Yet Response Onsite Rescue Requests' })
  async getOnsiteRescueRequest(
    @Res() response: express.Response,
    @Param('agent_id') agentId: string,
  ) {
    try {
      const nResponses =
        await this.onsiteRescueRequestService.getNotYetResponseOnsiteRescueRequestByAgentId(agentId);
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: nResponses,
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
  @ApiOperation({ summary: 'Get Onsite Rescue Request Detail' })
  async getOnsiteRescueRequestDetail(
    @Res() response: express.Response,
    @Param('id') onsiteRescueRequestId: string,
  ) {
    try {
      const onsiteRescueRequest =
        await this.onsiteRescueRequestService.getOnsiteRescueRequestDetail(
          onsiteRescueRequestId,
        );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: onsiteRescueRequest,
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
  @ApiOperation({ summary: 'Create Onsite Rescue Request' })
  async createNewOnsiteRescueRequest(
    @Res() response: express.Response,
    @Body() createOnsiteRescueRequestDto: CreateOnsiteRescueRequestDto,
  ) {
    try {
      const createdOnsiteRescueRequest =
        await this.onsiteRescueRequestService.createOnsiteRescueRequest(
          createOnsiteRescueRequestDto,
        );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: createdOnsiteRescueRequest,
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
  @ApiOperation({ summary: 'Update Onsite Rescue Request' })
  async updateOnsiteRescueRequest(
    @Res() response: express.Response,
    @Body() updateOnsiteRescueRequestDto: UpdateOnsiteRescueRequestDto,
    @Param('id') onsiteRescueRequestId: string,
  ) {
    try {
      const updatedOnsiteRescueRequest =
        await this.onsiteRescueRequestService.updateOnsiteRescueRequest(
          onsiteRescueRequestId,
          updateOnsiteRescueRequestDto,
        );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: updatedOnsiteRescueRequest,
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
