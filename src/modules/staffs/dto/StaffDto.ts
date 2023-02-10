import { Type } from 'class-transformer';
import {
  IsNumber,
  IsString,
  IsArray,
  IsOptional,
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  Min,
  Max,
  IsEnum,
  IsUUID,
  IsEmail,
} from 'class-validator';
import { UserModel } from '../../../models';
import { PartialType, OmitType, ApiPropertyOptional } from '@nestjs/swagger';
import { StaffStatusEnum } from '../enum/StaffEnum';

export class FilterStaffDto {
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
    maximum: 10000,
    title: 'Limit',
    format: 'int32',
    default: 1,
  })
  page: number;

  @IsOptional()
  @IsString()
  name?: string;
}

export class StaffPaymentMeyhodDto {
  @IsString()
  key: string;

  @IsString()
  value: string;
}

export class StaffEntityDto {
  @IsString()
  id: string;

  @IsUUID(4)
  user_id: string;

  @IsBoolean()
  is_deleted: boolean;

  @IsEnum(StaffStatusEnum)
  status: StaffStatusEnum;

  @IsString()
  name: string;

  @IsDateString()
  created_at: Date;

  @IsDateString()
  updated_at: Date;

  @IsOptional()
  user_details?: UserModel;

  @IsOptional()
  converted_name?: string;
}

export class StaffPayloadDto extends PartialType(StaffEntityDto) {
  @IsOptional()
  email?: string;

  @IsOptional()
  name?: string;

  @IsOptional()
  role_id?: string;

  @IsOptional()
  password?: string;
}

export class CreateStaffPayloadDto extends OmitType(StaffPayloadDto, [
  'user_details',
  'created_at',
  'updated_at',
  'user_id',
  'id',
  'is_deleted',
]) {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  role_id: string;
}

export class UpdateStaffPayloadDto extends OmitType(StaffPayloadDto, [
  'user_details',
  'created_at',
  'updated_at',
  'user_id',
  'id',
  'is_deleted',
]) {
  @IsOptional()
  email?: string;

  @IsOptional()
  @IsEnum(StaffStatusEnum)
  status?: StaffStatusEnum;
}

export class ChangePasswordStaffPayloadDto extends OmitType(StaffPayloadDto, [
  'user_details',
  'created_at',
  'updated_at',
  'user_id',
  'id',
  'is_deleted',
  'role_id',
  'email',
  'name',
]) {
  @IsNotEmpty()
  password: string;
}

export class CreateStaffEntityDto {
  @IsNotEmpty()
  @IsString()
  user_id: string;
}

export class UpdateStaffEntityDto extends PartialType(
  OmitType(StaffEntityDto, [
    'id',
    'user_id',
    'is_deleted',
    'created_at',
    'updated_at',
    'user_details',
  ] as const),
) {}
