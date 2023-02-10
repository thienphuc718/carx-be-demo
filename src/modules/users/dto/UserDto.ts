import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Max,
  Min,
  IsEnum,
  IsArray,
  IsString,
  IsUUID, IsDate
} from 'class-validator';
import { CreateUserMethodEnum, UserTypeEnum } from '../enum/UserEnum';

export class FilterUserDto {
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
}

export class CreateUserDto {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password?: string;

  @IsOptional()
  phone_number?: string;

  @IsNotEmpty()
  @IsEnum(CreateUserMethodEnum)
  method: CreateUserMethodEnum;

  @IsNotEmpty()
  @IsEnum(UserTypeEnum)
  type: UserTypeEnum;
}

export class UserPayloadDto {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password?: string;

  @IsOptional()
  phone_number?: string;

  @IsNotEmpty()
  @IsEnum(CreateUserMethodEnum)
  method: CreateUserMethodEnum;

  type: any;

  @IsOptional()
  role_id?: string;

  @IsOptional()
  company_id?: string;

  @IsOptional()
  full_name?: string;
}

export class UpdateUserDto {
  @IsOptional()
  current_location?: string;

  @IsOptional()
  current_location_geo?: Record<string, any>;

  @IsOptional()
  email?: string;

  @IsOptional()
  phone_number?: string;

  @IsOptional()
  password?: string;

  @IsOptional()
  otp?: string;

  @IsOptional()
  country_code?: string;

  @IsOptional()
  city?: string;

  @IsOptional()
  first_name?: string;

  @IsOptional()
  last_name?: string;

  @IsOptional()
  full_name?: string;

  @IsOptional()
  avatar?: string;

  @IsOptional()
  address?: string;

  @IsOptional()
  is_verified?: boolean;

  @IsOptional()
  token?: string;

  @IsOptional()
  @IsUUID(4)
  role_id?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  otp_expiry_time?: Date;
}

export class CreateSocialUserDto {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsString()
  @IsNotEmpty()
  provider: string;

  @IsNotEmpty()
  user: any;
}

export class ChangePasswordDto {
  @IsNotEmpty()
  @IsString()
  current_password: string;

  @IsNotEmpty()
  @IsString()
  new_password: string;
}
