import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BaseController } from '../../../BaseController';
import { AuthGuard } from '../../../guards';
import { ITrailerFormerRescueResponseService } from '../service/trailer-former-rescue-responses/TrailerFormerRescueResponseServiceInterface';
import * as express from 'express';
import { Result } from '../../../results/Result';
import {
  CreateTrailerFormerRescueResponseDto,
  FilterTrailerFormerRescueResponseDto,
  UpdateTrailerFormerRescueResponseDto,
} from '../dto/TrailerFormerRescueResponseDto';

@Controller('/v1/trailer-former-rescue-responses')
@ApiTags('Trailer Former Rescue Responses')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class TrailerFormerRescueResponseController extends BaseController {
  constructor(
    @Inject(ITrailerFormerRescueResponseService)
    private trailerFormerRescueResponseService: ITrailerFormerRescueResponseService,
  ) {
    super();
  }

  @Get()
  @ApiOperation({ summary: 'Get All Trailer Former Rescue Responses - Maintenance Agent' })
  async getAllTrailerFormerRescueResponses(
    @Res() response: express.Response,
    @Query() getTrailerFormerRescueResponsesDto: FilterTrailerFormerRescueResponseDto,
  ) {
    try {
      const trailerFormerRescueResponses =
        await this.trailerFormerRescueResponseService.getTrailerFormerRescueResponseList(
          getTrailerFormerRescueResponsesDto,
        );
      const total =
        await this.trailerFormerRescueResponseService.countTrailerFormerRescueResponseByCondition(
          getTrailerFormerRescueResponsesDto,
        );
      const data = trailerFormerRescueResponses.map((response) =>
        response.transformToResponse(),
      );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: {
          trailer_rescue_response_list: data,
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

  @Get(':id')
  @ApiOperation({ summary: 'Get Trailer Former Rescue Response Detail - Maintenance Agent' })
  async getTrailerFormerRescueResponseDetail(
    @Res() response: express.Response,
    @Param('id') trailerFormerRescueResponseId: string,
  ) {
    try {
      const trailerFormerRescueResponse =
        await this.trailerFormerRescueResponseService.getTrailerFormerRescueResponseDetail(
          trailerFormerRescueResponseId,
        );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: trailerFormerRescueResponse.transformToResponse(),
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
  @ApiOperation({ summary: 'Create Trailer Former Rescue Response - Maintenance Agent' })
  async createNewTrailerFormerRescueResponse(
    @Res() response: express.Response,
    @Body() createTrailerFormerRescueResponseDto: CreateTrailerFormerRescueResponseDto,
  ) {
    try {
      const createdTrailerFormerRescueResponse =
        await this.trailerFormerRescueResponseService.createTrailerFormerRescueResponse(
          createTrailerFormerRescueResponseDto,
        );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: createdTrailerFormerRescueResponse,
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

  @Post('/reject')
  @ApiOperation({ summary: 'Create Rejected Trailer Former Rescue Response - Maintenance Agent' })
  async createRejectedTrailerFormerRescueResponse(
    @Res() response: express.Response,
    @Body() createTrailerFormerRescueResponseDto: CreateTrailerFormerRescueResponseDto,
  ) {
    try {
      const createdTrailerFormerRescueResponse =
        await this.trailerFormerRescueResponseService.createRejectedTrailerFormerRescueResponse(
          createTrailerFormerRescueResponseDto,
        );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: createdTrailerFormerRescueResponse,
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

  @Patch(':id')
  @ApiOperation({ summary: 'Update Trailer Former Rescue Response - Maintenance Agent' })
  async updateTrailerFormerRescueResponse(
    @Res() response: express.Response,
    @Body() updateTrailerFormerRescueResponseDto: UpdateTrailerFormerRescueResponseDto,
    @Param('id') trailerFormerRescueResponseId: string,
  ) {
    try {
      const updatedTrailerFormerRescueResponse =
        await this.trailerFormerRescueResponseService.updateTrailerFormerRescueResponse(
          trailerFormerRescueResponseId,
          updateTrailerFormerRescueResponseDto,
        );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: updatedTrailerFormerRescueResponse,
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
