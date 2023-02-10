import {
  Body,
  Controller,
  HttpStatus,
  Inject,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BaseController } from '../../../BaseController';
import { AuthGuard } from '../../../guards';
import * as express from 'express';
import { Result } from '../../../results/Result';
import { IPaymentService } from '../service/PaymentServiceInterface';
import {
  CreatePaymentRequestPayloadDto,
  PaymentNotificationPayloadDto,
} from '../dto/PaymentDto';
import {TransactionPaymentMethodEnum} from "../../transactions/enum/TransactionEnum";

@Controller('/v1/payments')
@ApiTags('Payments')
export class PaymentController extends BaseController {
  constructor(
    @Inject(IPaymentService) private paymentService: IPaymentService,
  ) {
    super();
  }

  @Post()
  @ApiOperation({ summary: 'Create Payment Transaction' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async createPaymentTransaction(
    @Res() response: express.Response,
    @Req() request: express.Request,
    @Body() payload: CreatePaymentRequestPayloadDto,
  ) {
    try {
      if (payload.payment_method === TransactionPaymentMethodEnum.MOMO_CREDIT_CARD && !payload.email) {
        return this.ok(response, Result.fail({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Email must be specified',
        }));
      }
      const userId = request.user.id;
      const responseData = await this.paymentService.createPaymentRequest({
        ...payload,
        user_id: userId,
      });
      const result = Result.ok({
        statusCode: responseData.statusCode,
        message: responseData.message,
        data: responseData.data ? responseData.data : null,
      });
      return this.ok(response, result.value);
    } catch (error) {
      const err = Result.fail({
        statusCode: error.resultCode || HttpStatus.INTERNAL_SERVER_ERROR,
        message: error?.response?.data?.message || error.message,
        data: error?.response?.data || error.data,
      });
      return this.fail(response, err.error);
    }
  }

  @Post('/callback')
  @ApiOperation({ summary: 'Callback URL' })
  async processingCallbackUrl(
    @Res() response: express.Response,
    @Req() request: express.Request,
    @Body() paymentNotificationPayloadDto: PaymentNotificationPayloadDto & {[key: string]: any},
  ) {
    try {
      console.log(paymentNotificationPayloadDto);
      const data = await this.paymentService.processPaymentNotification(
        paymentNotificationPayloadDto,
      );
      return response.sendStatus(data.statusCode);
    } catch (error) {
      const err = Result.fail({
        statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
      return this.fail(response, err.error);
    }
  }
}
