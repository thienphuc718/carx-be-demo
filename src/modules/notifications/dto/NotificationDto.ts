import { ApiPropertyOptional, OmitType, PartialType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { IsValidPromotionDate } from '../../promotions/helper/PromotionDatesHelper';
import {
  NotificationSegmentEnum,
  NotificationSendingTypeEnum,
  NotificationTargetGroupQueryEnum,
  NotificationTypeEnum,
} from '../enum/NotificationEnum';
import { IsValidNotificationTime } from '../helper/NotificationTimeValidationHelper';

export class NotificationEntityDto {
  @IsOptional()
  @IsObject()
  data?: Record<string, any>;

  @IsOptional()
  @IsString()
  image?: string;

  @IsNotEmpty()
  @IsString()
  message: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsEnum(NotificationTypeEnum)
  type?: NotificationTypeEnum;

  @IsOptional()
  @IsUUID(4)
  user_id?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    return [true, 'true'].indexOf(value) > -1;
  })
  is_read?: boolean;

  @IsOptional()
  @IsEnum(NotificationSegmentEnum)
  target_group?: NotificationSegmentEnum;

  @IsOptional()
  @IsEnum(NotificationSendingTypeEnum)
  sending_type?: NotificationSendingTypeEnum;

  @IsOptional()
  @IsValidPromotionDate()
  set_day?: string;

  @IsOptional()
  @IsValidNotificationTime()
  set_time?: string;

  @IsOptional()
  push_title?: string;

  @IsOptional()
  push_message?: string;

  @IsOptional()
  @IsObject()
  vendor_response?: Record<string, any>;
}

export class FilterNotificationDto {
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

  @IsOptional()
  @IsUUID(4)
  user_id?: string;
}

export class FilterAppNotificationDto {
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

  @IsOptional()
  @IsEnum(NotificationTargetGroupQueryEnum)
  target_group: NotificationTargetGroupQueryEnum;
}

export class CreateNotificationDto extends OmitType(NotificationEntityDto, [
  'is_read',
  'sending_type'
] as const) {
  @IsNotEmpty()
  @IsEnum(NotificationSegmentEnum)
  target_group: NotificationSegmentEnum;
}

export class CreateAppNotificationDto extends OmitType(CreateNotificationDto, ['user_id', 'type']) {}

export class UpdateNotificationDto extends PartialType(
  OmitType(NotificationEntityDto, [
    'user_id',
    'content',
    'data',
    'type',
    'image',
    'set_day',
    'set_time',
    'target_group',
    'sending_type',
    'vendor_response',
    'push_title',
    'push_message',
  ] as const),
) {}
