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
import { IOnsiteRescueResponseService } from '../service/onsite-rescue-responses/OnsiteRescueResponseServiceInterface';
import * as express from 'express';
import { Result } from '../../../results/Result';
import {
  CreateOnsiteRescueResponseDto,
  FilterOnsiteRescueResponseDto,
  UpdateOnsiteRescueResponseDto,
} from '../dto/OnsiteRescueResponseDto';

@Controller('/v1/onsite-rescue-responses')
@ApiTags('Onsite Rescue Responses')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class OnsiteRescueResponseController extends BaseController {
  constructor(
    @Inject(IOnsiteRescueResponseService)
    private onsiteRescueResponseService: IOnsiteRescueResponseService,
  ) {
    super();
  }

  @Get()
  @ApiOperation({ summary: 'Get All Onsite Rescue Responses' })
  async getAllOnsiteRescueResponses(
    @Res() response: express.Response,
    @Query() getOnsiteRescueResponsesDto: FilterOnsiteRescueResponseDto,
  ) {
    try {
      const onsiteRescueResponses =
        await this.onsiteRescueResponseService.getOnsiteRescueResponseList(
          getOnsiteRescueResponsesDto,
        );
      const total =
        await this.onsiteRescueResponseService.countOnsiteRescueResponseByCondition(
          getOnsiteRescueResponsesDto,
        );
      const data = onsiteRescueResponses.map((response) =>
        response.transformToResponse(),
      );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: {
          onsite_rescue_response_list: data,
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
  @ApiOperation({ summary: 'Get Onsite Rescue Response Detail' })
  async getOnsiteRescueResponseDetail(
    @Res() response: express.Response,
    @Param('id') onsiteRescueResponseId: string,
  ) {
    try {
      const onsiteRescueResponse =
        await this.onsiteRescueResponseService.getOnsiteRescueResponseDetail(
          onsiteRescueResponseId,
        );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: onsiteRescueResponse.transformToResponse(),
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
  @ApiOperation({ summary: 'Create Onsite Rescue Response' })
  async createNewOnsiteRescueResponse(
    @Res() response: express.Response,
    @Body() createOnsiteRescueResponseDto: CreateOnsiteRescueResponseDto,
  ) {
    try {
      const createdOnsiteRescueResponse =
        await this.onsiteRescueResponseService.createOnsiteRescueResponse(
          createOnsiteRescueResponseDto,
        );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: createdOnsiteRescueResponse,
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
  @ApiOperation({ summary: 'Create Rejected Onsite Rescue Response' })
  async createRejectedOnsiteRescueResponse(
    @Res() response: express.Response,
    @Body() createOnsiteRescueResponseDto: CreateOnsiteRescueResponseDto,
  ) {
    try {
      const createdOnsiteRescueResponse =
        await this.onsiteRescueResponseService.createRejectedOnsiteRescueResponse(
          createOnsiteRescueResponseDto,
        );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: createdOnsiteRescueResponse,
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
  @ApiOperation({ summary: 'Update Onsite Rescue Response' })
  async updateOnsiteRescueResponse(
    @Res() response: express.Response,
    @Body() updateOnsiteRescueResponseDto: UpdateOnsiteRescueResponseDto,
    @Param('id') onsiteRescueResponseId: string,
  ) {
    try {
      const updatedOnsiteRescueResponse =
        await this.onsiteRescueResponseService.updateOnsiteRescueResponse(
          onsiteRescueResponseId,
          updateOnsiteRescueResponseDto,
        );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: updatedOnsiteRescueResponse,
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

  //   @Delete(':id')
  //   @ApiOperation({ summary: 'Delete A OnsiteRescueResponse' })
  //   async deleteOnsiteRescueResponse(
  //     @Res() response: express.Response,
  //     @Param('id') onsiteRescueResponseId: string,
  //     @Req() request: express.Request,
  //   ) {
  //     try {
  //       await this.onsiteRescueResponseService.deleteOnsiteRescueResponse(onsiteRescueResponseId);
  //       const result = Result.ok({
  //         statusCode: HttpStatus.OK,
  //         message: 'Successfully deleted a onsiteRescueResponse',
  //       });
  //       return this.ok(response, result.value);
  //     } catch (error) {
  //       const err = Result.fail({
  //         statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  //         message: error.message,
  //       });
  //       return this.fail(response, err.error);
  //     }
  //   }
}
