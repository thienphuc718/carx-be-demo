import { ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import {
  TransactionPaymentMethodEnum,
  TransactionPaymentTypeEnum,
  TransactionStatusEnum,
} from '../enum/TransactionEnum';

export class PaymentGatewayResponseData {
  @IsOptional()
  request_id?: string;

  @IsOptional()
  transaction_id?: string;

  @IsOptional()
  pay_url?: string;

  @IsOptional()
  deep_link?: string;

  @IsOptional()
  qr_code_url?: string;

  @IsOptional()
  pay_type?: string;

  @IsOptional()
  deep_link_mini_app?: string;

  @IsOptional()
  result_code?: string;

  @IsOptional()
  response_time?: string;

  @IsOptional()
  order_type?: string;

  @IsOptional()
  message?: string;

  @IsOptional()
  extra_data?: string;

  @IsOptional()
  signature?: string;
}

export class TransactionEntityDto {
  @IsNotEmpty()
  @IsUUID(4)
  order_id: string;

  @IsNotEmpty()
  @IsUUID(4)
  customer_id: string;

  @IsNotEmpty()
  @IsUUID(4)
  agent_id: string;

  @IsNotEmpty()
  @IsEnum(TransactionPaymentMethodEnum)
  payment_method: TransactionPaymentMethodEnum;

  @IsNotEmpty()
  @IsEnum(TransactionPaymentTypeEnum)
  payment_type: TransactionPaymentTypeEnum;

  @IsOptional()
  @IsEnum(TransactionStatusEnum)
  status?: TransactionStatusEnum;

  @IsOptional()
  payment_provider_response_data?: PaymentGatewayResponseData;
}

export class FilterTransactionDto {
  @Type(() => Number)
  @IsNumber()
  @Max(50)
  @Min(1)
  @ApiPropertyOptional({
    minimum: 1,
    maximum: 100,
    title: 'Limit',
    format: 'int32',
    default: 10,
  })
  limit: number;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @ApiPropertyOptional({
    minimum: 1,
    maximum: 10000,
    title: 'Limit',
    format: 'int32',
    default: 1,
  })
  page: number;

  agent_id: string;
  customer_id: string;
  status: TransactionStatusEnum;
}

export class CreateTransactionPayloadDto extends OmitType(
  TransactionEntityDto,
  ['payment_provider_response_data', 'status'] as const,
) {}

export class UpdateTransactionPayloadDto {
  @IsNotEmpty()
  @IsEnum(TransactionStatusEnum)
  status: TransactionStatusEnum;

  @IsOptional()
  payment_provider_response_data?: PaymentGatewayResponseData;
}
