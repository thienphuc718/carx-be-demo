import { OmitType, PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Max,
  Min,
  IsString,
  IsBoolean,
  IsDate,
  IsArray,
  IsEnum,
  IsUUID, IsInt,
} from 'class-validator';
import { OrderItemPayloadDto } from '../../orders/dto/requests/OrderItemRequestDto';
import { BookingStatusEnum } from '../enum/BookingEnum';

export class PaginationDto {
  @Type(() => Number)
  @IsNumber()
  @Max(50)
  @Min(1)
  @ApiPropertyOptional({
    minimum: 1,
    maximum: 50,
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
    title: 'Page',
    format: 'int32',
    default: 1,
  })
  page: number;
}

export class FilterListBookingDto extends PaginationDto {
  @IsOptional()
  @IsString()
  agent_id?: string;

  @IsOptional()
  @IsUUID(4)
  customer_id?: string;

  @Type(() => Array<string>)
  @IsOptional()
  status?: BookingStatusEnum[];
}

export class BookingEntityDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  order_id: string;

  @IsString()
  @IsNotEmpty()
  booking_date: Date;

  @IsString()
  @IsNotEmpty()
  booking_hour: string;

  @IsString()
  @IsOptional()
  completed_date: Date;

  @IsString()
  @IsOptional()
  completed_hour: string;

  @IsString()
  @IsNotEmpty()
  customer_id: string;

  @IsString()
  @IsNotEmpty()
  agent_id: string;

  @IsString()
  @IsOptional()
  note?: string;

  @IsString()
  @IsOptional()
  invoice_image?: string;

  @IsString()
  @IsOptional()
  vat_image?: string;

  @IsOptional()
  @IsEnum(BookingStatusEnum)
  status?: BookingStatusEnum;

  @IsBoolean()
  is_deleted: boolean;

  @IsDate()
  created_at: Date;

  @IsDate()
  updated_at: Date;

  @IsOptional()
  @IsInt()
  online_payment_attempt?: number;
}

export class CreateBookingEntityDto extends OmitType(BookingEntityDto, [
  'completed_date',
  'completed_hour',
] as const) {}

export class UpdateBookingEntityDto extends PartialType(
  OmitType(BookingEntityDto, [] as const),
) {}

export class ServiceItemPayloadDto {
  @IsString()
  service_code: string;

  @IsString()
  product_id: string;
}

export class BookingPayloadDto extends PartialType(BookingEntityDto) {
  @IsArray()
  @IsOptional()
  service_items?: ServiceItemPayloadDto[];
}

export class CreateBookingPayloadDto extends OmitType(BookingPayloadDto, [
  'id',
  'order_id',
  'customer_id',
  'is_deleted',
  'created_at',
  'updated_at',
  'completed_date',
  'completed_hour',
  'status',
  'invoice_image',
  'vat_image',
  'online_payment_attempt'
] as const) {
  @IsArray()
  @IsNotEmpty()
  service_items: ServiceItemPayloadDto[];
}

export class UpdateBookingPayloadDto extends PartialType(
  OmitType(CreateBookingPayloadDto, ['service_items', 'agent_id'] as const),
) {
  @IsString()
  @IsOptional()
  completed_date?: Date;

  @IsString()
  @IsOptional()
  completed_hour?: string;

  @IsOptional()
  @IsEnum(BookingStatusEnum)
  status?: BookingStatusEnum;

  @IsOptional()
  @IsString()
  invoice_image?: string;

  @IsString()
  @IsOptional()
  vat_image?: string;
}

export class UpdateServiceItemPriceDto {
  @IsNotEmpty()
  @IsString()
  service_item_id: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsString()
  product_id: string;
}

export class UpdateServiceItemsPayload {
  @IsNotEmpty()
  @IsArray()
  service_items: UpdateServiceItemPriceDto[];
}

export class CreateIncurringItemsPayloadDto {
  @IsNotEmpty()
  @IsArray()
  incurring_items: OrderItemPayloadDto[];
}

export class ReportBookingPayloadDto {
  @IsNotEmpty()
  @IsString()
  report_reason: string;
}

export class GetCountBookingByEachStatusDto {
  @IsOptional()
  @IsUUID(4)
  agent_id?: string;

  @IsOptional()
  @IsUUID(4)
  customer_id?: string;
}
