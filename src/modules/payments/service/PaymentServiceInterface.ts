import { HttpStatus } from '@nestjs/common';
import { CreatePaymentRequestDto, PaymentNotificationPayloadDto } from '../dto/PaymentDto';

export interface IPaymentService {
  createPaymentRequest(payload: CreatePaymentRequestDto): Promise<{ statusCode: HttpStatus; message: string, data?: any }>;
  processPaymentNotification(payload: PaymentNotificationPayloadDto & {[key: string]: any}): Promise<{ statusCode: HttpStatus }>;
}

export const IPaymentService = Symbol('IPaymentService');
