import { OmitType } from '@nestjs/swagger';
import {IsEmail, IsEnum, IsNotEmpty, IsOptional, IsUUID} from 'class-validator';
import { TransactionPaymentMethodEnum } from '../../transactions/enum/TransactionEnum';
import {Type} from "class-transformer";


export class CreatePaymentRequestDto {
  @IsNotEmpty()
  @IsEnum(TransactionPaymentMethodEnum)
  payment_method: TransactionPaymentMethodEnum;

  @IsNotEmpty()
  @IsUUID(4)
  order_id: string;

  @IsOptional()
  @IsUUID(4)
  user_id?: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}

export class CreatePaymentRequestPayloadDto extends OmitType(
  CreatePaymentRequestDto,
  ['user_id'] as const,
) {}

export class PaymentNotificationPayloadDto {
  @IsOptional()
  partnerCode?: string;

  @IsOptional()
  orderId?: string;

  @IsOptional()
  requestId?: string;

  @IsOptional()
  @Type(() => Number)
  amount?: number;

  @IsOptional()
  orderInfo?: string;

  @IsOptional()
  partnerUserId?: string;

  @IsOptional()
  orderType?: string;

  @IsOptional()
  transId?: string;

  @IsOptional()
  @Type(() => Number)
  resultCode?: number;

  @IsOptional()
  message?: string;

  @IsOptional()
  payType?: string;

  @IsOptional()
  @Type(() => Number)
  responseTime?: number;

  @IsOptional()
  extraData?: string;

  @IsOptional()
  signature?: string;

  @IsOptional()
  payUrl?: string;
}
