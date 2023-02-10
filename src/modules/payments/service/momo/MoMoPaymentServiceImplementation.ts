import { Inject } from '@nestjs/common';
import { ICurlService } from '../../../curl/service/CurlServiceInterface';
import { MoMoRequestTypeEnum } from '../../enum/MoMoEnum';

import {
  CreateMoMoPaymentMethodRequestType,
  MoMoPaymentMethodRequestPayloadType,
} from '../../type/MoMoPaymentType';
import { IMoMoPaymentService } from './MoMoPaymentServiceInterface';
import * as crypto from 'crypto-js';
import { TransactionPaymentMethodEnum } from '../../../transactions/enum/TransactionEnum';
import { OrderTypeEnum } from '../../../orders/enum/OrderEnum';

export class MoMoPaymentServiceImplementation implements IMoMoPaymentService {
  private accessKey: string;
  private secretKey: string;
  private extraData: string;
  private partnerCode: string;
  private partnerName: string;
  private ipnUrl: string;

  constructor(@Inject(ICurlService) private curlService: ICurlService) {
    this.accessKey = process.env.MOMO_WEBSITE_ACCESS_KEY;
    this.secretKey = process.env.MOMO_WEBSITE_SECRET_KEY;
    this.partnerCode = process.env.MOMO_PARTNER_CODE;
    this.extraData = '';
    this.partnerName = 'CÔNG TY CỔ PHẦN CARX ';
    this.ipnUrl = `${process.env.DOMAIN}/api/v1/payments/callback`;
  }

  async createPaymentMethodRequest(
    payload: CreateMoMoPaymentMethodRequestType,
  ): Promise<any> {
    try {
      const { transaction, order, payment_type, email } = payload;
      const orderId = order.type === OrderTypeEnum.BOOKING ? `${order.id}_v${order.booking.online_payment_attempt}` : order.id;
      const url = `${process.env.MOMO_DOMAIN}/v2/gateway/api/create`;
      let requestType: MoMoRequestTypeEnum;
      const redirectUrl = `carx-customer://app/PaymentSuccess/${orderId}`;
      switch (payment_type) {
        case TransactionPaymentMethodEnum.CASH:
          throw new Error('Cash payment type not supported');
        case TransactionPaymentMethodEnum.MOMO_ATM:
          requestType = MoMoRequestTypeEnum.ATM;
          break;
        case TransactionPaymentMethodEnum.MOMO_E_WALLET:
          requestType = MoMoRequestTypeEnum.E_WALLET;
          break;
        case TransactionPaymentMethodEnum.MOMO_CREDIT_CARD:
          requestType = MoMoRequestTypeEnum.CREDIT_CARD;
          break;
        default:
          console.log('request type: ' + requestType);
      }
      const rawSignature = `accessKey=${this.accessKey}&amount=${
        order.value
      }&extraData=${this.extraData}&ipnUrl=${this.ipnUrl}&orderId=${
        orderId
      }&orderInfo=${
        order.booking
          ? `Booking number: ${order.booking.booking_no}`
          : `Order number: ${order.order_no}`
      }&partnerCode=${this.partnerCode}&redirectUrl=${
        redirectUrl
      }&requestId=${
        transaction.id
      }&requestType=${requestType}`;
      const signature = crypto.HmacSHA256(rawSignature, this.secretKey);
      const hashedSignature = crypto.enc.Hex.stringify(signature);
      const requestData: MoMoPaymentMethodRequestPayloadType = {
        partnerName: this.partnerName,
        partnerCode: this.partnerCode,
        requestId: transaction.id,
        orderId: orderId,
        amount: order.value,
        extraData: this.extraData,
        orderInfo: `${
          order.booking
            ? `Booking number: ${order.booking.booking_no}`
            : `Order number: ${order.order_no}`
        }`,
        storeId: order.agent_id,
        redirectUrl: redirectUrl,
        requestType: requestType,
        lang: 'vi',
        ipnUrl: this.ipnUrl,
        signature: hashedSignature,
      };
      if (email) {
        requestData.userInfo = {
          email: email,
        }
      }
      if (requestType === MoMoRequestTypeEnum.E_WALLET) {
        requestData.items = order.items.map((item) => ({
          id: item.product_sku,
          currency: item.product.currency_unit,
          name: item.product.name,
          price: item.price,
          quantity: item.quantity,
          totalPrice: item.price * item.quantity,
          manufacturer: order.agent.name,
          unit: 'cái',
          lang: 'vi',
        }));
      }
      const result = await this.curlService.sendPostRequest({
        url: url,
        data: requestData,
      });
      return result;
    } catch (error) {
      console.log(
        'Tôi ở đây 👉👉 👉 file: MoMoPaymentServiceImplementation.ts 👉 line 89 👉 error',
        error,
      );
      throw error;
    }
  }
}
