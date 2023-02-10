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
import { ITrailerLaterRescueResponseService } from '../service/trailer-later-rescue-responses/TrailerLaterRescueResponseServiceInterface';
import * as express from 'express';
import { Result } from '../../../results/Result';
import {
  CreateRejectedTrailerLaterRescueResponseDto,
  CreateTrailerLaterRescueResponseDto,
  FilterTrailerLaterRescueResponseDto,
  UpdateTrailerLaterRescueResponseDto,
} from '../dto/TrailerLaterRescueResponseDto';

@Controller('/v1/trailer-later-rescue-responses')
@ApiTags('Trailer Later Rescue Responses')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class TrailerLaterRescueResponseController extends BaseController {
  constructor(
    @Inject(ITrailerLaterRescueResponseService)
    private trailerLaterRescueResponseService: ITrailerLaterRescueResponseService,
  ) {
    super();
  }

  @Get()
  @ApiOperation({ summary: 'Get All Trailer Later Rescue Responses - Rescue Agent' })
  async getAllTrailerLaterRescueResponses(
    @Res() response: express.Response,
    @Query() getTrailerLaterRescueResponsesDto: FilterTrailerLaterRescueResponseDto,
  ) {
    try {
      const trailerLaterRescueResponses =
        await this.trailerLaterRescueResponseService.getTrailerLaterRescueResponseList(
          getTrailerLaterRescueResponsesDto,
        );
      const total =
        await this.trailerLaterRescueResponseService.countTrailerLaterRescueResponseByCondition(
          getTrailerLaterRescueResponsesDto,
        );
      const data = trailerLaterRescueResponses.map((response) =>
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
  @ApiOperation({ summary: 'Get Trailer Later Rescue Response Detail - Rescue Agent' })
  async getTrailerLaterRescueResponseDetail(
    @Res() response: express.Response,
    @Param('id') trailerLaterRescueResponseId: string,
  ) {
    try {
      const trailerLaterRescueResponse =
        await this.trailerLaterRescueResponseService.getTrailerLaterRescueResponseDetail(
          trailerLaterRescueResponseId,
        );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: trailerLaterRescueResponse.transformToResponse(),
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
  @ApiOperation({ summary: 'Create Later Trailer Rescue Response - Rescue Agent' })
  async createNewTrailerLaterRescueResponse(
    @Res() response: express.Response,
    @Body() createTrailerLaterRescueResponseDto: CreateTrailerLaterRescueResponseDto,
  ) {
    try {
      const createdTrailerLaterRescueResponse =
        await this.trailerLaterRescueResponseService.createTrailerLaterRescueResponse(
          createTrailerLaterRescueResponseDto,
        );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: createdTrailerLaterRescueResponse,
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
  @ApiOperation({ summary: 'Create Rejected Trailer Later Rescue Response - Rescue Agent' })
  async createRejectedTrailerLaterRescueResponse(
    @Res() response: express.Response,
    @Body() createTrailerLaterRescueResponseDto: CreateRejectedTrailerLaterRescueResponseDto,
  ) {
    try {
      const createdTrailerLaterRescueResponse =
        await this.trailerLaterRescueResponseService.createRejectedTrailerLaterRescueResponse(
          createTrailerLaterRescueResponseDto,
        );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: createdTrailerLaterRescueResponse,
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
  @ApiOperation({ summary: 'Update Trailer Later Rescue Response - Rescue Agent' })
  async updateTrailerLaterRescueResponse(
    @Res() response: express.Response,
    @Body() updateTrailerLaterRescueResponseDto: UpdateTrailerLaterRescueResponseDto,
    @Param('id') trailerLaterRescueResponseId: string,
  ) {
    try {
      const updatedTrailerLaterRescueResponse =
        await this.trailerLaterRescueResponseService.updateTrailerLaterRescueResponse(
          trailerLaterRescueResponseId,
          updateTrailerLaterRescueResponseDto,
        );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: updatedTrailerLaterRescueResponse,
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
