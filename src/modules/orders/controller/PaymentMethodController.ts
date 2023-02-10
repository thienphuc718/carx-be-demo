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
import { PaymentMethod } from '../../../constants';

@ApiTags('Payment Methods')
// @ApiExcludeController()
@Controller('/v1/payment-methods')
export class PaymentMethodController extends BaseController {
  constructor() {
    super();
  }

  @Get()
  @ApiOperation({ summary: 'Get All Payment Methods' })
  async getAllPaymentMethods(
    @Res() response: express.Response
  ) {
    try {
      let paymentMethods = new PaymentMethod;
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: paymentMethods.methods,
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
