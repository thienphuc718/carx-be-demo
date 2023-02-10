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
} from '@nestjs/common';
import { ApiOperation, ApiTags, ApiExcludeController } from '@nestjs/swagger';
import { BaseController } from '../../../BaseController';
import * as express from 'express';
import { Result } from '../../../results/Result';
import { TransportationMethod } from '../../../constants';

@ApiTags('Transportation Methods')
// @ApiExcludeController()
@Controller('/v1/transportation-methods')
export class TransportationMethodController extends BaseController {
  constructor() {
    super();
  }

  @Get()
  @ApiOperation({ summary: 'Get All Transportation Methods' })
  async getAllTransportations(
    @Res() response: express.Response
  ) {
    try {
      let transportationMethods = new TransportationMethod;
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: transportationMethods.methods,
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
